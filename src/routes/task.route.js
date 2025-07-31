import mongoose from "mongoose";
import Task from "../models/tasks.model.js";
import { v4 as uuidv4 } from "uuid";
import User from "../models/user.model.js";

export const taskRoutes = async (fastify, options) => {
  // Fonction utilitaire pour valider les ObjectId MongoDB
  const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
  };

  const emitTaskNotification = (events, data, userId = null) => {
    try {
      const notification = {
        ...data,
        timestamp: new Date(),
        id: uuidv4(),
      };

      if (userId) {
        // Si un utilisateur est ciblé, on envoie la notification à son socket
        fastify.io.to(`user_${userId}`).emit(events, notification);
      } else {
        // Sinon, on envoie la notification à tous les utilisateurs connectés
        fastify.io.emit(events, notification);
      }
    } catch (error) {
      console.error("Erreur pour émettre une notification", error);
    }
  };
  /**
   * Get all Tasks for the authenticated user
   */
  fastify.get(
    "/get/tasks",
    { preHandler: fastify.authenticate },
    async (request) => {
      try {
        const tasks = await Task.find({ author: request.user.userId })
          .populate("author", "userName email")
          .sort({ createdAt: -1 });

        return {
          success: true,
          count: tasks.length,
          tasks,
        };
      } catch (error) {
        console.error("Erreur pour récupérer les tâches", error);
        return {
          success: false,
          error: "Impossible de récupérer les tâches",
        };
      }
    }
  );

  /**
   * Add Tasks
   */
  fastify.post(
    "/add/tasks",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      try {
        //Validation des données
        const { title, description } = request.body;
        if (!title || typeof title !== "string" || title.trim() === "") {
          return reply.code(400).send({
            success: false,
            error: "Le titre de la tache est obligatoire",
          });
        }

        if (
          !description ||
          typeof description !== "string" ||
          description.trim() === ""
        ) {
          return reply.code(400).send({
            success: false,
            error: "La description est obligatoire",
          });
        }

        // Créer la tâche avec l'auteur
        const task = new Task({
          ...request.body,
          author: request.user.userId, // L'ID de l'utilisateur est ajouté depuis le token JWT
        });

        // Sauvegarder la tâche
        const savedTask = await task.save();

        // Trouver l'utilisateur et ajouter la tâche à son tableau myTasks
        await User.findByIdAndUpdate(
          request.user.userId,
          { $push: { myTasks: savedTask._id } },
          { new: true, useFindAndModify: false }
        );

        //Notification en temps réel
        emitTaskNotification("taskCreated", {
          task: savedTask,
          message: `Nouvelle tache créée. Titre:  ${savedTask.title}`,
          type: "success",
          authorId: request.user.userId,
        });

        //Notification personnelle à l'utilisateur
        emitTaskNotification(
          "personalTaskCreated",
          {
            task: savedTask,
            message: "Votre tache a été créée avec succès",
            type: "info",
          },
          request.user.userId
        );

        return savedTask;
      } catch (error) {
        reply
          .code(500)
          .send({ error: "Erreur lors de la création de la tâche" });
      }
    }
  );

  /**
   * Update Task by Id
   */
  fastify.put(
    "/update/tasks/:id",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      try {
        const { id } = request.params;
        const userId = request.user.userId;

        // Validation de l'ID
        if (!isValidObjectId(id)) {
          return reply.code(400).send({
            success: false,
            error: "ID de tâche invalide",
          });
        }

        // Vérifier que la tâche existe et appartient à l'utilisateur
        const existingTask = await Task.findOne({ _id: id, author: userId });
        if (!existingTask) {
          return reply.code(404).send({
            success: false,
            error: "Tâche non trouvée ou accès non autorisé",
          });
        }

        // Valider les données de la requête
        const { title, description } = request.body;
        if (title && (typeof title !== "string" || title.trim() === "")) {
          return reply.code(400).send({
            success: false,
            error: "Le titre de la tâche est invalide",
          });
        }

        // Mettre à jour la tâche
        const updateData = { ...request.body };
        // Ne pas permettre la modification de l'auteur
        if (updateData.author) delete updateData.author;

        const updatedTask = await Task.findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true,
        }).populate("author", "userName email");

        if (!updatedTask) {
          return reply.code(500).send({
            success: false,
            error: "Échec de la mise à jour de la tâche",
          });
        }

        //Détecter les changements siginficative
        const statusChange = existingTask.status !== updatedTask.status;
        const priorityChange = existingTask.priority !== updatedTask.priority;

        //Notification en temps réel avec context
        let notificationMessage = `Tache "${updatedTask.title}" mise à jour`;

        if (statusChange) {
          notificationMessage = `Tache "${updatedTask.title}" - Status: ${updatedTask.status}`;
        } else if (priorityChange) {
          notificationMessage = `Tache "${updatedTask.title}" - Priority: ${updatedTask.priority}`;
        }

        // Notification en temps réel avec context
        // - previousTask pour stocker l'ancienne version de la tâche
        // - change pour stocker les changements (status, priority)
        emitTaskNotification("taskUpdated", {
          task: updatedTask,
          previousTask: existingTask,
          message: notificationMessage,
          type: statusChange ? "warning" : "info",
          change: {
            status: statusChange,
            priority: priorityChange,
          },
        });

        //Notification spécifique à la tache (si d'autre utilisateur collabore)
        fastify.io.to(`task_${id}`).emit("taskRoomUpdate", {
          taskId: id,
          task: updatedTask,
          updatedBy: userId,
          timestamp: new Date(),
        });

        return updatedTask;
      } catch (error) {
        reply.code(500).send({
          error: `Erreur lors de la mise à jour de la tâche ${error.message}`,
        });
      }
    }
  );

  /**
   * Get Task by Id
   */
  fastify.get(
    "/get/task/:id",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      try {
        const { id } = request.params;
        // Validation de l'ID
        if (!isValidObjectId(id)) {
          return reply.code(400).send({
            success: false,
            error: "ID de tâche invalide",
          });
        }

        const task = await Task.findOne({
          _id: id,
          author: request.user.userId,
        }).populate("author", "userName email");

        if (!task) {
          return reply
            .code(404)
            .send({ error: "Tâche non trouvée ou accès non autorisé" });
        }

        // Envoie une notification en temps réel pour signaler que la tâche a été vue
        // par l'utilisateur connecté
        emitTaskNotification(
          "taskViewed",
          {
            taskId: id,
            viewedBy: request.user.userId,
            taskTitle: task.title,
          },
          request.user.userId
        );

        return task;
      } catch (error) {
        reply
          .code(500)
          .send({ error: "Erreur lors de la récupération de la tâche" });
      }
    }
  );

  /**
   * Delete Task by Id
   */
  fastify.delete(
    "/delete/task/:id",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      try {
        const { id } = request.params;
        const userId = request.user.userId;

        // Validation de l'ID
        if (!isValidObjectId(id)) {
          return reply.code(400).send({
            success: false,
            error: "ID de tâche invalide",
          });
        }

        // Vérifier que la tâche existe et appartient à l'utilisateur
        const task = await Task.findOne({ _id: id, author: userId });
        if (!task) {
          return reply.code(404).send({
            success: false,
            error: "Tâche non trouvée ou accès non autorisé",
          });
        }

        // Supprimer la tâche
        await Task.findByIdAndDelete(id);

        // Supprimer la référence de la tâche dans le tableau myTasks de l'utilisateur
        await User.findByIdAndUpdate(
          userId,
          { $pull: { myTasks: id } },
          { new: true }
        );

        // Emettre une notification de suppression de tâche
        emitTaskNotification("taskDeleted", {
          taskId: id,
          taskTitle: task.title,
          message: `tache: ${task.title} supprimé`,
          deletedBy: userId,
        });

        // Informer les utilisateurs de la tâche qu'elle a été supprimée
        fastify.io.to(`task_${id}`).emit("taskRoomDeleted", {
          taskId: id,
          message: "Cette tache a été suprimé",
          timestamp: new Date(),
        });

        return {
          success: true,
          message: "Tâche supprimée avec succès",
          DeletedTaskId: id,
        };
      } catch (error) {
        reply.code(500).send({
          error: `Erreur lors de la suppression de la tâche ${error.message}`,
        });
      }
    }
  );
};

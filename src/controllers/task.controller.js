import Room from "../models/room.model.js";
import mongoose from "mongoose.js";
import Task from "../models/tasks.model.js";
import { v4 as uuidv4 } from "uuid";
import { isValidObjectId } from "../helpers/validateId.js";
import User from "../models/user.model.js";

export class TaskController {
  emitTaskNotification = (events, data, userId = null) => {
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
  async getTask(request) {
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

  async addTask(request, reply) {
    try {
      const {
        title,
        description,
        dueDate,
        estimatedHours,
        assignees = [],
        label,
        roomId,
        priority = "low",
        status = "pending",
      } = request.body;

      const userId = request.user.userId;

      //   Valider que les utilisateurs assignés existent
      if (assignees && assignees.length > 0) {
        const existingUsers = await User.find({ _id: { $in: assignees } });
        if (existingUsers.length !== assignees.length) {
          return reply.code(400).send({
            success: false,
            error: "Un ou plusieurs utilisateurs assignés n'existent pas",
          });
        }
      }

      // Vérifier que la salle existe et que l'utilisateur y a accès
      let room = null;
      if (roomId) {
        room = await Room.findOne({
          _id: roomId,
          $or: [
            { admin: request.user.userId },
            { members: request.user.userId },
          ],
        });

        if (!room) {
          return reply.code(403).send({
            success: false,
            error: "Salle non trouvée ou accès non autorisé",
          });
        }
      }

      if (!title || typeof title !== "string" || title.trim() === "") {
        return reply.code(400).send({
          success: false,
          error: "Le titre de la tâche est obligatoire",
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

      // Convertir la date si elle est fournie comme chaîne
      let dueDateObj;
      if (dueDate) {
        dueDateObj = new Date(dueDate);
        if (isNaN(dueDateObj.getTime())) {
          return reply.code(400).send({
            success: false,
            error: "Format de date d'échéance invalide",
          });
        }
        room;

        // Vérifier que la date est dans le futur
        if (dueDateObj <= new Date()) {
          return reply.code(400).send({
            success: false,
            error: "La date d'échéance doit être une date future",
          });
        }
      }

      if (!estimatedHours || typeof estimatedHours !== "number") {
        return reply.code(400).send({
          success: false,
          error: "Vous devez préciser l'heure d'estimation",
        });
      }

      // Chercher les utilisateurs assignés existants (sans doublon)
      const assigneesId = [...new Set(assignees)];
      // Chercher les utilisateurs assignés existants (sans doublon)
      const existingAssignees = await User.find({
        $and: [{ _id: { $in: assigneesId } }, { _id: { $ne: userId } }],
      }).select("_id");

      // Créer la tâche avec les données validées
      const taskData = {
        title: title.trim(),
        description: description ? description.trim() : "",
        status,
        priority,
        dueDate: dueDateObj,
        estimatedHours: parseFloat(estimatedHours) || 0,
        assignees: [...existingAssignees],
        label,
        author: request.user.userId,
        startDate: new Date(),
        room: roomId,
      };

      const task = new Task(taskData);

      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const savedTask = await task.save({ session });

        // Mettre à jour l'auteur avec la nouvelle tâche
        await User.findByIdAndUpdate(
          request.user.userId,
          {
            $addToSet: { myTasks: savedTask._id },
            $inc: { "stats.tasksCreated": 1 },
          },
          { session }
        );

        // Mettre à jour les utilisateurs assignés
        await User.updateMany(
          { _id: { $in: assignees } },
          { $addToSet: { collaborators: savedTask._id } },
          { session }
        );

        // Mettre à jour la salle avec la nouvelle tâche si nécessaire
        if (roomId) {
          await Room.findByIdAndUpdate(
            roomId,
            { $addToSet: { tasks: savedTask._id } },
            { session }
          );
        }

        await session.commitTransaction();
        session.endSession();

        // Notifications
        emitTaskNotification("taskCreated", {
          task: savedTask,
          message: `Nouvelle tâche créée: ${savedTask.title}`,
          type: "success",
          authorId: request.user.userId,
        });

        // Notifier les utilisateurs assignés
        assignees.forEach((userId) => {
          if (userId.toString() !== request.user.userId.toString()) {
            emitTaskNotification(
              "taskAssigned",
              {
                task: savedTask,
                message: `Vous avez été assigné à la tâche: ${savedTask.title}`,
                type: "info",
              },
              userId
            );
          }
        });

        return savedTask;
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error; // Laisser le bloc catch global gérer l'erreur
      }
    } catch (error) {
      console.error("Erreur lors de la création de la tâche:", error);
      reply.code(500).send({
        success: false,
        error: `Une erreur est survenue lors de la création de la tâche: ${error.message}`,
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  async updateTask(request, reply) {
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
      const { title, description, dueDate, estimatedHours } = request.body;
      if (title && (typeof title !== "string" || title.trim() === "")) {
        return reply.code(400).send({
          success: false,
          error: "Le titre de la tâche est invalide",
        });
      }

      if (
        description &&
        (typeof description !== "string" || description.trim() === "")
      ) {
        return reply.code(400).send({
          success: false,
          error: "La description est invalide",
        });
      }

      // Convertir la date si elle est fournie comme chaîne
      let dueDateObj;
      if (dueDate) {
        dueDateObj = new Date(dueDate);
        if (isNaN(dueDateObj.getTime())) {
          return reply.code(400).send({
            success: false,
            error: "Format de date d'échéance invalide",
          });
        }

        // Vérifier que la date est dans le futur
        if (dueDateObj <= new Date()) {
          return reply.code(400).send({
            success: false,
            error: "La date d'échéance doit être une date future",
          });
        }
      }

      if (estimatedHours && typeof estimatedHours !== "number") {
        return reply.code(400).send({
          success: false,
          error: "L'heure d'estimation doit etre un nombre",
        });
      }

      // Mettre à jour la tâche
      const updateData = { ...request.body };
      // Ne pas permettre la modification de l'auteur
      if (updateData.author) delete updateData.author;
      if (updateData.room) delete updateData.room;

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

      const statusDone = updateData.status === "done";
      if (statusDone) {
        await User.findByIdAndUpdate(
          userId,
          { $inc: { "stats.tasksCompleted": 1 } },
          { new: true }
        );
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

  async getById(request, reply) {
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

  async delete(request, reply) {
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
}

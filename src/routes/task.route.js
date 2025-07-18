import Task from "../models/tasks.model.js";

export const taskRoutes = async (fastify, options) => {
  //Get all Tasks for the authenticated user
  fastify.get("/get/tasks", { preHandler: fastify.authenticate }, async (request) => {
    return await Task.find({ author: request.user.userId });
  });

  //Add Tasks
  fastify.post("/add/tasks", { preHandler: fastify.authenticate }, async (request, reply) => {
    try {
      // Créer la tâche avec l'auteur
      const task = new Task({
        ...request.body,
        author: request.user.userId // L'ID de l'utilisateur est ajouté depuis le token JWT
      });
      
      // Sauvegarder la tâche
      const savedTask = await task.save();
      
      // Trouver l'utilisateur et ajouter la tâche à son tableau myTasks
      const User = (await import('../models/user.model.js')).default;
      await User.findByIdAndUpdate(
        request.user.userId,
        { $push: { myTasks: savedTask._id } },
        { new: true, useFindAndModify: false }
      );
      
      return savedTask;
    } catch (error) {
      reply.code(500).send({ error: 'Erreur lors de la création de la tâche' });
    }
  });

  // Update Task by Id
  fastify.put("/update/tasks/:id", { preHandler: fastify.authenticate }, async (request, reply) => {
    try {
      const { id } = request.params;
      const userId = request.user.userId;
      
      // Vérifier que la tâche existe et appartient à l'utilisateur
      const task = await Task.findOne({ _id: id, author: userId });
      if (!task) {
        return reply.code(404).send({ error: 'Tâche non trouvée ou accès non autorisé' });
      }
      
      // Mettre à jour la tâche
      const updatedTask = await Task.findByIdAndUpdate(
        id,
        { ...request.body, author: userId }, // S'assurer que l'auteur ne peut pas être modifié
        { new: true }
      );
      
      return updatedTask;
    } catch (error) {
      reply.code(500).send({ error: 'Erreur lors de la mise à jour de la tâche' });
    }
  });

  // Get Task by Id
  fastify.get("/get/task/:id", { preHandler: fastify.authenticate }, async (request, reply) => {
    try {
      const { id } = request.params;
      const task = await Task.findOne({ _id: id, author: request.user.userId });
      
      if (!task) {
        return reply.code(404).send({ error: 'Tâche non trouvée ou accès non autorisé' });
      }
      
      return task;
    } catch (error) {
      reply.code(500).send({ error: 'Erreur lors de la récupération de la tâche' });
    }
  });

  // Delete Task by Id
  fastify.delete("/delete/task/:id", { preHandler: fastify.authenticate }, async (request, reply) => {
    try {
      const { id } = request.params;
      const userId = request.user.userId;
      
      // Vérifier que la tâche existe et appartient à l'utilisateur
      const task = await Task.findOne({ _id: id, author: userId });
      if (!task) {
        return reply.code(404).send({ error: 'Tâche non trouvée ou accès non autorisé' });
      }
      
      // Supprimer la tâche
      await Task.findByIdAndDelete(id);
      
      // Supprimer la référence de la tâche dans le tableau myTasks de l'utilisateur
      const User = (await import('../models/user.model.js')).default;
      await User.findByIdAndUpdate(
        userId,
        { $pull: { myTasks: id } },
        { new: true }
      );
      
      return { message: 'Tâche supprimée avec succès' };
    } catch (error) {
      reply.code(500).send({ error: 'Erreur lors de la suppression de la tâche' });
    }
    return { message: "Task deleted !" };
  });
};

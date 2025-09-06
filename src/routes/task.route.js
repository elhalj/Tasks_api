import { TaskController } from "../controllers/task.controller.js";

const taskController = new TaskController();

export const taskRoutes = async (fastify, options) => {
  fastify.get(
    "/get/tasks",
    { preHandler: fastify.authenticate },
    taskController.getTask
  );

  /**
   * Add Tasks
   */
  /**
   * Ajouter une tâche
   *
   * @param {string} title          Titre de la tâche
   * @param {string} description    Description de la tâche
   * @param {Date}   dueDate        Date d'échéance de la tâche
   * @param {number} estimatedHours Heures estimées pour la tâche
   * @param {string[]} assignees    Identifiants des utilisateurs assignés
   * @param {string}  roomId        Identifiant de la salle de la tâche
   * @param {string}  priority      Priorité de la tâche (low, medium, high, critical)
   * @param {string}  status        Statut de la tâche (pending, in_progress, done, canceled)
   */
  fastify.post(
    "/add/tasks",
    { preHandler: fastify.authenticate },
    taskController.addTask
  );

  //Add task to room
  // fastify.post(
  //   "add/room/task/:roomId",
  //   { preHandler: fastify.authenticate },
  //   async (request, reply) => {
  //     const { roomId } = request.params;
  //     const {
  //       title,
  //       description,
  //       dueDate,
  //       estimatedHours,
  //       // assignees,
  //       // roomId,
  //       priority = "low",
  //       status = "pending",
  //     } = request.body;

  //     if (!title || typeof title !== "string" || title.trim() === "") {
  //       return reply.code(400).send({
  //         success: false,
  //         error: "Le titre de la tâche est obligatoire",
  //       });
  //     }

  //     if (
  //       !description ||
  //       typeof description !== "string" ||
  //       description.trim() === ""
  //     ) {
  //       return reply.code(400).send({
  //         success: false,
  //         error: "La description est obligatoire",
  //       });
  //     }

  //     // Convertir la date si elle est fournie comme chaîne
  //     let dueDateObj;
  //     if (dueDate) {
  //       dueDateObj = new Date(dueDate);
  //       if (isNaN(dueDateObj.getTime())) {
  //         return reply.code(400).send({
  //           success: false,
  //           error: "Format de date d'échéance invalide",
  //         });
  //       }

  //       // Vérifier que la date est dans le futur
  //       if (dueDateObj <= new Date()) {
  //         return reply.code(400).send({
  //           success: false,
  //           error: "La date d'échéance doit être une date future",
  //         });
  //       }
  //     }

  //     if (!estimatedHours || typeof estimatedHours !== "number") {
  //       return reply.code(400).send({
  //         success: false,
  //         error: "Vous devez préciser l'heure d'estimation",
  //       });
  //     }

  //     const roomExist = await Room.findById(roomId);
  //     if (!roomExist) {
  //       return reply.code(401).send({
  //         success: false,
  //         message: "Room Invalid ou ID room inexistante",
  //       });
  //     }

  //     // Créer la tâche avec les données validées
  //     const taskData = {
  //       title: title.trim(),
  //       description: description ? description.trim() : "",
  //       status,
  //       priority,
  //       dueDate: dueDateObj,
  //       estimatedHours: parseFloat(estimatedHours) || 0,
  //       // assignees,
  //       author: request.user.userId,
  //       startDate: new Date(),
  //       // room: roomId,
  //     };

  //     const task = new Task(taskData);

  //     const session = await mongoose.startSession();
  //     session.startTransaction();

  //     try {
  //       const savedTask = await task.save({ session });

  //       // Mettre à jour l'auteur avec la nouvelle tâche
  //       await User.findByIdAndUpdate(
  //         request.user.userId,
  //         {
  //           $addToSet: { myTasks: savedTask._id },
  //           $inc: { "stats.tasksCreated": 1 },
  //         },
  //         { session }
  //       );

  //       await Room.findByIdAndUpdate(
  //         roomId,
  //         { $addToSet: { tasks: savedTask._id } },
  //         { session }
  //       );

  //       await session.commitTransaction();
  //       session.endSession();
  //     } catch (error) {
  //       await session.abortTransaction();
  //       session.endSession();
  //       throw error; // Laisser le bloc catch global gérer l'erreur
  //     }
  //   }
  // );

  /**
   * Update Task by Id
   */
  fastify.put(
    "/update/tasks/:id",
    { preHandler: fastify.authenticate },
    taskController.updateTask
  );

  /**
   * Get Task by Id
   */
  fastify.get(
    "/get/task/:id",
    { preHandler: fastify.authenticate },
    taskController.getById
  );

  /**
   * Delete Task by Id
   */
  fastify.delete(
    "/delete/task/:id",
    { preHandler: fastify.authenticate },
    taskController.delete
  );
};

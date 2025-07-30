import fastify from "fastify";
import { v4 as uuidv4 } from "uuid";
// Helper task fonction pour émettre des notifications
// events = nom de l'événement émit (par exemple 'task-created')
// data = données à envoyer avec l'événement (par exemple { title: 'foo', description: 'bar' })
// userId = id de l'utilisateur ciblé, si null, la notification est envoyée à tous les utilisateurs connectés
export const emitTaskNotification = (events, data, userId = null) => {
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
};

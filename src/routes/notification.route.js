import { NotificationController } from "../controllers/notification.controller.js";

const notificationController = new NotificationController();

export const notificationRoutes = async (fastify, options) => {
  // Créer une notification (réservé aux utilisateurs authentifiés)
  fastify.post(
    "/notifications",
    { preHandler: fastify.authenticate },
    notificationController.createNotification
  );

  // Récupérer les notifications de l'utilisateur
  fastify.get(
    "/notifications",
    { preHandler: fastify.authenticate },
    notificationController.getUserNotifications
  );

  // Marquer une notification comme lue
  fastify.patch(
    "/notifications/:notificationId/read",
    { preHandler: fastify.authenticate },
    notificationController.markAsRead
  );

  // Marquer toutes les notifications comme lues
  fastify.patch(
    "/notifications/read-all",
    { preHandler: fastify.authenticate },
    notificationController.markAllAsRead
  );

  // Supprimer une notification
  fastify.delete(
    "/notifications/:notificationId",
    { preHandler: fastify.authenticate },
    notificationController.deleteNotification
  );

  // Obtenir le nombre de notifications non lues
  fastify.get(
    "/notifications/unread-count",
    { preHandler: fastify.authenticate },
    notificationController.getUnreadCount
  );
};

export default notificationRoutes;

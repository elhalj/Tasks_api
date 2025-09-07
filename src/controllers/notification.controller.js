import { Notification } from "../models/notify.model.js";
import mongoose from "mongoose";

export class NotificationController {
  /**
   * Créer une nouvelle notification
   */
  async createNotification(request, reply) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { recipients, type, title, message, relatedDocument, metadata = {} } = request.body;
      const sender = request.user?.userId;

      // Validation des données requises
      if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
        return reply.status(400).send({
          success: false,
          message: 'Au moins un destinataire est requis',
        });
      }

      if (!type || !title || !message) {
        return reply.status(400).send({
          success: false,
          message: 'Le type, le titre et le message sont obligatoires',
        });
      }

      // Création de la notification
      const notification = await Notification.createNotification({
        recipients,
        sender,
        type,
        title,
        message,
        relatedDocument,
        metadata,
      });

      await session.commitTransaction();
      session.endSession();

      return reply.status(201).send({
        success: true,
        data: notification,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error('Erreur lors de la création de la notification:', error);
      return reply.status(500).send({
        success: false,
        message: 'Erreur lors de la création de la notification',
        error: error.message,
      });
    }
  }

  /**
   * Récupérer les notifications d'un utilisateur
   */
  async getUserNotifications(request, reply) {
    try {
      const userId = request.user?.userId;
      const { limit = 20, page = 1, isRead } = request.query;

      if (!userId) {
        return reply.status(401).send({
          success: false,
          message: 'Authentification requise',
        });
      }

      const query = { recipients: userId };
      
      // Filtrer par statut de lecture si spécifié
      if (isRead === 'true' || isRead === 'false') {
        query.isRead = isRead === 'true';
      }

      const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { createdAt: -1 },
        populate: [
          { path: 'sender', select: 'userName email profile.avatar' },
          { path: 'relatedDocument.id', select: 'title content name' },
        ],
      };

      const notifications = await Notification.paginate(query, options);

      return reply.send({
        success: true,
        data: {
          notifications: notifications.docs,
          pagination: {
            total: notifications.totalDocs,
            pages: notifications.totalPages,
            page: notifications.page,
            limit: notifications.limit,
          },
        },
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      return reply.status(500).send({
        success: false,
        message: 'Erreur lors de la récupération des notifications',
        error: error.message,
      });
    }
  }

  /**
   * Marquer une notification comme lue
   */
  async markAsRead(request, reply) {
    const { notificationId } = request.params;
    const userId = request.user?.userId;

    try {
      if (!userId) {
        return reply.status(401).send({
          success: false,
          message: 'Authentification requise',
        });
      }

      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, recipients: userId },
        { $addToSet: { readBy: userId } },
        { new: true }
      );

      if (!notification) {
        return reply.status(404).send({
          success: false,
          message: 'Notification non trouvée ou accès refusé',
        });
      }

      return reply.send({
        success: true,
        data: notification,
      });
    } catch (error) {
      console.error('Erreur lors du marquage de la notification comme lue:', error);
      return reply.status(500).send({
        success: false,
        message: 'Erreur lors du marquage de la notification comme lue',
        error: error.message,
      });
    }
  }

  /**
   * Marquer toutes les notifications comme lues
   */
  async markAllAsRead(request, reply) {
    const userId = request.user?.userId;

    try {
      if (!userId) {
        return reply.status(401).send({
          success: false,
          message: 'Authentification requise',
        });
      }

      await Notification.updateMany(
        { recipients: userId, isRead: false },
        { $set: { isRead: true }, $addToSet: { readBy: userId } },
        { multi: true }
      );

      return reply.send({
        success: true,
        message: 'Toutes les notifications ont été marquées comme lues',
      });
    } catch (error) {
      console.error('Erreur lors du marquage des notifications comme lues:', error);
      return reply.status(500).send({
        success: false,
        message: 'Erreur lors du marquage des notifications comme lues',
        error: error.message,
      });
    }
  }

  /**
   * Supprimer une notification
   */
  async deleteNotification(request, reply) {
    const { notificationId } = request.params;
    const userId = request.user?.userId;

    try {
      if (!userId) {
        return reply.status(401).send({
          success: false,
          message: 'Authentification requise',
        });
      }

      // Seul le créateur ou un admin peut supprimer une notification
      const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        $or: [
          { sender: userId },
          { recipients: userId },
        ],
      });

      if (!notification) {
        return reply.status(404).send({
          success: false,
          message: 'Notification non trouvée ou accès refusé',
        });
      }

      return reply.send({
        success: true,
        message: 'Notification supprimée avec succès',
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error);
      return reply.status(500).send({
        success: false,
        message: 'Erreur lors de la suppression de la notification',
        error: error.message,
      });
    }
  }

  /**
   * Obtenir le nombre de notifications non lues
   */
  async getUnreadCount(request, reply) {
    const userId = request.user?.userId;

    try {
      if (!userId) {
        return reply.status(401).send({
          success: false,
          message: 'Authentification requise',
        });
      }

      const count = await Notification.countDocuments({
        recipients: userId,
        isRead: false,
      });

      return reply.send({
        success: true,
        data: { unreadCount: count },
      });
    } catch (error) {
      console.error('Erreur lors du comptage des notifications non lues:', error);
      return reply.status(500).send({
        success: false,
        message: 'Erreur lors du comptage des notifications non lues',
        error: error.message,
      });
    }
  }
}

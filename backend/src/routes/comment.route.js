import mongoose from "mongoose";
import { isValidObjectId } from "../helpers/validateId.js";
import Comment from "../models/comment.model.js";
import Task from "../models/tasks.model.js";
import Room from "../models/room.model.js";
import User from "../models/user.model.js";

export const commentRoutes = async (fastify, options) => {
  // Ajouter un commentaire
  fastify.post(
    "/add/comments",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      const { content, taskId, roomId } = request.body;
      const userId = request.user.userId;

      // Validation des entrées
      if (!content || typeof content !== "string" || content.trim() === "") {
        return reply.code(400).send({
          success: false,
          error:
            "Le contenu du commentaire est requis et doit être une chaîne de caractères valide",
        });
      }

      if (!taskId && !roomId) {
        return reply.code(400).send({
          success: false,
          error: "Un commentaire doit être associé à une tâche ou une salle",
        });
      }

      try {
        const session = await mongoose.startSession();
        session.startTransaction();

        // Vérifier que la tâche ou la salle existe
        if (taskId) {
          const task = await Task.findById(taskId).session(session);
          if (!task) {
            await session.abortTransaction();
            session.endSession();
            return reply.code(404).send({
              success: false,
              error: "Tâche non trouvée",
            });
          }
        } else if (roomId) {
          const room = await Room.findById(roomId).session(session);
          if (!room) {
            await session.abortTransaction();
            session.endSession();
            return reply.code(404).send({
              success: false,
              error: "Salle non trouvée",
            });
          }
        }

        // Création du commentaire
        const commentData = {
          content: content.trim(),
          author: userId,
          ...(taskId && { task: taskId }),
          ...(roomId && { room: roomId }),
        };

        const comment = new Comment(commentData);
        await comment.save({ session });

        // Mise à jour du modèle parent (Task ou Room)
        if (taskId) {
          await Task.findByIdAndUpdate(
            taskId,
            { $push: { comments: comment._id } },
            { session, new: true }
          );
        } else if (roomId) {
          await Room.findByIdAndUpdate(
            roomId,
            { $push: { comments: comment._id } },
            { session, new: true }
          );
        }

        // Mise à jour des statistiques de l'utilisateur
        await User.findByIdAndUpdate(
          userId,
          { $inc: { "stats.commentsPosted": 1 } },
          { session, new: true }
        );

        await session.commitTransaction();
        session.endSession();

        return {
          success: true,
          comment: await comment.populate("author", "userName email"),
        };
      } catch (error) {
        await session?.abortTransaction();
        session?.endSession();
        console.error("Erreur lors de l'ajout du commentaire:", error);
        return reply.code(500).send({
          success: false,
          error: "Une erreur est survenue lors de l'ajout du commentaire",
        });
      }
    }
  );

  // Mettre à jour un commentaire
  fastify.put(
    "/update/comments/:commentId",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      const { commentId } = request.params;
      const { content } = request.body;
      const userId = request.user.userId;

      if (!isValidObjectId(commentId)) {
        return reply.code(400).send({
          success: false,
          error: "ID de commentaire invalide",
        });
      }

      if (!content || typeof content !== "string" || content.trim() === "") {
        return reply.code(400).send({
          success: false,
          error: "Le contenu du commentaire est requis",
        });
      }

      try {
        const comment = await Comment.findOneAndUpdate(
          { _id: commentId, author: userId },
          {
            content: content.trim(),
            isEdited: true,
            editedAt: new Date(),
          },
          { new: true, runValidators: true }
        );

        if (!comment) {
          return reply.code(404).send({
            success: false,
            error:
              "Commentaire non trouvé ou vous n'êtes pas autorisé à le modifier",
          });
        }

        return {
          success: true,
          comment: await comment.populate("author", "userName email"),
        };
      } catch (error) {
        console.error("Erreur lors de la mise à jour du commentaire:", error);
        return reply.code(500).send({
          success: false,
          error:
            "Une erreur est survenue lors de la mise à jour du commentaire",
        });
      }
    }
  );

  // Supprimer un commentaire
  fastify.delete(
    "/delete/comments/:commentId",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      const { commentId } = request.params;
      const userId = request.user.userId;

      if (!isValidObjectId(commentId)) {
        return reply.code(400).send({
          success: false,
          error: "ID de commentaire invalide",
        });
      }

      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        // Trouver le commentaire et vérifier les droits
        const comment = await Comment.findOneAndDelete({
          _id: commentId,
          author: userId, // Seul l'auteur peut supprimer son commentaire
        }).session(session);

        if (!comment) {
          await session.abortTransaction();
          session.endSession();
          return reply.code(404).send({
            success: false,
            error:
              "Commentaire non trouvé ou vous n'êtes pas autorisé à le supprimer",
          });
        }

        // Supprimer la référence du commentaire du modèle parent
        if (comment.task) {
          await Task.findByIdAndUpdate(
            comment.task,
            { $pull: { comments: commentId } },
            { session }
          );
        } else if (comment.room) {
          await Room.findByIdAndUpdate(
            comment.room,
            { $pull: { comments: commentId } },
            { session }
          );
        }

        await session.commitTransaction();
        session.endSession();

        return { success: true, message: "Commentaire supprimé avec succès" };
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Erreur lors de la suppression du commentaire:", error);
        return reply.code(500).send({
          success: false,
          error:
            "Une erreur est survenue lors de la suppression du commentaire",
        });
      }
    }
  );

  // Ajouter une réponse à un commentaire
  fastify.post(
    "/reply/comments/:commentId/replies",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      const { commentId } = request.params;
      const { content } = request.body;
      const userId = request.user.userId;

      if (!isValidObjectId(commentId)) {
        return reply.code(400).send({
          success: false,
          error: "ID de commentaire invalide",
        });
      }

      if (!content || typeof content !== "string" || content.trim() === "") {
        return reply.code(400).send({
          success: false,
          error: "Le contenu de la réponse est requis",
        });
      }

      try {
        const comment = await Comment.findByIdAndUpdate(
          commentId,
          {
            $push: {
              replies: {
                content: content.trim(),
                author: userId,
              },
            },
          },
          { new: true, runValidators: true }
        ).populate("replies.author", "userName email");

        if (!comment) {
          return reply.code(404).send({
            success: false,
            error: "Commentaire non trouvé",
          });
        }

        return {
          success: true,
          reply: comment.replies[comment.replies.length - 1],
        };
      } catch (error) {
        console.error("Erreur lors de l'ajout de la réponse:", error);
        return reply.code(500).send({
          success: false,
          error: "Une erreur est survenue lors de l'ajout de la réponse",
        });
      }
    }
  );

  // Récupérer les commentaires d'une tâche ou d'une salle
  fastify.get(
    "/get/comments",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      const { taskId, roomId, page = 1, limit = 10 } = request.query;

      if (!taskId && !roomId) {
        return reply.code(400).send({
          success: false,
          error: "Un ID de tâche ou de salle est requis",
        });
      }

      try {
        const query = {};
        if (taskId) query.task = taskId;
        if (roomId) query.room = roomId;

        const options = {
          page: parseInt(page),
          limit: parseInt(limit),
          sort: { createdAt: -1 },
          populate: [
            { path: "author", select: "userName email profile.avatar" },
            { path: "replies.author", select: "userName email profile.avatar" },
          ],
        };

        const comments = await Comment.paginate(query, options);

        return {
          success: true,
          comments: comments.docs,
          pagination: {
            total: comments.totalDocs,
            pages: comments.totalPages,
            page: comments.page,
            limit: comments.limit,
            hasNext: comments.hasNextPage,
            hasPrev: comments.hasPrevPage,
          },
        };
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des commentaires:",
          error
        );
        return reply.code(500).send({
          success: false,
          error:
            "Une erreur est survenue lors de la récupération des commentaires",
        });
      }
    }
  );

  // Ajouter/supprimer un like sur un commentaire
  fastify.post(
    "/comments/:commentId/like",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      const { commentId } = request.params;
      const userId = request.user.userId;

      if (!isValidObjectId(commentId)) {
        return reply.code(400).send({
          success: false,
          error: "ID de commentaire invalide",
        });
      }

      try {
        const comment = await Comment.findById(commentId);

        if (!comment) {
          return reply.code(404).send({
            success: false,
            error: "Commentaire non trouvé",
          });
        }

        const hasLiked = comment.likes.includes(userId);
        let updatedComment;

        if (hasLiked) {
          // Retirer le like
          updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { $pull: { likes: userId } },
            { new: true }
          );
        } else {
          // Ajouter le like
          updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { $addToSet: { likes: userId } },
            { new: true }
          );
        }

        return {
          success: true,
          hasLiked: !hasLiked,
          likesCount: updatedComment.likes.length,
        };
      } catch (error) {
        console.error("Erreur lors de la mise à jour du like:", error);
        return reply.code(500).send({
          success: false,
          error: "Une erreur est survenue lors de la mise à jour du like",
        });
      }
    }
  );
};

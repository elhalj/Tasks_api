import mongoose from "mongoose";
import Comment from "../models/comment.model.js";
import Task from "../models/tasks.model.js";
import Room from "../models/room.model.js";
import User from "../models/user.model.js";
import { isValidObjectId } from "../helpers/validateId.js";

export class Comments {
  async getComment(request, reply) {
    try {
      const comments = await Comment.find({})
        .populate({
          path: "replies",
          populate: {
            path: "author",
            select: "userName",
          },
        })
        .populate("author", "userName")
        .populate({
          path: "task",
          select: "title description",
        })
        .populate({
          path: "room",
          select: "room_name",
        })
        .populate("likes", "userName")
        .sort({ updatedAt: -1 });

      return reply.send({
        success: true,
        data: comments,
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        message: "Erreur lors de la récupération des commentaires",
        error: error.message,
      });
    }
  }

  async getCommentTask(request, reply) {
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
      console.error("Erreur lors de la récupération des commentaires:", error);
      return reply.code(500).send({
        success: false,
        error:
          "Une erreur est survenue lors de la récupération des commentaires",
      });
    }
  }

  async addComment(request, reply) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { replies, task, room } = request.body;
      const userId = request.user?.userId;

      // Vérifier que l'utilisateur est authentifié
      if (!userId) {
        await session.abortTransaction();
        return reply.status(401).send({
          success: false,
          message: "Authentification requise",
        });
      }

      // Vérifier que le contenu est fourni
      if (!replies || !replies.trim()) {
        await session.abortTransaction();
        return reply.status(400).send({
          success: false,
          message: "Le contenu du commentaire est requis",
        });
      }

      // Vérifier qu'une tâche ou une salle est fournie
      if (!task && !room) {
        await session.abortTransaction();
        return reply.status(400).send({
          success: false,
          message: "Un commentaire doit être associé à une tâche ou une salle",
        });
      }

      // Vérifier que la tâche existe si elle est fournie
      if (task) {
        const taskExists = await Task.exists({ _id: task }).session(session);
        if (!taskExists) {
          await session.abortTransaction();
          return reply.status(404).send({
            success: false,
            message: "La tâche spécifiée n'existe pas",
          });
        }
      }

      // Vérifier que la salle existe si elle est fournie
      if (room) {
        const roomExists = await Room.exists({ _id: room }).session(session);
        if (!roomExists) {
          await session.abortTransaction();
          return reply.status(404).send({
            success: false,
            message: "La salle spécifiée n'existe pas",
          });
        }
      }

      // Créer le commentaire
      const comment = new Comment({
        replies: replies.trim(),
        author: userId,
        ...(task && { task }),
        ...(room && { room }),
      });

      const savedComment = await comment.save({ session });

      // Mettre à jour l'auteur avec son commentaire
      await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: { comment: savedComment._id },
          $inc: { "stats.commentsPosted": 1 },
        },
        { session, new: true }
      );

      // Si le commentaire est lié à une tâche, mettre à jour la tâche
      if (task) {
        await Task.findByIdAndUpdate(
          task,
          { $push: { comments: savedComment._id } },
          { session, new: true }
        );
      }

      // Si le commentaire est lié à une salle, mettre à jour la salle
      if (room) {
        await Room.findByIdAndUpdate(
          room,
          { $push: { comments: savedComment._id } },
          { session, new: true }
        );
      }

      await session.commitTransaction();
      session.endSession();

      // Peupler les champs nécessaires avant de renvoyer la réponse
      const populatedComment = await Comment.findById(savedComment._id)
        .populate("author", "userName")
        .populate("task", "title")
        .populate("room", "room_name");

      return reply.status(201).send({
        success: true,
        data: populatedComment,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Erreur addComment:", error);

      return reply.status(500).send({
        success: false,
        message: "Erreur lors de la création du commentaire",
        error: error.message,
      });
    }
  }

  async updateComment(request, reply) {
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
        error: "Une erreur est survenue lors de la mise à jour du commentaire",
      });
    }
  }

  async deleteComment(request, reply) {
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
        error: "Une erreur est survenue lors de la suppression du commentaire",
      });
    }
  }

  async replyComment(request, reply) {
    const { commentId } = request.params;
    const userId = request.user?.userId;

    // Vérifier que l'utilisateur est authentifié
    if (!userId) {
      return reply.status(401).send({
        success: false,
        message: "Authentification requise",
      });
    }

    try {
      // Vérifier que le commentaire parent existe
      const parentComment = await Comment.findById(commentId);
      if (!parentComment) {
        return reply.status(404).send({
          success: false,
          message: "Commentaire parent introuvable",
        });
      }

      const { content } = request.body;

      // Valider le contenu de la réponse
      if (!content || typeof content !== "string" || !content.trim()) {
        return reply.status(400).send({
          success: false,
          message:
            "Le contenu de la réponse est requis et doit être une chaîne de caractères valide",
        });
      }

      // Créer l'objet de réponse
      const replyData = {
        content: content.trim(),
        author: userId,
        likes: [],
      };

      // Ajouter la réponse au tableau replies du commentaire parent
      parentComment.replies.push(replyData);
      await parentComment.save();

      // Mettre à jour les statistiques de l'utilisateur
      await User.findByIdAndUpdate(userId, {
        $push: { comment: newReply._id },
      });

      // Mettre à jour les données du commentaire parent
      await Comment.findByIdAndUpdate(commentId, {
        $push: { replies: newReply._id },
      });

      return reply.code(201).send({
        success: true,
        message: "Effectué avec success",
        newReply,
      });
    } catch (error) {
      return reply
        .code(500)
        .send({ success: false, message: `Erreur server: ${error.message}` });
    }
  }

  async addLike(request, reply) {
    const { commentId } = request.params;
    const userId = request.user?.userId;

    try {
      // Vérifier que l'utilisateur est authentifié
      if (!userId) {
        return reply.status(401).send({
          success: false,
          message: "Authentification requise",
        });
      }

      // Vérifier que le commentaire existe
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return reply.status(404).send({
          success: false,
          message: "Commentaire introuvable",
        });
      }

      // Vérifier si l'utilisateur a déjà liké le commentaire
      const hasLiked = comment.likes.includes(userId);

      let updatedComment;

      if (hasLiked) {
        // Retirer le like
        updatedComment = await Comment.findByIdAndUpdate(
          commentId,
          { $pull: { likes: userId } },
          { new: true }
        ).populate("likes", "userName");
      } else {
        // Ajouter le like
        updatedComment = await Comment.findByIdAndUpdate(
          commentId,
          { $addToSet: { likes: userId } },
          { new: true }
        ).populate("likes", "userName");
      }

      return reply.send({
        success: true,
        data: {
          commentId: updatedComment._id,
          likes: updatedComment.likes,
          likeCount: updatedComment.likes.length,
          hasLiked: !hasLiked, // Inverser car on a déjà mis à jour
        },
        message: hasLiked
          ? "Like retiré avec succès"
          : "Commentaire liké avec succès",
      });
    } catch (error) {
      console.error("Erreur dans addLike:", error);
      return reply.status(500).send({
        success: false,
        message: "Erreur lors de la mise à jour du like",
        error: error.message,
      });
    }
  }
}

import mongoose from 'mongoose';
import Comment from "../models/comment.model";
import Task from "../models/tasks.model";
import Room from "../models/room.model";
import User from "../models/user.model";

export class Comments {
  async getComment(request, reply) {
    try {
      const comments = await Comment.find({})
        .populate({
          path: "replies",
          populate: {
            path: "author",
            select: "userName"
          }
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
        data: comments
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        message: "Erreur lors de la récupération des commentaires",
        error: error.message
      });
    }
  }

  async addComment(request, reply) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { content, task, room } = request.body;
      const userId = request.user?.userId;

      // Vérifier que l'utilisateur est authentifié
      if (!userId) {
        await session.abortTransaction();
        return reply.status(401).send({
          success: false,
          message: "Authentification requise"
        });
      }

      // Vérifier que le contenu est fourni
      if (!content || !content.trim()) {
        await session.abortTransaction();
        return reply.status(400).send({
          success: false,
          message: "Le contenu du commentaire est requis"
        });
      }

      // Vérifier qu'une tâche ou une salle est fournie
      if (!task && !room) {
        await session.abortTransaction();
        return reply.status(400).send({
          success: false,
          message: "Un commentaire doit être associé à une tâche ou une salle"
        });
      }

      // Vérifier que la tâche existe si elle est fournie
      if (task) {
        const taskExists = await Task.exists({ _id: task }).session(session);
        if (!taskExists) {
          await session.abortTransaction();
          return reply.status(404).send({
            success: false,
            message: "La tâche spécifiée n'existe pas"
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
            message: "La salle spécifiée n'existe pas"
          });
        }
      }

      // Créer le commentaire
      const comment = new Comment({
        content: content.trim(),
        author: userId,
        ...(task && { task }),
        ...(room && { room })
      });

      const savedComment = await comment.save({ session });

      // Mettre à jour l'auteur avec son commentaire
      await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: { comments: savedComment._id },
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
        .populate('author', 'userName')
        .populate('task', 'title')
        .populate('room', 'room_name');

      return reply.status(201).send({
        success: true,
        data: populatedComment
      });

    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error('Erreur addComment:', error);
      
      return reply.status(500).send({
        success: false,
        message: "Erreur lors de la création du commentaire",
        error: error.message
      });
    }
  }
}

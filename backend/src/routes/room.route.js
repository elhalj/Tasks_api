import mongoose from "mongoose";
import { isValidObjectId } from "../helpers/validateId.js";
import Room from "../models/room.model.js";
import User from "../models/user.model.js";
import Task from "../models/tasks.model.js";
import Comment from "../models/comment.model.js";
import { handleError } from "../helpers/handleError.js";
import { ERROR_MESSAGES } from "../constants/roomErrorMessage.js";

export const roomRoutes = async (fastify, options) => {
  // Get all rooms for te authenticated user (both as admin and member)
  fastify.get(
    "/get/rooms",
    {
      preHandler: fastify.authenticate,
    },
    async (request, reply) => {
      try {
        const userId = request.user.userId;

        // Récupérer à la fois les salles où l'utilisateur est admin et membre
        const [adminRooms, memberRooms] = await Promise.all([
          Room.find({ admin: userId, isActive: true })
            .populate("admin", "userName email avatar")
            .populate("members", "userName email avatar")
            .sort({ updatedAt: -1 }),

          Room.find({
            members: userId,
            admin: { $ne: userId }, // Éviter les doublons avec adminRooms
            isActive: true,
          })
            .populate("admin", "userName email avatar")
            .populate("members", "userName email avatar")
            .sort({ updatedAt: -1 }),
        ]);

        return {
          success: true,
          adminRooms,
          memberRooms,
          count: adminRooms.length + memberRooms.length,
          total: adminRooms.length + memberRooms.length,
        };
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  // Create a new room
  fastify.post(
    "/add/rooms",
    {
      preHandler: fastify.authenticate,
    },
    async (request, reply) => {
      const { room_name, description, members = [] } = request.body;
      const adminId = request.user.userId;
      const session = await mongoose.startSession();

      try {
        session.startTransaction();

        // Vérifier que les membres existent et ne pas s'inclure soi-même
        const memberIds = [...new Set(members)]; // Éviter les doublons

        // Exclure l'admin des membres s'il est présent
        const membersToAdd = memberIds.filter(
          (id) => id !== adminId.toString()
        );

        // Vérifier que les membres existent
        const existingMembers = await User.find({
          _id: { $in: membersToAdd },
          _id: { $ne: adminId }, // Ne pas inclure l'admin
        })
          .select("_id")
          .session(session);

        const existingMemberIds = existingMembers.map((member) => member._id);
        const nonExistingMembers = membersToAdd.filter(
          (id) =>
            !existingMemberIds.some((memberId) => memberId.toString() === id)
        );

        if (nonExistingMembers.length > 0) {
          await session.abortTransaction();
          session.endSession();
          return reply.code(404).send({
            success: false,
            error: "Certains utilisateurs n'existent pas",
            invalidUsers: nonExistingMembers,
          });
        }

        // Créer la salle avec l'admin comme premier membre
        const roomData = {
          room_name: room_name.trim(),
          description: description ? description.trim() : "",
          admin: adminId,
          members: [...existingMemberIds, adminId], // Inclure l'admin dans les membres
          isActive: true,
        };

        const room = new Room(roomData);
        await room.save({ session });

        // Mettre à jour les références des utilisateurs
        await User.updateMany(
          { _id: { $in: [...existingMemberIds, adminId] } },
          { $addToSet: { rooms: room._id } },
          { session }
        );

        await session.commitTransaction();
        session.endSession();

        const populatedRoom = await Room.findById(room._id)
          .populate("admin", "userName email avatar")
          .populate("members", "userName email avatar");

        // Ici, vous pourriez ajouter des notifications aux membres ajoutés

        return reply.code(201).send({
          success: true,
          message: "Salle créée avec succès",
          room: populatedRoom,
        });
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return handleError(error, reply);
      }
    }
  );

  // Add member to room
  fastify.post(
    "/add/:roomId/members",
    {
      preHandler: fastify.authenticate,
    },
    async (request, reply) => {
      const { userId } = request.body;
      const { roomId } = request.params;
      const currentUserId = request.user.userId;
      const session = await mongoose.startSession();

      try {
        session.startTransaction();

        // Vérifier que l'utilisateur à ajouter existe
        const userToAdd = await User.findById(userId).session(session);
        if (!userToAdd) {
          await session.abortTransaction();
          session.endSession();
          return reply.code(404).send({
            success: false,
            error: ERROR_MESSAGES.USER_NOT_FOUND,
          });
        }

        // Vérifier que la salle existe et que l'utilisateur est admin
        const room = await Room.findById(roomId).session(session);
        if (!room) {
          await session.abortTransaction();
          session.endSession();
          return reply.code(404).send({
            success: false,
            error: ERROR_MESSAGES.ROOM_NOT_FOUND,
          });
        }

        if (room.admin.toString() !== currentUserId) {
          await session.abortTransaction();
          session.endSession();
          return reply.code(403).send({
            success: false,
            error: ERROR_MESSAGES.NOT_ADMIN,
          });
        }

        // Vérifier si l'utilisateur est déjà membre
        if (room.members.some((memberId) => memberId.toString() === userId)) {
          await session.abortTransaction();
          session.endSession();
          return reply.code(400).send({
            success: false,
            error: ERROR_MESSAGES.ALREADY_MEMBER,
          });
        }

        // Vérifier la limite de membres
        const maxMembers =
          Room.schema.obj.members[0].validate[0].validator.MAX_MEMBERS;
        if (room.members.length >= maxMembers) {
          await session.abortTransaction();
          session.endSession();
          return reply.code(400).send({
            success: false,
            error: ERROR_MESSAGES.ROOM_LIMIT_REACHED,
          });
        }

        // Ajouter l'utilisateur à la salle
        room.members.push(userId);
        await room.save({ session });

        // Mettre à jour la référence de l'utilisateur
        userToAdd.rooms.push(roomId);
        await userToAdd.save({ session });

        await session.commitTransaction();
        session.endSession();

        // Récupérer la salle avec les données peuplées
        const populatedRoom = await Room.findById(room._id)
          .populate("admin", "userName email avatar")
          .populate("members", "userName email avatar");

        // Ici, vous pourriez ajouter une notification à l'utilisateur ajouté

        return {
          success: true,
          message: "Membre ajouté avec succès",
          room: populatedRoom,
        };
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return handleError(error, reply);
      }
    }
  );

  // Remove member from room
  fastify.delete(
    "/delete/:roomId/members/:userId",
    {
      preHandler: fastify.authenticate,
    },
    async (request, reply) => {
      const { roomId, userId } = request.params;
      const currentUserId = request.user.userId;
      const isSelfRemoval = userId === currentUserId;
      const session = await mongoose.startSession();

      try {
        session.startTransaction();

        // Vérifier que l'utilisateur à retirer existe
        const userToRemove = await User.findById(userId).session(session);
        if (!userToRemove) {
          await session.abortTransaction();
          session.endSession();
          return reply.code(404).send({
            success: false,
            error: ERROR_MESSAGES.USER_NOT_FOUND,
          });
        }

        // Vérifier que la salle existe
        const room = await Room.findById(roomId).session(session);
        if (!room) {
          await session.abortTransaction();
          session.endSession();
          return reply.code(404).send({
            success: false,
            error: ERROR_MESSAGES.ROOM_NOT_FOUND,
          });
        }

        // Vérifier que l'utilisateur actuel est admin ou qu'il s'agit d'un auto-retrait
        const isAdmin = room.admin.toString() === currentUserId;
        if (!isAdmin && !isSelfRemoval) {
          await session.abortTransaction();
          session.endSession();
          return reply.code(403).send({
            success: false,
            error: ERROR_MESSAGES.NOT_ADMIN,
          });
        }

        // Vérifier que l'utilisateur est bien membre de la salle
        const memberIndex = room.members.findIndex(
          (memberId) => memberId.toString() === userId
        );

        if (memberIndex === -1) {
          await session.abortTransaction();
          session.endSession();
          return reply.code(400).send({
            success: false,
            error: ERROR_MESSAGES.NOT_MEMBER,
          });
        }

        // Vérifier les cas spéciaux
        if (isSelfRemoval && isAdmin && room.members.length > 1) {
          await session.abortTransaction();
          session.endSession();
          return reply.code(400).send({
            success: false,
            error: ERROR_MESSAGES.CANNOT_REMOVE_SELF,
          });
        }

        if (userId === room.admin.toString() && !isSelfRemoval) {
          await session.abortTransaction();
          session.endSession();
          return reply.code(400).send({
            success: false,
            error: ERROR_MESSAGES.CANNOT_REMOVE_ADMIN,
          });
        }

        // Retirer l'utilisateur de la salle
        room.members.splice(memberIndex, 1);

        // Si c'est l'admin qui est retiré, désigner un nouvel admin ou supprimer la salle
        if (userId === room.admin.toString()) {
          if (room.members.length > 0) {
            // Désigner le premier membre comme nouvel admin
            room.admin = room.members[0];
          } else {
            // Aucun membre restant, supprimer la salle
            await Room.findByIdAndDelete(roomId).session(session);

            // Retirer la référence de la salle pour l'utilisateur
            userToRemove.rooms = userToRemove.rooms.filter(
              (roomRef) => roomRef.toString() !== roomId
            );
            await userToRemove.save({ session });

            await session.commitTransaction();
            session.endSession();

            return {
              success: true,
              message: "Salle supprimée car aucun membre ne reste",
              room: null,
            };
          }
        }

        await room.save({ session });

        // Retirer la référence de la salle pour l'utilisateur
        userToRemove.rooms = userToRemove.rooms.filter(
          (roomRef) => roomRef.toString() !== roomId
        );
        await userToRemove.save({ session });

        await session.commitTransaction();
        session.endSession();

        // Récupérer la salle avec les données peuplées
        const populatedRoom = await Room.findById(room._id)
          .populate("admin", "userName email avatar")
          .populate("members", "userName email avatar");

        return {
          success: true,
          message: isSelfRemoval
            ? "Vous avez quitté la salle avec succès"
            : "Membre retiré avec succès",
          room: populatedRoom,
        };
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return handleError(error, reply);
      }
    }
  );

  // Update room information
  fastify.put(
    "/update/rooms/:roomId",
    {
      preHandler: fastify.authenticate,
    },
    async (request, reply) => {
      const { roomId } = request.params;
      const currentUserId = request.user.userId;
      const updates = { ...request.body };

      // Supprimer les champs qui ne doivent pas être mis à jour via cette route
      const restrictedFields = [
        "_id",
        "members",
        "tasks",
        "comments",
        "admin",
        "createdAt",
        "updatedAt",
      ];
      restrictedFields.forEach((field) => delete updates[field]);

      // Vérifier qu'il reste des champs à mettre à jour
      if (Object.keys(updates).length === 0) {
        return reply.code(400).send({
          success: false,
          error: "Aucun champ valide fourni pour la mise à jour",
        });
      }

      const session = await mongoose.startSession();

      try {
        session.startTransaction();

        // Vérifier que la salle existe et que l'utilisateur est admin
        const room = await Room.findById(roomId).session(session);
        if (!room) {
          await session.abortTransaction();
          session.endSession();
          return reply.code(404).send({
            success: false,
            error: ERROR_MESSAGES.ROOM_NOT_FOUND,
          });
        }

        if (room.admin.toString() !== currentUserId) {
          await session.abortTransaction();
          session.endSession();
          return reply.code(403).send({
            success: false,
            error: ERROR_MESSAGES.NOT_ADMIN,
          });
        }

        // Appliquer les mises à jour
        Object.keys(updates).forEach((key) => {
          room[key] = updates[key];
        });

        // Sauvegarder les modifications
        await room.save({ session });

        await session.commitTransaction();
        session.endSession();

        // Récupérer la salle avec les données peuplées
        const populatedRoom = await Room.findById(room._id)
          .populate("admin", "userName email avatar")
          .populate("members", "userName email avatar");

        return {
          success: true,
          message: "Salle mise à jour avec succès",
          room: populatedRoom,
        };
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return handleError(error, reply);
      }
    }
  );

  // Delete a room with cascade deletion of tasks and comments
  fastify.delete(
    "/delete/rooms/:roomId",
    {
      preHandler: fastify.authenticate,
    },
    async (request, reply) => {
      const { roomId } = request.params;
      const currentUserId = request.user.userId;
      const session = await mongoose.startSession();

      try {
        session.startTransaction();

        // Vérifier que la salle existe et que l'utilisateur est admin
        const room = await Room.findById(roomId).session(session);
        if (!room) {
          await session.abortTransaction();
          session.endSession();
          return reply.code(404).send({
            success: false,
            error: ERROR_MESSAGES.ROOM_NOT_FOUND,
          });
        }

        if (room.admin.toString() !== currentUserId) {
          await session.abortTransaction();
          session.endSession();
          return reply.code(403).send({
            success: false,
            error: ERROR_MESSAGES.NOT_ADMIN,
          });
        }

        // Supprimer toutes les tâches de la salle
        const tasksResult = await Task.deleteMany(
          { room: roomId },
          { session }
        );

        // Supprimer tous les commentaires liés à la salle
        const commentsResult = await Comment.deleteMany(
          { room: roomId },
          { session }
        );

        // Retirer la référence de la salle pour tous les membres
        await User.updateMany(
          { rooms: roomId },
          { $pull: { rooms: roomId } },
          { session }
        );

        // Supprimer la salle
        await Room.findByIdAndDelete(roomId, { session });

        await session.commitTransaction();
        session.endSession();

        return {
          success: true,
          message: "Salle et tout son contenu supprimés avec succès",
          deletedCount: {
            tasks: tasksResult.deletedCount,
            comments: commentsResult.deletedCount,
          },
        };
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return handleError(error, reply);
      }
    }
  );

  // Transfer room ownership to another member
  fastify.post(
    "/rooms/:roomId/transfer-ownership",
    {
      preHandler: fastify.authenticate,
    },
    async (request, reply) => {
      const { roomId } = request.params;
      const { newAdminId } = request.body;
      const currentUserId = request.user.userId;
      const session = await mongoose.startSession();

      try {
        session.startTransaction();

        // Vérifier que le nouveau propriétaire existe
        const newAdmin = await User.findById(newAdminId).session(session);
        if (!newAdmin) {
          await session.abortTransaction();
          session.endSession();
          return reply.code(404).send({
            success: false,
            error: ERROR_MESSAGES.USER_NOT_FOUND,
          });
        }

        // Vérifier que la salle existe et que l'utilisateur actuel est admin
        const room = await Room.findById(roomId).session(session);
        if (!room) {
          await session.abortTransaction();
          session.endSession();
          return reply.code(404).send({
            success: false,
            error: ERROR_MESSAGES.ROOM_NOT_FOUND,
          });
        }

        if (room.admin.toString() !== currentUserId) {
          await session.abortTransaction();
          session.endSession();
          return reply.code(403).send({
            success: false,
            error: ERROR_MESSAGES.NOT_ADMIN,
          });
        }

        // Vérifier que le nouveau propriétaire est membre de la salle
        const isMember = room.members.some(
          (memberId) => memberId.toString() === newAdminId
        );

        if (!isMember) {
          await session.abortTransaction();
          session.endSession();
          return reply.code(400).send({
            success: false,
            error: "Le nouveau propriétaire doit être membre de la salle",
          });
        }

        // Mettre à jour l'admin de la salle
        room.admin = newAdminId;

        // S'assurer que l'ancien admin reste membre s'il ne l'était pas déjà
        if (
          !room.members.some(
            (memberId) => memberId.toString() === currentUserId
          )
        ) {
          room.members.push(currentUserId);
        }

        await room.save({ session });

        await session.commitTransaction();
        session.endSession();

        // Récupérer la salle avec les données peuplées
        const populatedRoom = await Room.findById(room._id)
          .populate("admin", "userName email avatar")
          .populate("members", "userName email avatar");

        // Ici, vous pourriez ajouter une notification au nouveau propriétaire

        return {
          success: true,
          message: "Propriété de la salle transférée avec succès",
          room: populatedRoom,
        };
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return handleError(error, reply);
      }
    }
  );

  // Toggle room active status (admin only)
  fastify.patch(
    "/rooms/:roomId/toggle-active",
    {
      preHandler: fastify.authenticate,
    },
    async (request, reply) => {
      const { roomId } = request.params;
      const currentUserId = request.user.userId;

      try {
        // Vérifier que la salle existe
        const room = await Room.findById(roomId);
        if (!room) {
          return reply.code(404).send({
            success: false,
            error: ERROR_MESSAGES.ROOM_NOT_FOUND,
          });
        }

        // Vérifier que l'utilisateur est admin de la salle
        if (room.admin.toString() !== currentUserId) {
          return reply.code(403).send({
            success: false,
            error: ERROR_MESSAGES.NOT_ADMIN,
          });
        }

        // Inverser le statut actif
        room.isActive = !room.isActive;
        await room.save();

        // Récupérer la salle avec les données peuplées
        const populatedRoom = await Room.findById(room._id)
          .populate("admin", "userName email avatar")
          .populate("members", "userName email avatar");

        return {
          success: true,
          message: `Salle ${
            room.isActive ? "activée" : "désactivée"
          } avec succès`,
          room: populatedRoom,
        };
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  // Export the routes
  return fastify;
};

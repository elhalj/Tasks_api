import mongoose from "mongoose";
import { isValidObjectId } from "../helpers/validateId.js";
import Room from "../models/room.model.js";
import User from "../models/user.model.js";
import Task from "../models/tasks.model.js";
import Comment from "../models/comment.model.js";
import { handleError } from "../helpers/handleError.js";
import { ERROR_MESSAGES } from "../constants/roomErrorMessage.js";
import { RoomController } from "../controllers/room.controller.js";

const roomController = new RoomController();
export const roomRoutes = async (fastify, options) => {
  // Get all rooms for te authenticated user (both as admin and member)
  fastify.get(
    "/get/rooms",
    {
      preHandler: fastify.authenticate,
    },
    roomController.getRoom
  );

  // Create a new room
  fastify.post(
    "/add/rooms",
    { preHandler: fastify.authenticate },
    roomController.addRoom
  );

  // Add member to room
  fastify.post(
    "/add/:roomId/:memberId",
    {
      preHandler: fastify.authenticate,
    },
    roomController.addMember
  );

  // Remove member from room
  fastify.delete(
    "/delete/:roomId/members/:userId",
    {
      preHandler: fastify.authenticate,
    },
    roomController.deleteMember
  );

  // Update room information
  fastify.put(
    "/update/rooms/:roomId",
    {
      preHandler: fastify.authenticate,
    },
    roomController.updateRoom
  );

  // Delete a room with cascade deletion of tasks and comments
  fastify.delete(
    "/delete/rooms/:roomId",
    {
      preHandler: fastify.authenticate,
    },
    RoomController.deleteRoom
  );

  // Transfer room ownership to another member
  fastify.post(
    "/rooms/:roomId/transfer-ownership",
    {
      preHandler: fastify.authenticate,
    },
    roomController.transfertRoom
  );

  // Toggle room active status (admin only)
  fastify.patch(
    "/rooms/:roomId/toggle-active",
    {
      preHandler: fastify.authenticate,
    },
    roomController.toggleRoomStatus
  );

  // Export the routes
  return fastify;
};

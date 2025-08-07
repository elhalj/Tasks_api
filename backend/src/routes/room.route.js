import Room from "../models/room.model";
import User from "../models/user.model";

export const roomRoutes = async (fastify, options) => {
  // Get all room for the authenticate user
  fastify.get(
    "/get/rooms",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      try {
        const rooms = await Room.find({ admin: request.user.userId })
          .populate("admin", "userName email")
          .sort({ createdAt: -1 });

        return {
          success: true,
          count: rooms.length,
          rooms,
        };
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des salles",
          error.message
        );
        return reply
          .code(500)
          .send({ success: false, error: "Impossible de récuperer les rooms" });
      }
    }
  );

  //Add rooms
  fastify.post(
    "/add/room",
    { preHandler: fastify.authenticated },
    async (request, reply) => {
      const { room_name, description } = request.body;

      try {
        if (!room_name || typeof room_name !== "string" || room_name === "") {
          return reply
            .code(400)
            .send({
              success: false,
              error: "Vous devez indiquer le nom de la room",
            });
        }

        if (
          !description ||
          typeof description !== "string" ||
          description === ""
        ) {
          return reply
            .code(400)
            .send({
              success: false,
              error: "Vous devez indiquer une description",
            });
        }

        const roomData = {
          room_name: room_name.trim(),
          description: description.trim(),
          admin: request.user.userId,
        };
        const room = new Room(roomData);
        const saveRoom = await room.save();

        await User.findByIdAndUpdate(request.user.id, {
          $push: { rooms: saveRoom._id },
        });

        return saveRoom;
      } catch (error) {
        console.error("Erreur lors de l'ajout de la room", error.message);
        return reply
          .code(500)
          .send({ success: false, error: "Impossible d'ajouter la room" });
      }
    }
  );
};

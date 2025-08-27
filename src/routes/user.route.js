import User from "../models/user.model.js";
import { generateToken } from "../utils/token.js";

export const authRoute = async (fastify) => {
  //get ALL user (Admin)
  fastify.get("/user", async (request, reply) => {
    const users = await User.find({}).populate("userName email");

    return users;
  });
  //register user
  fastify.post("/register/user", async (request, reply) => {
    const { userName, email, password } = request.body;
    const isExist = await User.findOne({ email });
    if (isExist) {
      return reply.code(400).send({ error: "User exist" });
    }

    const user = new User({ userName, email, password });
    await user.save();
    return { message: "User registred successfully..." };
  });

  //login user
  fastify.post("/login/user", async (request, reply) => {
    const { email, password } = request.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.isPasswordCorrect(password))) {
      return reply.code(401).send({ error: "Invalid credentials" });
    }
    const token = generateToken(user._id);
    return {
      message: "Login succesfully",
      token,
      user: user.toObject({ getters: true }),
    };
  });

  //Update profile
  fastify.put(
    "/update/profile/:profileId",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      const { profileId } = request.params;
      const userId = request.user.userId;

      const { userName, profile } = request.body;

      try {
        if (!userId) {
          return reply.code(403).send({
            success: false,
            error: "Vérifier que vous etes vraiment l'utilisateur",
          });
        }

        if (!userName || typeof userName !== "string") {
          return reply.code(401).send({
            success: false,
            error: "Vous devez rentrer des chaines de charactère",
          });
        }

        if (!profile || typeof profile !== "object") {
          return reply.code(401).send({
            success: false,
            error: "Vous devez rentrer un objet",
          });
        }

        if (!profile.firstName || typeof profile.firstName !== "string") {
          return reply.code(401).send({
            success: false,
            error: "firstName doit etre une chaine de charactère",
          });
        }

        if (!profile.lastName || typeof profile.lastName !== "string") {
          return reply.code(401).send({
            success: false,
            error: "lastName doit etre une chaine de charactère",
          });
        }

        if (!profile.bio || typeof profile.bio !== "string") {
          return reply.code(401).send({
            success: false,
            error: "Vous devez rentrer des chaines de charactères",
          });
        }

        if (!profile.phone || typeof profile.phone !== "string") {
          return reply.code(401).send({
            success: false,
            error: "Vous devez préciser vos contacts",
          });
        }

        const updateProfile = await User.findByIdAndUpdate(
          profileId,
          { $set: { userName, profile } },
          { new: true }
        );

        return reply.code(201).send({
          success: true,
          message: "Modifier avec succès",
          updateProfile,
        });
      } catch (error) {
        console.error(error.message);
        return reply.code(500).send({ success: false, error: error.message });
      }
    }
  );
};

import User from "../models/user.model.js";
import { generateToken } from "../utils/token.js";

export class UserController {
  async getUser(request, reply) {
    const users = await User.find({})
      .populate("userName email stats")
      .sort({ updatedAt: -1 });

    return users;
  }

  async getUserById(request, reply) {
    const { id } = request.params;
    const user = await User.findById(id).populate("userName email stats");
    if (!user) {
      return reply.code(404).send({
        success: false,
        message: "Error, user not fund",
        error: "User not found",
      });
    }
    return user;
  }

  async register(request, reply) {
    const { userName, email, password } = request.body;
    const isExist = await User.findOne({ email });
    if (isExist) {
      return reply.code(400).send({ error: "User exist" });
    }

    if (
      !userName ||
      typeof userName !== "string" ||
      userName.trim().length === 0
    ) {
      return reply
        .code(401)
        .send({ success: false, message: "Le nom est requis" });
    }

    if (userName.trim().length <= 3) {
      return reply.code(401).send({
        success: false,
        message: "Le nom doit au moins depasser 3 charactères",
      });
    }

    const user = new User({ userName, email, password });
    await user.save();
    return { message: "User registred successfully..." };
  }

  async login(request, reply) {
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
  }

  async update(request, reply) {
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

  async updatePreference(request, reply) {
    const { profileId } = request.params;
    const userId = request.user.userId;
    const { email, push, taskUpdates, mention, language, theme } = request.body;

    try {
      if (!userId) {
        return reply.code(401).send({
          success: false,
          message: "Non autorisé à effectuer cette requête",
        });
      }

      const updateData = {
        preferences: {
          notifications: {
            email,
            push,
            taskUpdates,
            mentions: mention, // Note: In the model it's 'mentions' but in the request it's 'mention'
          },
          language,
          theme,
        },
      };

      const updatedUser = await User.findByIdAndUpdate(
        profileId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select("-password");

      if (!updatedUser) {
        return reply.code(404).send({
          success: false,
          message: "Utilisateur non trouvé",
        });
      }

      return reply.code(200).send({
        success: true,
        message: "Préférences mises à jour avec succès",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating preferences:", error);
      return reply.code(500).send({
        success: false,
        message: "Erreur lors de la mise à jour des préférences",
        error: error.message,
      });
    }
  }
}

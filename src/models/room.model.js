import mongoose from "mongoose";

const MAX_MEMBERS = 50; // Limite maximale de membres par salle
const ROOM_NAME_MIN_LENGTH = 3;
const ROOM_NAME_MAX_LENGTH = 50;
const DESCRIPTION_MAX_LENGTH = 500;

const roomSchema = new mongoose.Schema(
  {
    room_name: {
      type: String,
      required: [true, "Le nom de la salle est requis"],
      trim: true,
      minlength: [
        ROOM_NAME_MIN_LENGTH,
        `Le nom de la salle doit contenir au moins ${ROOM_NAME_MIN_LENGTH} caractères`,
      ],
      maxlength: [
        ROOM_NAME_MAX_LENGTH,
        `Le nom de la salle ne peut pas dépasser ${ROOM_NAME_MAX_LENGTH} caractères`,
      ],
      match: [
        /^[\w\s-éèêëàâäôöùûüç]+$/i,
        "Le nom de la salle contient des caractères non autorisés",
      ],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [
        DESCRIPTION_MAX_LENGTH,
        `La description ne peut pas dépasser ${DESCRIPTION_MAX_LENGTH} caractères`,
      ],
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Un administrateur est requis pour la salle"],
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Middleware pour supprimer les références liées lors de la suppression d'une salle
roomSchema.pre("remove", async function (next) {
  const room = this;
  const session = this.$session();

  try {
    // Mettre à jour les utilisateurs membres
    await mongoose
      .model("User")
      .updateMany(
        { rooms: room._id },
        { $pull: { rooms: room._id } },
        { session }
      );

    // Supprimer les tâches associées
    await mongoose
      .model("Task")
      .deleteMany({ _id: { $in: room.tasks } }, { session });

    // Supprimer les commentaires associés
    await mongoose
      .model("Comment")
      .deleteMany({ _id: { $in: room.comments } }, { session });

    next();
  } catch (error) {
    next(error);
  }
});

// Index pour améliorer les performances des requêtes
roomSchema.index({ room_name: "text", description: "text" });
roomSchema.index({ admin: 1 });
roomSchema.index({ members: 1 });

const Room = mongoose.model("Room", roomSchema);

export default Room;

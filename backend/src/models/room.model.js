import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    room_name: {
      type: String,
      required: [true, "Le nom de la salle est requis"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
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
      required: true,
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
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;

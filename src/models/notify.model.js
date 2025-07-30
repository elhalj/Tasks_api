import mongoose from "mongoose";

const notifySchema = new mongoose.Schema(
  {
    users: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    events: String,
    data: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  },
  { timestamps: true }
);

const Notify = mongoose.model("Notify", notifySchema);

export default Notify;

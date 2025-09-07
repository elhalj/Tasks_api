import mongoose from "mongoose";
import { isAfter, isBefore, subDays } from "date-fns";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Le titre de la tâche est requis"],
      trim: true,
      maxlength: [100, "Le titre ne peut pas dépasser 100 caractères"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "La description ne peut pas dépasser 2000 caractères"],
    },
    completed: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "in_progress", "done", "canceled"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "low",
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: "La progression doit être un nombre entier",
      },
    },
    dueDate: {
      type: Date,
      validate: {
        validator: function (value) {
          // La date d'échéance doit être dans le futur
          return !value || isAfter(value, subDays(new Date(), 1));
        },
        message: "La date d'échéance doit être dans le futur",
      },
    },
    startDate: {
      type: Date,
      validate: {
        validator: function (value) {
          // La date de début doit être antérieure à la date d'échéance si les deux sont définies
          if (!this.dueDate || !value) return true;
          return isBefore(value, this.dueDate);
        },
        message: "La date de début doit être antérieure à la date d'échéance",
      },
    },
    estimatedHours: {
      type: Number,
      min: 0,
      default: 0,
    },
    timeSpent: {
      type: Number,
      min: 0,
      default: 0,
    },
    assignees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      // required: true,
    },
    labels: [
      {
        type: String,
        trim: true,
      },
    ],
    attachments: [
      {
        filename: String,
        url: String,
        size: Number,
        mimeType: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          // required: true,
        },
      },
    ],
    isPrivate: {
      type: Boolean,
      default: false,
    },
    watchers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Les commentaires sont maintenant gérés via le modèle Comment
    // avec une référence bidirectionnelle
    comments: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: [] },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index pour les recherches fréquentes
taskSchema.index({ title: "text", description: "text" });
taskSchema.index({ status: 1, priority: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ room: 1 });
taskSchema.index({ assignees: 1 });

// Méthode pour vérifier si la tâche est en retard
taskSchema.methods.isOverdue = function () {
  if (!this.dueDate) return false;
  return isBefore(new Date(this.dueDate), new Date()) && this.status !== "done";
};

// Middleware pour valider les dates avant la sauvegarde
taskSchema.pre("save", function (next) {
  if (this.startDate && this.dueDate && isAfter(this.startDate, this.dueDate)) {
    throw new Error(
      "La date de début doit être antérieure à la date d'échéance"
    );
  }
  next();
});

const Task = mongoose.model("Task", taskSchema);

export default Task;

import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }],
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    enum: [
      'TASK_ASSIGNED',
      'TASK_UPDATED',
      'TASK_COMPLETED',
      'COMMENT_ADDED',
      'MENTION',
      'ROOM_INVITE',
      'SYSTEM'
    ],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  relatedDocument: {
    type: {
      model: {
        type: String,
        enum: ['Task', 'Room', 'Comment', 'User'],
        required: true
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'relatedDocument.model'
      }
    },
    required: false
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour améliorer les performances des requêtes fréquentes
notificationSchema.index({ recipients: 1, isRead: 1 });
notificationSchema.index({ 'relatedDocument.id': 1, 'relatedDocument.model': 1 });
notificationSchema.index({ createdAt: -1 });

// Méthode pour marquer une notification comme lue
notificationSchema.methods.markAsRead = async function() {
  this.isRead = true;
  return this.save();
};

// Méthode statique pour créer une notification
notificationSchema.statics.createNotification = async function(notificationData) {
  const notification = new this(notificationData);
  return notification.save();
};

// Register the model if it doesn't exist
const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);

export { Notification };
export default Notification;

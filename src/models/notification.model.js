import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['TASK_ASSIGNED', 'TASK_UPDATED', 'COMMENT_ADDED', 'SYSTEM'],
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  relatedEntity: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'relatedEntityModel'
  },
  relatedEntityModel: {
    type: String,
    enum: ['Task', 'Room', 'Comment']
  }
}, {
  timestamps: true
});

export const Notification = mongoose.model('Notification', notificationSchema);

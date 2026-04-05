/**
 * Notification Mongoose Model
 *
 * Represents an in-app notification for a user.
 */

const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ['job_alert', 'deadline_reminder', 'system_update'],
      default: 'job_alert',
    },

    status: {
      type: String,
      enum: ['unread', 'read', 'archived'],
      default: 'unread',
    },

    link: {
      type: String,
      required: false,
    },

    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for performance
NotificationSchema.index({ recipient: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);

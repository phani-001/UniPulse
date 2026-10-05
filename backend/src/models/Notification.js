const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: [
      'application_accepted',
      'application_rejected',
      'connection_request',
      'connection_accepted',
      'club_announcement',
      'event_reminder',
      'event_registration_confirmed',
      'result_published',
      'team_post_response',
      'message'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  link: String, // frontend route to navigate to
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  relatedModel: String, // 'Club', 'Event', 'Connection', etc.
  relatedId: mongoose.Schema.Types.ObjectId
}, { timestamps: true });

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);

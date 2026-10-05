const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['general', 'event', 'result', 'urgent', 'club'],
    default: 'general',
    index: true
  },
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    default: null,
    index: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  expiresAt: Date
}, { timestamps: true });

announcementSchema.index({ createdAt: -1 });
announcementSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Announcement', announcementSchema);

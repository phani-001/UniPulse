const mongoose = require('mongoose');

const clubMembershipSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  role: {
    type: String,
    enum: ['member', 'coordinator', 'president', 'secretary'],
    default: 'member'
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

clubMembershipSchema.index({ user: 1, club: 1 }, { unique: true });

module.exports = mongoose.model('ClubMembership', clubMembershipSchema);

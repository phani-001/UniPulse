const mongoose = require('mongoose');

const clubApplicationSchema = new mongoose.Schema({
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
  reason: {
    type: String,
    required: true,
    maxlength: 1000
  },
  skills: {
    type: String,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
    index: true
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  reviewNote: String
}, { timestamps: true });

clubApplicationSchema.index({ user: 1, club: 1 }, { unique: true });

module.exports = mongoose.model('ClubApplication', clubApplicationSchema);

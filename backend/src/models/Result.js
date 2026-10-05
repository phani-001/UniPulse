const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
    index: true
  },
  week: {
    type: String, // e.g. "2024-W42"
    required: true,
    index: true
  },
  weekStart: Date,
  weekEnd: Date,
  positions: [{
    position: {
      type: Number,
      required: true
    },
    winners: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: String // fallback if external winner
    }],
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Club'
    },
    points: {
      type: Number,
      default: 0
    },
    prize: String
  }],
  publishedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);

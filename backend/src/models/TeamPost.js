const mongoose = require('mongoose');

const teamPostSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  eventName: String, // for manual entry
  description: {
    type: String,
    maxlength: 1000
  },
  skillsNeeded: [{ type: String, trim: true }],
  teamSize: {
    current: { type: Number, default: 1 },
    needed: { type: Number, required: true }
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  respondents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

teamPostSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('TeamPost', teamPostSchema);

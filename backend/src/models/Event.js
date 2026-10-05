const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['hackathon', 'workshop', 'competition', 'seminar', 'cultural', 'sports', 'other'],
    required: true,
    index: true
  },
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    index: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true,
    index: true
  },
  endDate: {
    type: Date,
    required: true
  },
  registrationDeadline: {
    type: Date,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  onlineLink: String,
  teamSize: {
    min: { type: Number, default: 1 },
    max: { type: Number, default: 1 }
  },
  prizes: [{
    position: Number,
    description: String,
    amount: Number
  }],
  maxParticipants: Number,
  registrationCount: {
    type: Number,
    default: 0
  },
  banner: String,
  tags: [String],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming',
    index: true
  }
}, { timestamps: true });

eventSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Event', eventSchema);

const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },
  category: {
    type: String,
    required: true,
    enum: ['Tech', 'Cultural', 'Sports', 'Academic', 'Arts', 'Social', 'Other'],
    index: true
  },
  logo: {
    type: String,
    default: null
  },
  coverImage: {
    type: String,
    default: null
  },
  coordinators: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, default: 'Coordinator' }
  }],
  memberCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  foundedYear: Number,
  socialLinks: {
    instagram: String,
    twitter: String,
    website: String
  }
}, { timestamps: true });

// Auto-generate slug from name
clubSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
  next();
});

clubSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Club', clubSchema);

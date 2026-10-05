const User = require('../models/User');
const ClubMembership = require('../models/ClubMembership');
const EventRegistration = require('../models/EventRegistration');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { paginate, paginatedResponse } = require('../utils/pagination');
const matchingService = require('../services/matching.service');
const path = require('path');
const fs = require('fs');

// GET /api/v1/profiles/me
const getMyProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  const memberships = await ClubMembership.find({ user: user._id, status: 'active' })
    .populate('club', 'name logo category');
  const registrations = await EventRegistration.find({ user: user._id, status: 'registered' })
    .populate('event', 'title startDate type status');

  res.json({
    success: true,
    data: {
      ...user.toObject(),
      clubs: memberships.map(m => m.club),
      events: registrations.map(r => r.event)
    }
  });
});

// PUT /api/v1/profiles/me
const updateMyProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    'name', 'email', 'phone', 'branch', 'year',
    'bio', 'skills', 'interests', 'links', 'achievements', 'privacy'
  ];

  const updates = {};
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true
  });

  res.json({ success: true, message: 'Profile updated', data: user });
});

// GET /api/v1/profiles/:id
const getStudentProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || !user.isActive) throw ApiError.notFound('Student not found');

  const profile = user.toObject();

  // Apply privacy settings
  if (!profile.privacy?.showEmail) delete profile.email;
  if (!profile.privacy?.showPhone) delete profile.phone;

  const memberships = await ClubMembership.find({ user: user._id, status: 'active' })
    .populate('club', 'name logo category');
  const registrations = await EventRegistration.find({ user: user._id, status: 'registered' })
    .populate('event', 'title startDate type');

  res.json({
    success: true,
    data: {
      ...profile,
      clubs: memberships.map(m => m.club),
      events: registrations.map(r => r.event)
    }
  });
});

// GET /api/v1/profiles/discover
const discoverStudents = asyncHandler(async (req, res) => {
  const { search, skill, interest, branch, year } = req.query;
  const filter = { role: 'student', isActive: true, _id: { $ne: req.user._id } };

  if (branch) filter.branch = branch;
  if (year) filter.year = parseInt(year);
  if (skill) filter.skills = { $in: [new RegExp(skill, 'i')] };
  if (interest) filter.interests = { $in: [new RegExp(interest, 'i')] };
  if (search) {
    filter.$or = [
      { name: new RegExp(search, 'i') },
      { registrationNumber: new RegExp(search, 'i') }
    ];
  }

  const total = await User.countDocuments(filter);
  const meta = paginate(req.query, total);

  const students = await User.find(filter)
    .select('name registrationNumber photo branch year skills interests bio points')
    .skip(meta.skip)
    .limit(meta.limit);

  res.json(paginatedResponse(students, meta));
});

// GET /api/v1/profiles/suggested
const getSuggestedStudents = asyncHandler(async (req, res) => {
  const suggestions = await matchingService.getSuggestions(req.user);
  res.json({ success: true, data: suggestions });
});

// POST /api/v1/profiles/me/photo
const uploadPhoto = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('No file uploaded');

  const photoUrl = `/uploads/${req.file.filename}`;
  await User.findByIdAndUpdate(req.user._id, { photo: photoUrl });

  res.json({ success: true, message: 'Photo uploaded', data: { photo: photoUrl } });
});

module.exports = {
  getMyProfile,
  updateMyProfile,
  getStudentProfile,
  discoverStudents,
  getSuggestedStudents,
  uploadPhoto
};

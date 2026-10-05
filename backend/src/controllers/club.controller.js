const Club = require('../models/Club');
const ClubMembership = require('../models/ClubMembership');
const ClubApplication = require('../models/ClubApplication');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { paginate, paginatedResponse } = require('../utils/pagination');

// GET /api/v1/clubs
const getClubs = asyncHandler(async (req, res) => {
  const { search, category, page, limit } = req.query;
  const filter = { isActive: true };

  if (category) filter.category = category;
  if (search) filter.$text = { $search: search };

  const total = await Club.countDocuments(filter);
  const meta = paginate(req.query, total);

  const clubs = await Club.find(filter)
    .populate('coordinators.user', 'name registrationNumber photo')
    .sort({ memberCount: -1 })
    .skip(meta.skip)
    .limit(meta.limit);

  // Attach membership status for logged-in user
  const userId = req.user._id;
  const memberships = await ClubMembership.find({ user: userId }).select('club status');
  const membershipMap = {};
  memberships.forEach(m => { membershipMap[m.club.toString()] = m.status; });

  const applications = await ClubApplication.find({ user: userId }).select('club status');
  const appMap = {};
  applications.forEach(a => { appMap[a.club.toString()] = a.status; });

  const clubsWithStatus = clubs.map(club => ({
    ...club.toObject(),
    membershipStatus: membershipMap[club._id.toString()] || null,
    applicationStatus: appMap[club._id.toString()] || null
  }));

  res.json(paginatedResponse(clubsWithStatus, meta));
});

// GET /api/v1/clubs/my
const getMyClubs = asyncHandler(async (req, res) => {
  const memberships = await ClubMembership.find({
    user: req.user._id,
    status: 'active'
  }).populate('club');

  res.json({
    success: true,
    data: memberships.map(m => m.club)
  });
});

// GET /api/v1/clubs/:id
const getClub = asyncHandler(async (req, res) => {
  const club = await Club.findById(req.params.id)
    .populate('coordinators.user', 'name registrationNumber photo branch year');

  if (!club) throw ApiError.notFound('Club not found');

  const userId = req.user._id;
  const membership = await ClubMembership.findOne({ user: userId, club: club._id });
  const application = await ClubApplication.findOne({ user: userId, club: club._id });

  res.json({
    success: true,
    data: {
      ...club.toObject(),
      membershipStatus: membership?.status || null,
      applicationStatus: application?.status || null,
      isMember: membership?.status === 'active'
    }
  });
});

// POST /api/v1/clubs/:id/leave
const leaveClub = asyncHandler(async (req, res) => {
  const membership = await ClubMembership.findOneAndDelete({
    user: req.user._id,
    club: req.params.id
  });

  if (!membership) throw ApiError.notFound('Membership not found');

  await Club.findByIdAndUpdate(req.params.id, { $inc: { memberCount: -1 } });

  res.json({ success: true, message: 'Left club successfully' });
});

// GET /api/v1/clubs/categories
const getCategories = asyncHandler(async (req, res) => {
  const categories = ['Tech', 'Cultural', 'Sports', 'Academic', 'Arts', 'Social', 'Other'];
  res.json({ success: true, data: categories });
});

module.exports = { getClubs, getMyClubs, getClub, leaveClub, getCategories };

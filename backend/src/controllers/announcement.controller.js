const Announcement = require('../models/Announcement');
const ClubMembership = require('../models/ClubMembership');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { paginate, paginatedResponse } = require('../utils/pagination');

// GET /api/v1/announcements
const getAnnouncements = asyncHandler(async (req, res) => {
  const { type, club, myClubs } = req.query;
  const filter = {};

  if (type) filter.type = type;
  if (club) filter.club = club;

  if (myClubs === 'true') {
    const memberships = await ClubMembership.find({
      user: req.user._id,
      status: 'active'
    }).select('club');
    const clubIds = memberships.map(m => m.club);
    filter.$or = [{ club: { $in: clubIds } }, { club: null }];
  }

  const total = await Announcement.countDocuments(filter);
  const meta = paginate(req.query, total);

  const announcements = await Announcement.find(filter)
    .populate('club', 'name logo')
    .populate('createdBy', 'name')
    .sort({ isPinned: -1, createdAt: -1 })
    .skip(meta.skip)
    .limit(meta.limit);

  res.json(paginatedResponse(announcements, meta));
});

// GET /api/v1/announcements/latest
const getLatestAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await Announcement.find()
    .populate('club', 'name logo')
    .sort({ isPinned: -1, createdAt: -1 })
    .limit(5);

  res.json({ success: true, data: announcements });
});

// GET /api/v1/announcements/:id
const getAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id)
    .populate('club', 'name logo')
    .populate('createdBy', 'name');

  if (!announcement) throw ApiError.notFound('Announcement not found');
  res.json({ success: true, data: announcement });
});

module.exports = { getAnnouncements, getLatestAnnouncements, getAnnouncement };

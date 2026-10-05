const Result = require('../models/Result');
const User = require('../models/User');
const Club = require('../models/Club');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { paginate, paginatedResponse } = require('../utils/pagination');

// GET /api/v1/results/weekly
const getWeeklyResults = asyncHandler(async (req, res) => {
  const { week } = req.query; // e.g. "2024-W42"
  const filter = { isPublished: true };
  if (week) filter.week = week;
  else {
    // Default to current week
    const now = new Date();
    const weekNum = getWeekNumber(now);
    filter.week = `${now.getFullYear()}-W${weekNum.toString().padStart(2, '0')}`;
  }

  const results = await Result.find(filter)
    .populate('event', 'title type')
    .populate('positions.winners.user', 'name photo registrationNumber')
    .populate('positions.club', 'name logo');

  res.json({ success: true, data: results });
});

// GET /api/v1/results/history
const getResultHistory = asyncHandler(async (req, res) => {
  const total = await Result.countDocuments({ isPublished: true });
  const meta = paginate(req.query, total);

  const results = await Result.find({ isPublished: true })
    .populate('event', 'title type')
    .populate('positions.winners.user', 'name photo')
    .populate('positions.club', 'name logo')
    .sort({ weekStart: -1 })
    .skip(meta.skip)
    .limit(meta.limit);

  res.json(paginatedResponse(results, meta));
});

// GET /api/v1/results/leaderboard/students
const getStudentLeaderboard = asyncHandler(async (req, res) => {
  const students = await User.find({ role: 'student', isActive: true })
    .select('name registrationNumber photo branch year points')
    .sort({ points: -1 })
    .limit(20);

  res.json({ success: true, data: students });
});

// GET /api/v1/results/leaderboard/clubs
const getClubLeaderboard = asyncHandler(async (req, res) => {
  const results = await Result.find({ isPublished: true });

  const clubPoints = {};
  results.forEach(result => {
    result.positions.forEach(pos => {
      if (pos.club) {
        const clubId = pos.club.toString();
        clubPoints[clubId] = (clubPoints[clubId] || 0) + pos.points;
      }
    });
  });

  const clubIds = Object.keys(clubPoints);
  const clubs = await Club.find({ _id: { $in: clubIds } }).select('name logo category');

  const leaderboard = clubs.map(club => ({
    ...club.toObject(),
    points: clubPoints[club._id.toString()] || 0
  })).sort((a, b) => b.points - a.points);

  res.json({ success: true, data: leaderboard });
});

function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

module.exports = { getWeeklyResults, getResultHistory, getStudentLeaderboard, getClubLeaderboard };

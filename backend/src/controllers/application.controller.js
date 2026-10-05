const ClubApplication = require('../models/ClubApplication');
const ClubMembership = require('../models/ClubMembership');
const Club = require('../models/Club');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const notificationService = require('../services/notification.service');
const { paginate, paginatedResponse } = require('../utils/pagination');

// POST /api/v1/applications/clubs/:clubId
const applyToClub = asyncHandler(async (req, res) => {
  const { clubId } = req.params;
  const { reason, skills } = req.body;
  const userId = req.user._id;

  const club = await Club.findById(clubId);
  if (!club) throw ApiError.notFound('Club not found');

  // Check if already a member
  const isMember = await ClubMembership.findOne({ user: userId, club: clubId, status: 'active' });
  if (isMember) throw ApiError.conflict('You are already a member of this club');

  // Check for existing pending application
  const existing = await ClubApplication.findOne({ user: userId, club: clubId });
  if (existing) throw ApiError.conflict('You have already applied to this club');

  const application = await ClubApplication.create({
    user: userId,
    club: clubId,
    reason,
    skills
  });

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully',
    data: application
  });
});

// GET /api/v1/applications/my
const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await ClubApplication.find({ user: req.user._id })
    .populate('club', 'name logo category')
    .sort({ createdAt: -1 });

  res.json({ success: true, data: applications });
});

// GET /api/v1/applications/clubs/:clubId (for coordinators - admin later)
const getClubApplications = asyncHandler(async (req, res) => {
  const { clubId } = req.params;
  const { status } = req.query;
  const filter = { club: clubId };
  if (status) filter.status = status;

  const total = await ClubApplication.countDocuments(filter);
  const meta = paginate(req.query, total);

  const applications = await ClubApplication.find(filter)
    .populate('user', 'name registrationNumber branch year photo')
    .sort({ createdAt: -1 })
    .skip(meta.skip)
    .limit(meta.limit);

  res.json(paginatedResponse(applications, meta));
});

// PATCH /api/v1/applications/:id/review (accept/reject - for coordinators)
const reviewApplication = asyncHandler(async (req, res) => {
  const { status, reviewNote } = req.body;
  if (!['accepted', 'rejected'].includes(status)) {
    throw ApiError.badRequest('Status must be accepted or rejected');
  }

  const application = await ClubApplication.findByIdAndUpdate(
    req.params.id,
    {
      status,
      reviewNote,
      reviewedBy: req.user._id,
      reviewedAt: new Date()
    },
    { new: true }
  ).populate('club', 'name');

  if (!application) throw ApiError.notFound('Application not found');

  if (status === 'accepted') {
    // Create membership
    const membership = await ClubMembership.create({
      user: application.user,
      club: application.club._id
    });
    await Club.findByIdAndUpdate(application.club._id, { $inc: { memberCount: 1 } });

    await notificationService.create({
      recipient: application.user,
      type: 'application_accepted',
      title: 'Application Accepted!',
      message: `Your application to join ${application.club.name} has been accepted!`,
      link: `/clubs/${application.club._id}`,
      relatedModel: 'Club',
      relatedId: application.club._id
    });
  } else {
    await notificationService.create({
      recipient: application.user,
      type: 'application_rejected',
      title: 'Application Update',
      message: `Your application to join ${application.club.name} was not accepted at this time.`,
      link: `/clubs/${application.club._id}`,
      relatedModel: 'Club',
      relatedId: application.club._id
    });
  }

  res.json({ success: true, message: `Application ${status}`, data: application });
});

module.exports = { applyToClub, getMyApplications, getClubApplications, reviewApplication };

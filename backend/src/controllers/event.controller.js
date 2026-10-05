const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const notificationService = require('../services/notification.service');
const { paginate, paginatedResponse } = require('../utils/pagination');

// GET /api/v1/events
const getEvents = asyncHandler(async (req, res) => {
  const { type, club, status, search, upcoming } = req.query;
  const filter = {};

  if (type) filter.type = type;
  if (club) filter.club = club;
  if (status) filter.status = status;
  if (search) filter.$text = { $search: search };
  if (upcoming === 'true') {
    filter.startDate = { $gte: new Date() };
    filter.status = { $in: ['upcoming', 'ongoing'] };
  }

  const total = await Event.countDocuments(filter);
  const meta = paginate(req.query, total);

  const events = await Event.find(filter)
    .populate('club', 'name logo category')
    .sort({ startDate: 1 })
    .skip(meta.skip)
    .limit(meta.limit);

  // Check registration status for current user
  const userId = req.user._id;
  const registrations = await EventRegistration.find({ user: userId }).select('event status');
  const regMap = {};
  registrations.forEach(r => { regMap[r.event.toString()] = r.status; });

  const eventsWithStatus = events.map(e => ({
    ...e.toObject(),
    registrationStatus: regMap[e._id.toString()] || null
  }));

  res.json(paginatedResponse(eventsWithStatus, meta));
});

// GET /api/v1/events/upcoming (for calendar - returns all upcoming events)
const getUpcomingEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({
    startDate: { $gte: new Date() },
    status: { $in: ['upcoming', 'ongoing'] }
  })
    .populate('club', 'name logo')
    .sort({ startDate: 1 })
    .limit(50);

  res.json({ success: true, data: events });
});

// GET /api/v1/events/this-week-winners (for dashboard widget)
const getThisWeekWinners = asyncHandler(async (req, res) => {
  const Result = require('../models/Result');
  const now = new Date();
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
  weekStart.setHours(0, 0, 0, 0);

  const results = await Result.find({
    weekStart: { $gte: weekStart },
    isPublished: true
  })
    .populate('event', 'title type')
    .populate('positions.winners.user', 'name photo')
    .populate('positions.club', 'name')
    .limit(5);

  res.json({ success: true, data: results });
});

// GET /api/v1/events/:id
const getEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)
    .populate('club', 'name logo category description')
    .populate('createdBy', 'name');

  if (!event) throw ApiError.notFound('Event not found');

  const registration = await EventRegistration.findOne({
    event: event._id,
    user: req.user._id
  });

  res.json({
    success: true,
    data: {
      ...event.toObject(),
      registrationStatus: registration?.status || null
    }
  });
});

// POST /api/v1/events/:id/register
const registerForEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) throw ApiError.notFound('Event not found');

  if (new Date() > event.registrationDeadline) {
    throw ApiError.badRequest('Registration deadline has passed');
  }

  if (event.maxParticipants && event.registrationCount >= event.maxParticipants) {
    throw ApiError.badRequest('Event is full');
  }

  const existing = await EventRegistration.findOne({
    event: event._id,
    user: req.user._id
  });
  if (existing && existing.status === 'registered') {
    throw ApiError.conflict('You are already registered for this event');
  }

  let registration;
  if (existing && existing.status === 'cancelled') {
    existing.status = 'registered';
    await existing.save();
    registration = existing;
  } else {
    registration = await EventRegistration.create({
      event: event._id,
      user: req.user._id,
      teamName: req.body.teamName,
      teamMembers: req.body.teamMembers || []
    });
  }

  await Event.findByIdAndUpdate(event._id, { $inc: { registrationCount: 1 } });

  await notificationService.create({
    recipient: req.user._id,
    type: 'event_registration_confirmed',
    title: 'Registration Confirmed!',
    message: `You are registered for ${event.title}`,
    link: `/events/${event._id}`,
    relatedModel: 'Event',
    relatedId: event._id
  });

  res.status(201).json({
    success: true,
    message: 'Registered successfully',
    data: registration
  });
});

// DELETE /api/v1/events/:id/register
const cancelRegistration = asyncHandler(async (req, res) => {
  const registration = await EventRegistration.findOneAndUpdate(
    { event: req.params.id, user: req.user._id, status: 'registered' },
    { status: 'cancelled' },
    { new: true }
  );

  if (!registration) throw ApiError.notFound('Registration not found');

  await Event.findByIdAndUpdate(req.params.id, { $inc: { registrationCount: -1 } });

  res.json({ success: true, message: 'Registration cancelled' });
});

// GET /api/v1/events/my-registrations
const getMyRegistrations = asyncHandler(async (req, res) => {
  const registrations = await EventRegistration.find({
    user: req.user._id,
    status: 'registered'
  })
    .populate('event')
    .sort({ 'event.startDate': 1 });

  res.json({ success: true, data: registrations });
});

module.exports = {
  getEvents,
  getUpcomingEvents,
  getThisWeekWinners,
  getEvent,
  registerForEvent,
  cancelRegistration,
  getMyRegistrations
};

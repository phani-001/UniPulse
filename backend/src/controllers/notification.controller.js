const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const { paginate, paginatedResponse } = require('../utils/pagination');

// GET /api/v1/notifications
const getNotifications = asyncHandler(async (req, res) => {
  const filter = { recipient: req.user._id };
  if (req.query.unread === 'true') filter.isRead = false;

  const total = await Notification.countDocuments(filter);
  const meta = paginate(req.query, total);

  const notifications = await Notification.find(filter)
    .sort({ createdAt: -1 })
    .skip(meta.skip)
    .limit(meta.limit);

  const unreadCount = await Notification.countDocuments({ recipient: req.user._id, isRead: false });

  res.json({
    ...paginatedResponse(notifications, meta),
    unreadCount
  });
});

// PATCH /api/v1/notifications/:id/read
const markRead = asyncHandler(async (req, res) => {
  await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user._id },
    { isRead: true }
  );
  res.json({ success: true, message: 'Marked as read' });
});

// PATCH /api/v1/notifications/read-all
const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { isRead: true }
  );
  res.json({ success: true, message: 'All notifications marked as read' });
});

// GET /api/v1/notifications/unread-count
const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({
    recipient: req.user._id,
    isRead: false
  });
  res.json({ success: true, data: { count } });
});

module.exports = { getNotifications, markRead, markAllRead, getUnreadCount };

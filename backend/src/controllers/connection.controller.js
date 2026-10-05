const Connection = require('../models/Connection');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const notificationService = require('../services/notification.service');
const { paginate, paginatedResponse } = require('../utils/pagination');

// POST /api/v1/connections/request/:userId
const sendRequest = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const requesterId = req.user._id;

  if (userId === requesterId.toString()) {
    throw ApiError.badRequest('You cannot connect with yourself');
  }

  // Check for existing connection in either direction
  const existing = await Connection.findOne({
    $or: [
      { requester: requesterId, recipient: userId },
      { requester: userId, recipient: requesterId }
    ]
  });

  if (existing) {
    if (existing.status === 'accepted') throw ApiError.conflict('Already connected');
    if (existing.status === 'pending') throw ApiError.conflict('Request already sent');
    // declined - allow re-request
    existing.status = 'pending';
    existing.requester = requesterId;
    existing.recipient = userId;
    if (req.body.note) existing.note = req.body.note;
    await existing.save();
    return res.json({ success: true, message: 'Connection request sent', data: existing });
  }

  const connection = await Connection.create({
    requester: requesterId,
    recipient: userId,
    note: req.body.note
  });

  await notificationService.create({
    recipient: userId,
    type: 'connection_request',
    title: 'New Connection Request',
    message: `${req.user.name} sent you a connection request`,
    link: `/connections/requests`,
    relatedModel: 'Connection',
    relatedId: connection._id
  });

  res.status(201).json({ success: true, message: 'Connection request sent', data: connection });
});

// PATCH /api/v1/connections/:id/respond
const respondToRequest = asyncHandler(async (req, res) => {
  const { action } = req.body; // 'accept' | 'decline'
  if (!['accept', 'decline'].includes(action)) {
    throw ApiError.badRequest('Action must be accept or decline');
  }

  const connection = await Connection.findOne({
    _id: req.params.id,
    recipient: req.user._id,
    status: 'pending'
  });

  if (!connection) throw ApiError.notFound('Connection request not found');

  connection.status = action === 'accept' ? 'accepted' : 'declined';
  connection.respondedAt = new Date();
  await connection.save();

  if (action === 'accept') {
    await notificationService.create({
      recipient: connection.requester,
      type: 'connection_accepted',
      title: 'Connection Accepted!',
      message: `${req.user.name} accepted your connection request`,
      link: `/profile/${req.user._id}`,
      relatedModel: 'Connection',
      relatedId: connection._id
    });
  }

  res.json({ success: true, message: `Request ${action}d`, data: connection });
});

// GET /api/v1/connections/my
const getMyConnections = asyncHandler(async (req, res) => {
  const connections = await Connection.find({
    $or: [{ requester: req.user._id }, { recipient: req.user._id }],
    status: 'accepted'
  })
    .populate('requester', 'name photo branch year registrationNumber')
    .populate('recipient', 'name photo branch year registrationNumber');

  const friends = connections.map(c => {
    const friend = c.requester._id.toString() === req.user._id.toString()
      ? c.recipient : c.requester;
    return friend;
  });

  res.json({ success: true, data: friends });
});

// GET /api/v1/connections/requests/incoming
const getIncomingRequests = asyncHandler(async (req, res) => {
  const requests = await Connection.find({
    recipient: req.user._id,
    status: 'pending'
  }).populate('requester', 'name photo branch year registrationNumber');

  res.json({ success: true, data: requests });
});

// GET /api/v1/connections/requests/outgoing
const getOutgoingRequests = asyncHandler(async (req, res) => {
  const requests = await Connection.find({
    requester: req.user._id,
    status: 'pending'
  }).populate('recipient', 'name photo branch year registrationNumber');

  res.json({ success: true, data: requests });
});

// GET /api/v1/connections/status/:userId
const getConnectionStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const myId = req.user._id;

  const connection = await Connection.findOne({
    $or: [
      { requester: myId, recipient: userId },
      { requester: userId, recipient: myId }
    ]
  });

  let status = 'none';
  let connectionId = null;
  if (connection) {
    connectionId = connection._id;
    if (connection.status === 'accepted') status = 'connected';
    else if (connection.status === 'pending') {
      status = connection.requester.toString() === myId.toString() ? 'pending_sent' : 'pending_received';
    } else {
      status = connection.status;
    }
  }

  res.json({ success: true, data: { status, connectionId } });
});

module.exports = {
  sendRequest,
  respondToRequest,
  getMyConnections,
  getIncomingRequests,
  getOutgoingRequests,
  getConnectionStatus
};

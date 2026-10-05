const Message = require('../models/Message');
const Connection = require('../models/Connection');
const User = require('../models/User');
const Notification = require('../models/Notification');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/v1/messages/conversations
const getConversations = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Find all accepted connections for this user
  const connections = await Connection.find({
    $or: [{ requester: userId }, { recipient: userId }],
    status: 'accepted'
  }).populate('requester recipient', 'name registrationNumber branch year photo points');

  const rawConversations = await Promise.all(
    connections.map(async (conn) => {
      if (!conn.requester || !conn.recipient) return null;

      const isRequester = conn.requester._id.toString() === userId.toString();
      const peer = isRequester ? conn.recipient : conn.requester;
      if (!peer || !peer._id) return null;

      // Find latest message between user and this peer
      const lastMessage = await Message.findOne({
        $or: [
          { sender: userId, recipient: peer._id },
          { sender: peer._id, recipient: userId }
        ]
      }).sort({ createdAt: -1 });

      // Count unread messages sent by peer to current user
      const unreadCount = await Message.countDocuments({
        sender: peer._id,
        recipient: userId,
        isRead: false
      });

      return {
        connectionId: conn._id,
        peer,
        lastMessage: lastMessage ? {
          content: lastMessage.content,
          createdAt: lastMessage.createdAt,
          isMine: lastMessage.sender.toString() === userId.toString(),
          isRead: lastMessage.isRead
        } : null,
        unreadCount,
        connectedSince: conn.updatedAt || conn.createdAt
      };
    })
  );

  const conversationList = rawConversations.filter(Boolean);

  // Sort by last message date or connection date (newest first)
  conversationList.sort((a, b) => {
    const timeA = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : new Date(a.connectedSince).getTime();
    const timeB = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : new Date(b.connectedSince).getTime();
    return timeB - timeA;
  });

  res.json({
    success: true,
    data: conversationList
  });
});

// GET /api/v1/messages/:peerId
const getMessages = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { peerId } = req.params;

  const peer = await User.findById(peerId).select('name registrationNumber branch year photo points');
  if (!peer) {
    throw ApiError.notFound('Student not found');
  }

  // Check if they are connected
  const connection = await Connection.findOne({
    $or: [
      { requester: userId, recipient: peerId },
      { requester: peerId, recipient: userId }
    ],
    status: 'accepted'
  });

  if (!connection) {
    throw ApiError.forbidden('You can only view chats with connected peers.');
  }

  // Mark all unread incoming messages as read
  await Message.updateMany(
    { sender: peerId, recipient: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );

  // Retrieve message history
  const messages = await Message.find({
    $or: [
      { sender: userId, recipient: peerId },
      { sender: peerId, recipient: userId }
    ]
  })
    .sort({ createdAt: 1 })
    .populate('sender', 'name registrationNumber');

  res.json({
    success: true,
    data: {
      peer,
      messages
    }
  });
});

// POST /api/v1/messages/:peerId
const sendMessage = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { peerId } = req.params;
  const { content } = req.body;

  if (!content || !content.trim()) {
    throw ApiError.badRequest('Message content cannot be empty');
  }

  const peer = await User.findById(peerId);
  if (!peer) {
    throw ApiError.notFound('Student not found');
  }

  // Ensure connection is accepted
  const connection = await Connection.findOne({
    $or: [
      { requester: userId, recipient: peerId },
      { requester: peerId, recipient: userId }
    ],
    status: 'accepted'
  });

  if (!connection) {
    throw ApiError.forbidden('You must be connected with this peer to send messages.');
  }

  const message = await Message.create({
    sender: userId,
    recipient: peerId,
    content: content.trim()
  });

  // Create notification for peer (non-blocking)
  try {
    await Notification.create({
      recipient: peerId,
      type: 'message',
      title: `💬 New message from ${req.user.name}`,
      message: content.trim().length > 70 ? content.trim().substring(0, 67) + '...' : content.trim(),
      link: `/messages?peer=${userId}`
    });
  } catch (notifErr) {
    console.warn('Could not create message notification:', notifErr.message);
  }

  const populatedMessage = await Message.findById(message._id).populate('sender', 'name registrationNumber');

  res.status(201).json({
    success: true,
    message: 'Message sent',
    data: populatedMessage
  });
});

// GET /api/v1/messages/unread-count
const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Message.countDocuments({
    recipient: req.user._id,
    isRead: false
  });

  res.json({
    success: true,
    data: { count }
  });
});

module.exports = {
  getConversations,
  getMessages,
  sendMessage,
  getUnreadCount
};

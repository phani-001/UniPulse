const express = require('express');
const router = express.Router();
const {
  getConversations,
  getMessages,
  sendMessage,
  getUnreadCount
} = require('../controllers/message.controller');
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

router.use(auth);

router.get('/conversations', getConversations);
router.get('/unread-count', getUnreadCount);
router.get('/:peerId', getMessages);

router.post(
  '/:peerId',
  [body('content').notEmpty().trim().withMessage('Message content is required')],
  validate,
  sendMessage
);

module.exports = router;

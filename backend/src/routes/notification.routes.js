const express = require('express');
const router = express.Router();
const { getNotifications, markRead, markAllRead, getUnreadCount } = require('../controllers/notification.controller');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/unread-count', getUnreadCount);
router.get('/', getNotifications);
router.patch('/read-all', markAllRead);
router.patch('/:id/read', markRead);

module.exports = router;

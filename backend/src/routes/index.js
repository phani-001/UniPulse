const express = require('express');
const router = express.Router();
const { loginLimiter, apiLimiter } = require('../middleware/rateLimiter');

const authRoutes = require('./auth.routes');
const clubRoutes = require('./club.routes');
const applicationRoutes = require('./application.routes');
const announcementRoutes = require('./announcement.routes');
const eventRoutes = require('./event.routes');
const resultRoutes = require('./result.routes');
const profileRoutes = require('./profile.routes');
const connectionRoutes = require('./connection.routes');
const teamPostRoutes = require('./teamPost.routes');
const notificationRoutes = require('./notification.routes');
const messageRoutes = require('./message.routes');

// Apply general rate limiter to all API routes
router.use(apiLimiter);

router.use('/auth', authRoutes);
router.use('/clubs', clubRoutes);
router.use('/applications', applicationRoutes);
router.use('/announcements', announcementRoutes);
router.use('/events', eventRoutes);
router.use('/results', resultRoutes);
router.use('/profiles', profileRoutes);
router.use('/connections', connectionRoutes);
router.use('/team-posts', teamPostRoutes);
router.use('/notifications', notificationRoutes);
router.use('/messages', messageRoutes);
router.use('/database', require('./database.routes'));

module.exports = router;

const express = require('express');
const router = express.Router();
const { getAnnouncements, getLatestAnnouncements, getAnnouncement } = require('../controllers/announcement.controller');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/latest', getLatestAnnouncements);
router.get('/', getAnnouncements);
router.get('/:id', getAnnouncement);

module.exports = router;

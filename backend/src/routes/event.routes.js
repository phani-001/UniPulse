const express = require('express');
const router = express.Router();
const {
  getEvents, getUpcomingEvents, getThisWeekWinners,
  getEvent, registerForEvent, cancelRegistration, getMyRegistrations
} = require('../controllers/event.controller');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/upcoming', getUpcomingEvents);
router.get('/this-week-winners', getThisWeekWinners);
router.get('/my-registrations', getMyRegistrations);
router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/:id/register', registerForEvent);
router.delete('/:id/register', cancelRegistration);

module.exports = router;

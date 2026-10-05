const express = require('express');
const router = express.Router();
const {
  getWeeklyResults, getResultHistory,
  getStudentLeaderboard, getClubLeaderboard
} = require('../controllers/result.controller');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/weekly', getWeeklyResults);
router.get('/history', getResultHistory);
router.get('/leaderboard/students', getStudentLeaderboard);
router.get('/leaderboard/clubs', getClubLeaderboard);

module.exports = router;

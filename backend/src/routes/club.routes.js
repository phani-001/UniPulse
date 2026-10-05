const express = require('express');
const router = express.Router();
const { getClubs, getMyClubs, getClub, leaveClub, getCategories } = require('../controllers/club.controller');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/categories', getCategories);
router.get('/my', getMyClubs);
router.get('/', getClubs);
router.get('/:id', getClub);
router.post('/:id/leave', leaveClub);

module.exports = router;

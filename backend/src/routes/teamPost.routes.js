const express = require('express');
const router = express.Router();
const {
  getTeamPosts, createTeamPost, getTeamPost,
  respondToTeamPost, deleteTeamPost, getMyTeamPosts
} = require('../controllers/teamPost.controller');
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

router.use(auth);
router.get('/my', getMyTeamPosts);
router.get('/', getTeamPosts);
router.post('/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('teamSize.needed').isInt({ min: 2 }).withMessage('Team size must be at least 2')
  ],
  validate,
  createTeamPost
);
router.get('/:id', getTeamPost);
router.post('/:id/respond', respondToTeamPost);
router.delete('/:id', deleteTeamPost);

module.exports = router;

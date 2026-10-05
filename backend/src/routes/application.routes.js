const express = require('express');
const router = express.Router();
const {
  applyToClub,
  getMyApplications,
  getClubApplications,
  reviewApplication
} = require('../controllers/application.controller');
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

router.use(auth);

router.get('/my', getMyApplications);
router.post('/clubs/:clubId',
  [
    body('reason').notEmpty().isLength({ max: 1000 }).withMessage('Reason is required (max 1000 chars)')
  ],
  validate,
  applyToClub
);
router.get('/clubs/:clubId', getClubApplications);
router.patch('/:id/review', reviewApplication);

module.exports = router;

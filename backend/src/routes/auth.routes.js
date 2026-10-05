const express = require('express');
const router = express.Router();
const { login, register, changePassword, getMe } = require('../controllers/auth.controller');
const auth = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimiter');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

router.post('/register',
  loginLimiter,
  [
    body('registrationNumber').notEmpty().trim().withMessage('Registration number is required'),
    body('name').notEmpty().trim().withMessage('Name is required'),
    body('email').optional({ checkFalsy: true }).isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('branch').optional().trim(),
    body('year').optional().isInt({ min: 1, max: 5 }).withMessage('Year must be between 1 and 5')
  ],
  validate,
  register
);

router.post('/login',
  loginLimiter,
  [
    body('registrationNumber').notEmpty().trim().withMessage('Registration number is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  login
);

router.post('/change-password',
  auth,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
  ],
  validate,
  changePassword
);

router.get('/me', auth, getMe);

module.exports = router;

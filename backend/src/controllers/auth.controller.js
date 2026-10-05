const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// POST /api/v1/auth/login
const login = asyncHandler(async (req, res) => {
  const { registrationNumber, password } = req.body;

  const user = await User.findOne({
    registrationNumber: registrationNumber.toUpperCase()
  }).select('+password');

  if (!user || !user.isActive) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  const token = signToken(user._id);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      token,
      user: user.toJSON(),
      requirePasswordChange: user.isFirstLogin
    }
  });
});

// POST /api/v1/auth/change-password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    throw ApiError.unauthorized('Current password is incorrect');
  }

  user.password = newPassword;
  user.isFirstLogin = false;
  await user.save();

  const token = signToken(user._id);

  res.json({
    success: true,
    message: 'Password changed successfully',
    data: { token }
  });
});

// POST /api/v1/auth/register
const register = asyncHandler(async (req, res) => {
  const { registrationNumber, name, email, password, branch, year } = req.body;

  const normalizedReg = registrationNumber.trim().toUpperCase();

  // Check if user already exists with this registration number
  const existingUser = await User.findOne({ registrationNumber: normalizedReg });
  if (existingUser) {
    throw ApiError.conflict('A student with this registration number is already registered');
  }

  // Check if user already exists with this email (if provided)
  if (email && email.trim()) {
    const existingEmail = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingEmail) {
      throw ApiError.conflict('An account with this email address already exists');
    }
  }

  // Create new user
  const user = await User.create({
    registrationNumber: normalizedReg,
    name: name.trim(),
    email: email && email.trim() ? email.trim().toLowerCase() : undefined,
    password,
    branch: branch && branch.trim() ? branch.trim() : undefined,
    year: year ? Number(year) : 1,
    role: 'student',
    isFirstLogin: false,
    isActive: true
  });

  const token = signToken(user._id);

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: {
      token,
      user: user.toJSON(),
      requirePasswordChange: false
    }
  });
});

// GET /api/v1/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

module.exports = { login, register, changePassword, getMe };


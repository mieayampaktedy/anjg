const express = require('express');
const router = express.Router();
const { login, getMe, changePassword } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// @route   POST api/auth/login
// @desc    Authenticate admin & get token
// @access  Public
router.post('/login', login);

// @route   GET api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', authMiddleware, getMe);

// @route   POST api/auth/change-password
// @desc    Change current user's password
// @access  Private (all roles)
router.post('/change-password', authMiddleware, changePassword);

module.exports = router;

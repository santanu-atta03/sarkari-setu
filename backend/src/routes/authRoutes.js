/**
 * Auth Routes
 *
 * Mount at: /api/auth
 *
 *  POST /login       — admin login, returns JWT
 *  GET  /me          — get current admin profile (protected)
 *  POST /seed-admin  — dev-only seed the first super admin
 */

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const userAuthController = require('../controllers/userAuthController');
const { protect } = require('../middleware/auth');

// Admin Routes
router.post('/login', authController.login);
router.get('/me', protect, authController.getMe);
router.post('/seed-admin', authController.seedAdmin);

// User Routes
router.post('/send-otp', userAuthController.sendOTP);
router.post('/verify-otp', userAuthController.verifyOTP);
router.post('/google-login', userAuthController.googleLogin);

module.exports = router;

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
const { protect } = require('../middleware/auth');

router.post('/login', authController.login);
router.get('/me', protect, authController.getMe);
router.post('/seed-admin', authController.seedAdmin);

module.exports = router;

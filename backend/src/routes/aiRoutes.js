/**
 * AI Routes — SarkariSetu
 *
 * Protected admin-only routes for AI-powered job data extraction.
 */

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Strict rate limit for AI endpoints (expensive Gemini calls)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,             // max 10 extractions per minute
  message: { success: false, message: 'Too many AI requests. Please wait a moment.' },
});

// POST /api/ai/extract-job — Extract job details from URL or text
router.post('/extract-job', protect, aiLimiter, aiController.extractJob);

module.exports = router;

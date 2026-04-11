const express = require('express');
const router = express.Router();
const jobExtractController = require('../controllers/jobExtractController');
const { protect } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const extractLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,             // max 10 extractions per minute
  message: { success: false, message: 'Too many extraction requests. Please wait a moment.' },
});

// Start a background job extraction process
router.post('/start', protect, extractLimiter, jobExtractController.startExtraction);

// Poll for extraction status and result
router.get('/:trackingId', protect, jobExtractController.getExtractionStatus);

module.exports = router;

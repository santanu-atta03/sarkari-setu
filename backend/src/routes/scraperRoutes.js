const express = require('express');
const scraperService = require('../services/scraper/ScraperService');
// const { protect, authorize } = require('../middleware/auth'); // Assuming auth exists

const router = express.Router();

// Manual trigger for scraping
// router.post('/run', protect, authorize('admin'), async (req, res) => {
router.post('/run', async (req, res) => {
  try {
    const results = await scraperService.runAll();
    res.json({
      success: true,
      message: 'Scraping process completed.',
      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during manual scraping.',
      error: error.message,
    });
  }
});

module.exports = router;

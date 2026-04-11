const express = require('express');
const IngestionController = require('../controllers/IngestionController');
// const { protect, authorize } = require('../middleware/auth'); // Assuming auth exists

const router = express.Router();

// Manual trigger for scraping (Existing)
router.post('/run', async (req, res) => {
  // ... this currently uses the old architecture
});

// New AI-Powered Discovery Flow
router.post('/discover', IngestionController.triggerCrawl);
router.get('/drafts', IngestionController.getDrafts);
router.patch('/publish/:id', IngestionController.publishJob);

module.exports = router;

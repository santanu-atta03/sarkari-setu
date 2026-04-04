/**
 * Job Routes — SarkariSetu
 * 
 * Public:
 *  - GET /api/jobs (List with filters/pagination)
 *  - GET /api/jobs/:slug (Single job)
 * 
 * Admin (Protected):
 *  - POST /api/jobs (Create)
 *  - PATCH /api/jobs/:id (Update)
 *  - DELETE /api/jobs/:id (Delete)
 */

const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { protect } = require('../middleware/auth'); // Admin authentication
const { cacheMiddleware, clearCache } = require('../middleware/cache');

// ─── Public Routes ─────────────────────────────────────────────────────────────

// Cache GET requests for 5 minutes (300s)
router.get('/', cacheMiddleware(300), jobController.listJobs);
router.get('/slugs', cacheMiddleware(3600), jobController.getAllSlugs); // Cache slugs longer (1hr)
router.get('/:identifier', cacheMiddleware(600), jobController.getJob); // Cache single job for 10 min
router.patch('/:id/download', jobController.incrementDownload);

// ─── Protected Admin Routes ──────────────────────────────────────────────────

// Write operation clearing cache
router.post('/', protect, (req, res, next) => { clearCache('cache_'); next(); }, jobController.createJob);
router.patch('/:id', protect, (req, res, next) => { clearCache('cache_'); next(); }, jobController.updateJob);
router.delete('/:id', protect, (req, res, next) => { clearCache('cache_'); next(); }, jobController.deleteJob);

module.exports = router;

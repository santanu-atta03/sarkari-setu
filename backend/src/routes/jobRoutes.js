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

// ─── Public Routes ─────────────────────────────────────────────────────────────

router.get('/', jobController.listJobs);
router.get('/:identifier', jobController.getJob);

// ─── Protected Admin Routes ──────────────────────────────────────────────────

router.post('/', protect, jobController.createJob);
router.patch('/:id', protect, jobController.updateJob);
router.delete('/:id', protect, jobController.deleteJob);

module.exports = router;

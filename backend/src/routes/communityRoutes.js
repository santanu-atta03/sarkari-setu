const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const { protect, protectUser, protectAny } = require('../middleware/auth');

// Comments
router.get('/jobs/:jobId/comments', communityController.getJobComments);
router.post('/jobs/:jobId/comments', protectAny, communityController.addComment);

// Reports / Crowd-sourcing
// Notice how protect is not strictly used so anonymous basic reports are possible, 
// though we can use it to attach user if logged in via an optionalAuth middleware.
// For now, let's keep it open, or we can enforce login to avoid spam.
// Let's enforce login to avoid spam.
router.post('/reports', protectAny, communityController.submitReport);

module.exports = router;

/**
 * User Profile Routes
 * 
 * Mount at: /api/users
 */

const express = require('express');
const router = express.Router();
const userProfileController = require('../controllers/userProfileController');
const { protectUser } = require('../middleware/auth');

router.use(protectUser);

// Profile
router.get('/profile', userProfileController.getProfile);
router.put('/profile', userProfileController.updateProfile);

// Smart Matching Matcher Feed
router.get('/eligible-jobs', userProfileController.getEligibleJobs);

// My Applications / Exam Tracker
router.get('/applications', userProfileController.getMyApplications);
router.post('/applications/:jobId', userProfileController.applyForJob);

module.exports = router;

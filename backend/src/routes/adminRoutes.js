const express = require('express');
const router = express.Router();
const adminDashboardController = require('../controllers/adminDashboardController');
const { protect, restrictTo } = require('../middleware/auth');

// All routes here require admin authentication
router.use(protect);

router.get('/dashboard-stats', adminDashboardController.getDashboardStats);
router.get('/jobs', adminDashboardController.listAdminJobs);

module.exports = router;

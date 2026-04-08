const express = require('express');
const router = express.Router();
const engagementController = require('../controllers/engagementController');

router.get('/current-affairs', engagementController.getCurrentAffairs);
router.get('/daily-quiz', engagementController.getDailyQuiz);
router.get('/resources', engagementController.getResources);
router.post('/salary-calculator', engagementController.calculateSalary);
router.post('/predict-cutoff', engagementController.predictCutoff);

module.exports = router;

const express = require('express');
const { suggestJobDetails, findMatchingWorkers, suggestCategory, generateDescription } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// AI suggestions for job posting
router.post('/suggest', protect, suggestJobDetails);

// Suggest category only
router.post('/suggest-category', protect, suggestCategory);

// Find matching workers
router.get('/workers', protect, findMatchingWorkers);

// Generate improved job description
router.post('/generate-description', protect, generateDescription);

module.exports = router;

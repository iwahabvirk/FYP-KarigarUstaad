const express = require('express');
const { suggestJobDetails, findMatchingWorkers, suggestCategory } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// AI suggestions for job posting
router.post('/suggest', protect, suggestJobDetails);

// Suggest category only
router.post('/suggest-category', protect, suggestCategory);

// Find matching workers
router.get('/workers', protect, findMatchingWorkers);

module.exports = router;

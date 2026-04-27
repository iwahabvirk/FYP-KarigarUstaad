const express = require('express');
const { suggestJobDetails, findMatchingWorkers } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// AI suggestions for job posting
router.post('/suggest', protect, suggestJobDetails);

// Find matching workers
router.get('/workers', protect, findMatchingWorkers);

module.exports = router;

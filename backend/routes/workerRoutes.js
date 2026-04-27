const express = require('express');
const { getWorkerProfile, getRecommendedWorkers } = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/recommend', protect, authorizeRoles('customer'), getRecommendedWorkers);
router.get('/:id', protect, authorizeRoles('employer'), getWorkerProfile);

module.exports = router;

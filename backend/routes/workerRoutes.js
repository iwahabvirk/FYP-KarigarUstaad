const express = require('express');
const { getWorkerProfile } = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/:id', protect, authorizeRoles('employer'), getWorkerProfile);

module.exports = router;

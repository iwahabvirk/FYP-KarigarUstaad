const express = require('express');
const {
  getMe,
  updateMe,
  getWorkerProfile,
} = require('../controllers/userController');

const router = express.Router();

const { protect, authorizeRoles } = require('../middleware/auth');

router.route('/me').get(protect, getMe).put(protect, updateMe);

router.route('/worker/:id').get(protect, authorizeRoles('employer'), getWorkerProfile);

module.exports = router;
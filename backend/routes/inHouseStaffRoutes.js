const express = require('express');
const router = express.Router();
const { getAllStaff, bookStaff } = require('../controllers/inHouseStaffController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getAllStaff);

// Protected routes
router.post('/book', protect, bookStaff);

module.exports = router;
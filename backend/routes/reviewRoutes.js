const express = require('express');
const {
  createReview,
  getWorkerReviews,
} = require('../controllers/reviewController');

const router = express.Router();

const { protect, authorizeRoles } = require('../middleware/auth');

router.route('/').post(protect, authorizeRoles('employer'), createReview);

router.route('/worker/:workerId').get(getWorkerReviews);

module.exports = router;
const express = require('express');
const {
  applyJob,
  getMyApplications,
  updateApplicationStatus,
  getApplicationById,
  withdrawApplication,
} = require('../controllers/applicationController');
const { protect, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Worker routes
router.post('/:jobId/apply', protect, authorizeRoles('worker'), applyJob);
router.get('/my', protect, authorizeRoles('worker'), getMyApplications);
router.delete('/:applicationId/withdraw', protect, authorizeRoles('worker'), withdrawApplication);

// Employer routes
router.patch('/:applicationId/status', protect, authorizeRoles('employer'), updateApplicationStatus);

// Shared routes
router.get('/:applicationId', protect, getApplicationById);

module.exports = router;

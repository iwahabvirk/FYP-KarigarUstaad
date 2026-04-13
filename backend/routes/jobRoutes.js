const express = require('express');
const {
  createJob,
  getAllJobs,
  getMyJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobApplicants,
  updateJobStatus,
} = require('../controllers/jobController');
const { applyJob } = require('../controllers/applicationController');
const { payForJob } = require('../controllers/walletController');
const { protect, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getAllJobs);
router.get('/:id', getJobById);

// Worker routes
router.post('/:id/apply', protect, authorizeRoles('worker'), applyJob);

// Protected routes - Employer only
router.post('/', protect, authorizeRoles('employer'), createJob);
router.get('/my', protect, authorizeRoles('employer'), getMyJobs);
router.patch('/:id', protect, authorizeRoles('employer'), updateJob);
router.put('/:id/status', protect, authorizeRoles('employer'), updateJobStatus);
router.put('/:id/pay', protect, authorizeRoles('employer'), payForJob);
router.delete('/:id', protect, authorizeRoles('employer'), deleteJob);
router.get('/:id/applicants', protect, authorizeRoles('employer'), getJobApplicants);

module.exports = router;

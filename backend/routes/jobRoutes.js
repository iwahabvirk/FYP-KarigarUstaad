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
  completeJob,
  acceptJob,
  arrivedAtJob,
} = require('../controllers/jobController');
const { applyJob } = require('../controllers/applicationController');
const { payForJob } = require('../controllers/walletController');
const { protect, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Protected routes - MUST come before :id routes
router.post('/', protect, authorizeRoles('employer', 'customer'), createJob);
router.get('/my', protect, authorizeRoles('employer', 'customer'), getMyJobs);

// Worker action routes - MUST come before /:id
router.put('/:id/accept', protect, authorizeRoles('worker'), acceptJob);
router.put('/:id/arrived', protect, authorizeRoles('worker'), arrivedAtJob);
router.put('/:id/complete', protect, authorizeRoles('worker'), completeJob);
router.post('/:id/apply', protect, authorizeRoles('worker'), applyJob);

// Employer routes - MUST come before /:id
router.get('/:id/applicants', protect, authorizeRoles('employer'), getJobApplicants);
router.patch('/:id', protect, authorizeRoles('employer'), updateJob);
router.put('/:id/status', protect, authorizeRoles('employer'), updateJobStatus);
router.put('/:id/pay', protect, authorizeRoles('employer'), payForJob);
router.delete('/:id', protect, authorizeRoles('employer'), deleteJob);

// Public routes - MUST come last
router.get('/', getAllJobs);
router.get('/:id', getJobById);

module.exports = router;

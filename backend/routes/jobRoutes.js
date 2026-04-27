const express = require('express');
const {
  createJob,
  getAllJobs,
  getMyJobs,
  getWorkerJobs,
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
const { getRecommendedJobs } = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Protected routes - MUST come before :id routes
router.get('/recommend', protect, authorizeRoles('worker'), getRecommendedJobs);
router.post('/', protect, authorizeRoles('employer', 'customer'), createJob);
router.get('/my', protect, authorizeRoles('employer', 'customer'), getMyJobs);
router.get('/worker/my', protect, authorizeRoles('worker'), getWorkerJobs);

// Worker action routes - MUST come before /:id
router.put('/:id/accept', protect, authorizeRoles('worker'), acceptJob);
router.put('/:id/arrived', protect, authorizeRoles('worker'), arrivedAtJob);
router.put('/:id/complete', protect, authorizeRoles('worker'), completeJob);
router.post('/:id/apply', protect, authorizeRoles('worker'), applyJob);

// Employer routes - MUST come before /:id
router.get('/:id/applicants', protect, authorizeRoles('employer', 'customer'), getJobApplicants);
router.patch('/:id', protect, authorizeRoles('employer', 'customer'), updateJob);
router.put('/:id/status', protect, authorizeRoles('employer', 'customer'), updateJobStatus);
router.put('/:id/pay', protect, authorizeRoles('employer', 'customer'), payForJob);
router.delete('/:id', protect, authorizeRoles('employer', 'customer'), deleteJob);

// Public routes - MUST come last
router.get('/', getAllJobs);
router.get('/:id', getJobById);

module.exports = router;

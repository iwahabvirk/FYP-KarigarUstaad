const Review = require('../models/Review');
const User = require('../models/User');
const Job = require('../models/Job');
const asyncHandler = require('../middleware/async');

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private (Employer only)
exports.createReview = asyncHandler(async (req, res, next) => {
  const { worker, job, rating, comment } = req.body;

  // Check if job exists and is completed
  const jobDoc = await Job.findById(job);
  if (!jobDoc) {
    return res.status(404).json({
      success: false,
      message: 'Job not found',
    });
  }

  if (jobDoc.status !== 'completed') {
    return res.status(400).json({
      success: false,
      message: 'Can only review completed jobs',
    });
  }

  // Check if employer owns the job
  if (jobDoc.employer.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to review this job',
    });
  }

  // Check if worker was accepted for this job
  const Application = require('../models/Application');
  const application = await Application.findOne({
    job,
    worker,
    status: 'accepted',
  });

  if (!application) {
    return res.status(400).json({
      success: false,
      message: 'Worker was not accepted for this job',
    });
  }

  // Create review
  const review = await Review.create({
    worker,
    employer: req.user.id,
    job,
    rating,
    comment,
  });

  // Update worker's rating and total reviews
  const reviews = await Review.find({ worker });
  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = totalRating / reviews.length;

  await User.findByIdAndUpdate(worker, {
    rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    totalReviews: reviews.length,
  });

  res.status(201).json({
    success: true,
    data: review,
  });
});

// @desc    Get reviews for a worker
// @route   GET /api/reviews/worker/:workerId
// @access  Public
exports.getWorkerReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find({ worker: req.params.workerId })
    .populate('employer', 'name')
    .populate('job', 'title')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});
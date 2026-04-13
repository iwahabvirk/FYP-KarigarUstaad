const User = require('../models/User');
const asyncHandler = require('../middleware/async');

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
exports.updateMe = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    skills: req.body.skills,
    experience: req.body.experience,
    location: req.body.location,
  };

  // Remove undefined fields
  Object.keys(fieldsToUpdate).forEach(key => {
    if (fieldsToUpdate[key] === undefined) {
      delete fieldsToUpdate[key];
    }
  });

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Get worker profile with reviews
// @route   GET /api/users/worker/:id
// @access  Private (Employer only)
exports.getWorkerProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  if (user.role !== 'worker') {
    return res.status(400).json({
      success: false,
      message: 'User is not a worker',
    });
  }

  // Get worker's reviews
  const Review = require('../models/Review');
  const reviews = await Review.find({ worker: req.params.id })
    .populate('employer', 'name')
    .populate('job', 'title')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: {
      ...user.toObject(),
      reviews,
    },
  });
});
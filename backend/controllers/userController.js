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
    phone: req.body.phone,
    bio: req.body.bio,
    skills: req.body.skills,
    experience: req.body.experience,
    location: req.body.location,
    profileImage: req.body.profileImage,
  };

  // Add role-specific fields
  if (req.user.role === 'worker') {
    fieldsToUpdate.availability = req.body.availability;
    fieldsToUpdate.responseTime = req.body.responseTime;
  }

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

// @desc    Get recommended workers
// @route   GET /api/workers/recommend
// @access  Private (Customer only)
exports.getRecommendedWorkers = asyncHandler(async (req, res, next) => {
  const { category, location } = req.query;

  if (!category) {
    return res.status(400).json({
      success: false,
      message: 'Category is required',
    });
  }

  // Find all workers
  const workers = await User.find({ role: 'worker' });

  // Filter by category in skills
  const filteredWorkers = workers.filter(worker =>
    worker.skills && worker.skills.includes(category)
  );

  // Calculate scores
  const scoredWorkers = filteredWorkers.map(worker => {
    const rating = worker.rating || 0;
    const totalReviews = worker.totalReviews || 0;
    const experience = worker.experience || '';
    const workerLocation = worker.location || '';

    // Extract experience years
    const experienceMatch = experience.match(/(\d+)/);
    const experienceYears = experienceMatch ? parseInt(experienceMatch[1], 10) : 0;

    // Location match bonus
    const locationMatchBonus = workerLocation.toLowerCase().includes(location.toLowerCase()) ? 10 : 0;

    // Calculate score
    const score = (rating * 5) + (totalReviews * 0.5) + (experienceYears * 2) + locationMatchBonus;

    return {
      name: worker.name,
      skills: worker.skills,
      rating,
      reviews: totalReviews,
      location: workerLocation,
      score,
    };
  });

  // Sort by score descending and take top 5
  const recommendedWorkers = scoredWorkers
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  res.status(200).json({
    success: true,
    data: recommendedWorkers,
  });
});

// @desc    Get worker profile with reviews
// @route   GET /api/users/worker/:id
// @access  Private
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
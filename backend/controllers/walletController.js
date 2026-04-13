const User = require('../models/User');
const Job = require('../models/Job');
const asyncHandler = require('../middleware/async');

// @desc    Get wallet info
// @route   GET /api/wallet
// @access  Private
exports.getWallet = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('wallet');

  res.status(200).json({
    success: true,
    data: user.wallet,
  });
});

// @desc    Mark job as paid (Employer only)
// @route   PUT /api/jobs/:id/pay
// @access  Private (Employer only)
exports.payForJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Job not found',
    });
  }

  if (job.employer.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to pay for this job',
    });
  }

  if (job.status !== 'completed') {
    return res.status(400).json({
      success: false,
      message: 'Job must be completed before payment',
    });
  }

  // Find the accepted worker
  const Application = require('../models/Application');
  const application = await Application.findOne({
    job: req.params.id,
    status: 'accepted',
  });

  if (!application) {
    return res.status(400).json({
      success: false,
      message: 'No accepted worker found for this job',
    });
  }

  // Move pending to balance for worker
  await User.findByIdAndUpdate(application.worker, {
    $inc: {
      'wallet.pending': -job.budget,
      'wallet.balance': job.budget,
    },
  });

  // Update job status to paid
  job.status = 'paid';
  await job.save();

  res.status(200).json({
    success: true,
    message: 'Payment processed successfully',
  });
});

// @desc    Withdraw from wallet (Worker only)
// @route   POST /api/wallet/withdraw
// @access  Private (Worker only)
exports.withdrawFromWallet = asyncHandler(async (req, res, next) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid amount',
    });
  }

  const user = await User.findById(req.user.id);

  if (user.wallet.balance < amount) {
    return res.status(400).json({
      success: false,
      message: 'Insufficient balance',
    });
  }

  // Deduct from balance
  user.wallet.balance -= amount;
  await user.save();

  // In a real app, this would integrate with a payment processor
  // For now, just log the withdrawal
  console.log(`Withdrawal of ${amount} processed for user ${user.id}`);

  res.status(200).json({
    success: true,
    message: 'Withdrawal processed successfully',
    newBalance: user.wallet.balance,
  });
});
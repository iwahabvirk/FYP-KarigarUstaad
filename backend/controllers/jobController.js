const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');

// Create Job (Employer only)
exports.createJob = async (req, res) => {
  try {
    const { title, description, budget, location, category, requiredSkills } = req.body;

    if (!title || !description || !budget || !location || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, category, budget, and location',
      });
    }

    if (!['employer', 'customer'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Only customers or employers can post jobs',
      });
    }

    const parsedBudget = Number(budget);
    if (Number.isNaN(parsedBudget) || parsedBudget <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Budget must be a valid number greater than 0',
      });
    }

    const job = await Job.create({
      title: title.trim(),
      description: description.trim(),
      budget: parsedBudget,
      location: location.trim(),
      category: category.trim(),
      requiredSkills: requiredSkills || [category.trim()],
      employer: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Jobs (Worker)
exports.getAllJobs = async (req, res) => {
  try {
    const { category, search, minBudget, maxBudget } = req.query;

    const filter = { status: 'pending' };
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (minBudget || maxBudget) {
      filter.budget = {};
      if (minBudget) filter.budget.$gte = parseInt(minBudget, 10);
      if (maxBudget) filter.budget.$lte = parseInt(maxBudget, 10);
    }

    const jobs = await Job.find(filter)
      .populate('employer', 'name email rating')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get My Jobs (Employer)
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user.id })
      .sort('-createdAt')
      .populate('employer', 'name email');

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('employer', 'name email rating');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Job (Employer only)
exports.updateJob = async (req, res) => {
  try {
    const { title, description, budget, location, category, status } = req.body;
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
        message: 'Not authorized to update this job',
      });
    }

    if (title) job.title = title;
    if (description) job.description = description;
    if (budget) job.budget = budget;
    if (location) job.location = location;
    if (category) job.category = category;
    if (status) job.status = status;

    await job.save();

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Job (Employer only)
exports.deleteJob = async (req, res) => {
  try {
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
        message: 'Not authorized to delete this job',
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Job Applicants (Employer only)
exports.getJobApplicants = async (req, res) => {
  try {
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
        message: 'Not authorized to view applicants',
      });
    }

    const applications = await Application.find({ job: req.params.id })
      .populate('worker', 'name email rating skills')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Job Status
exports.updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['pending', 'accepted', 'in_progress', 'completed', 'paid'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid status',
      });
    }

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
        message: 'Not authorized to update this job',
      });
    }

    if (status === 'completed' && job.status !== 'completed') {
      const application = await Application.findOne({
        job: req.params.id,
        status: 'accepted',
      });

      if (application) {
        await User.findByIdAndUpdate(application.worker, {
          $inc: { 'wallet.pending': job.budget },
        });
      }
    }

    job.status = status;
    await job.save();

    res.status(200).json({
      success: true,
      message: 'Job status updated successfully',
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Complete Job (Worker only)
exports.completeJob = async (req, res) => {
  try {
    const { notes } = req.body;

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check if worker is assigned to this job
    const application = await Application.findOne({
      job: req.params.id,
      worker: req.user.id,
      status: 'accepted',
    });

    if (!application) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to complete this job',
      });
    }

    if (job.status !== 'in_progress') {
      return res.status(400).json({
        success: false,
        message: 'Job must be in progress to complete',
      });
    }

    // Update job status
    job.status = 'completed';
    if (notes) job.notes = notes;
    await job.save();

    // Add earnings to worker's wallet
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { 'wallet.pending': job.budget },
    });

    res.status(200).json({
      success: true,
      message: 'Job completed successfully',
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

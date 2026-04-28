const mongoose = require('mongoose');
const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const ensureValidJobId = (id, res) => {
  if (!isValidObjectId(id)) {
    console.error('❌ JobController: Invalid job ID format', { id });
    res.status(400).json({
      success: false,
      message: 'Invalid job ID',
    });
    return false;
  }
  return true;
};

const normalizeJobStatus = (status) => {
  if (!status) return status;
  if (status === 'in-progress') return 'in_progress';
  return status;
};

// Create Job (Employer only)
exports.createJob = async (req, res) => {
  try {
    const { title, description, budget, location, category, requiredSkills } = req.body;
    const customerId = req.user?.id;

    console.log('💼 JobController: createJob called', {
      title,
      customerId,
      category,
      budget,
    });

    if (!title || !description || !budget || !location || !category) {
      console.error('❌ JobController: Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, category, budget, and location',
      });
    }

    if (!['employer', 'customer'].includes(req.user.role)) {
      console.error('❌ JobController: User role not allowed', { role: req.user.role });
      return res.status(403).json({
        success: false,
        message: 'Only customers or employers can post jobs',
      });
    }

    const parsedBudget = Number(budget);
    if (Number.isNaN(parsedBudget) || parsedBudget <= 0) {
      console.error('❌ JobController: Invalid budget', { budget });
      return res.status(400).json({
        success: false,
        message: 'Budget must be a valid number greater than 0',
      });
    }

    // Normalize and validate category
    const normalizedCategory = category?.toLowerCase().trim();
    const validCategories = ['plumbing','electrical','painting','cleaning','carpentry'];
    if (!validCategories.includes(normalizedCategory)) {
      console.error('❌ JobController: Invalid category', { category, normalizedCategory });
      return res.status(400).json({
        success: false,
        message: 'Invalid category provided',
      });
    }

    console.log('💼 JobController: Creating job in database...', {
      title,
      customer: customerId,
      employer: customerId,
      category: normalizedCategory,
      budget: parsedBudget,
    });

    const job = await Job.create({
      title: title.trim(),
      description: description.trim(),
      budget: parsedBudget,
      location: location.trim(),
      category: normalizedCategory,
      requiredSkills: requiredSkills || [normalizedCategory],
      customer: customerId,
      employer: customerId,
      status: 'pending',
    });

    console.log('✅ JobController: Job created successfully', {
      jobId: job._id,
      title: job.title,
      budget: job.budget,
      customer: job.customer,
    });

    res.status(201).json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error('❌ JobController: Error creating job', {
      message: error.message,
      stack: error.stack,
    });
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
      .populate('customer', 'name email phone')
      .populate('employer', 'name email rating')
      .populate('assignedWorker', 'name')
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
    const jobs = await Job.find({ customer: req.user.id })
      .sort('-createdAt')
      .populate('customer', 'name email phone')
      .populate('assignedWorker', 'name');

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

// Get Worker Jobs (Worker)
exports.getWorkerJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ assignedWorker: req.user.id })
      .sort('-createdAt')
      .populate('customer', 'name email phone')
      .populate('assignedWorker', 'name');

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
    const jobId = req.params.id;
    if (!ensureValidJobId(jobId, res)) return;
    console.log('💼 JobController: getJobById called', { jobId });

    const job = await Job.findById(jobId)
      .populate('customer', 'name email phone')
      .populate('assignedWorker', 'name');

    if (!job) {
      console.error('❌ JobController: Job not found', { jobId });
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    console.log('✅ JobController: Job retrieved', {
      jobId: job._id,
      title: job.title,
      status: job.status,
      customer: job.customer,
    });
    console.log('JOB DATA:', JSON.stringify(job, null, 2));

    res.status(200).json(job);
  } catch (error) {
    console.error('❌ JobController: Error getting job', {
      jobId: req.params.id,
      message: error.message,
    });
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Job (Employer only)
exports.updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    if (!ensureValidJobId(jobId, res)) return;

    const { title, description, budget, location, category, status } = req.body;
    const job = await Job.findById(jobId);

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
    const jobId = req.params.id;
    if (!ensureValidJobId(jobId, res)) return;

    const job = await Job.findById(jobId);

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

    await Job.findByIdAndDelete(jobId);

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
    const jobId = req.params.id;
    if (!ensureValidJobId(jobId, res)) return;

    const job = await Job.findById(jobId);

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

    const applications = await Application.find({ job: jobId })
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
    const jobId = req.params.id;
    if (!ensureValidJobId(jobId, res)) return;

    const status = normalizeJobStatus(req.body.status);

    if (!status || !['pending','accepted','in_progress','completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid status',
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Allow employer/customer to update, or assigned worker to update status
    const isEmployer = job.employer.toString() === req.user.id;
    const isAssignedWorker = job.assignedWorker && job.assignedWorker.toString() === req.user.id;
    
    if (!isEmployer && !isAssignedWorker) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job',
      });
    }

    // Workers can only update to in_progress or completed
    if (isAssignedWorker && !['in_progress', 'completed'].includes(status)) {
      return res.status(403).json({
        success: false,
        message: 'Workers can only update status to in_progress or completed',
      });
    }

    // Employers can update to accepted, in_progress, completed
    if (isEmployer && !['accepted', 'in_progress', 'completed'].includes(status)) {
      return res.status(403).json({
        success: false,
        message: 'Employers can only update status to accepted, in_progress, or completed',
      });
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

// Mark Arrived (Worker only)
exports.arrivedAtJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    if (!ensureValidJobId(jobId, res)) return;
    const workerId = req.user.id;

    console.log('👷 JobController: arrivedAtJob called', {
      jobId,
      workerId,
    });

    const job = await Job.findById(jobId);

    if (!job) {
      console.error('❌ JobController: Job not found', { jobId });
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check if worker is assigned to this job
    if (job.assignedWorker.toString() !== workerId) {
      console.error('❌ JobController: Worker not assigned to this job', { jobId, workerId });
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job',
      });
    }

    if (job.status !== 'in_progress') {
      console.error('❌ JobController: Job not in progress', { jobId, status: job.status });
      return res.status(400).json({
        success: false,
        message: 'Job must be in progress to mark as arrived',
      });
    }

    console.log('👷 JobController: Updating job status to arrived...');
    job.status = 'arrived';
    await job.save();

    console.log('✅ JobController: Worker marked arrived', {
      jobId: job._id,
      workerId,
      jobTitle: job.title,
    });

    res.status(200).json({
      success: true,
      message: 'Marked as arrived successfully',
      data: job,
    });
  } catch (error) {
    console.error('❌ JobController: Error marking arrived', {
      jobId: req.params.id,
      workerId: req.user.id,
      message: error.message,
    });
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
    const jobId = req.params.id;
    if (!ensureValidJobId(jobId, res)) return;
    const workerId = req.user.id;

    console.log('✅ JobController: completeJob called', {
      jobId,
      workerId,
      hasNotes: !!notes,
    });

    const job = await Job.findById(jobId);

    if (!job) {
      console.error('❌ JobController: Job not found for completion', { jobId });
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check if worker is assigned to this job
    console.log('✅ JobController: Checking worker assignment...');
    const application = await Application.findOne({
      job: jobId,
      worker: workerId,
      status: 'accepted',
    });

    if (!application) {
      console.error('❌ JobController: Worker not authorized', { jobId, workerId });
      return res.status(403).json({
        success: false,
        message: 'Not authorized to complete this job',
      });
    }

    if (job.status !== 'in_progress') {
      console.error('❌ JobController: Job not in progress', { jobId, status: job.status });
      return res.status(400).json({
        success: false,
        message: 'Job must be in progress to complete',
      });
    }

    // Update job status
    console.log('✅ JobController: Updating job to completed...');
    job.status = 'completed';
    if (notes) job.notes = notes;
    await job.save();

    // Add earnings to worker's wallet
    console.log('✅ JobController: Adding earnings to worker wallet', {
      workerId,
      amount: job.budget,
    });
    await User.findByIdAndUpdate(workerId, {
      $inc: { 'wallet.pending': job.budget },
    });

    console.log('✅ JobController: Job completed successfully', {
      jobId: job._id,
      workerId,
      jobTitle: job.title,
      earnedAmount: job.budget,
    });

    res.status(200).json({
      success: true,
      message: 'Job completed successfully',
      data: job,
    });
  } catch (error) {
    console.error('❌ JobController: Error completing job', {
      jobId: req.params.id,
      workerId: req.user.id,
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Accept Job (Worker only) - Direct acceptance without employer approval
exports.acceptJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    if (!ensureValidJobId(jobId, res)) return;
    const workerId = req.user.id;
    const userRole = req.user.role;

    console.log('👷 JobController: acceptJob called', {
      jobId,
      workerId,
      userRole,
    });

    const job = await Job.findById(jobId);

    if (!job) {
      console.error('❌ JobController: Job not found', { jobId });
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    if (userRole !== 'worker') {
      console.error('❌ JobController: User is not a worker', { userRole });
      return res.status(403).json({
        success: false,
        message: 'Only workers can accept jobs',
      });
    }

    // Check if job is still pending
    if (job.status !== 'pending') {
      console.error('❌ JobController: Job is not pending', { jobId, status: job.status });
      return res.status(400).json({
        success: false,
        message: 'This job is no longer available',
      });
    }

    // Check if worker already has an accepted application for this job
    console.log('👷 JobController: Checking for existing application...');
    const existingApplication = await Application.findOne({
      job: jobId,
      worker: workerId,
    });

    if (existingApplication) {
      console.error('❌ JobController: Worker already applied', { jobId, workerId });
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this job',
      });
    }

    // Create application with accepted status for direct acceptance
    console.log('👷 JobController: Creating application...');
    const application = await Application.create({
      job: jobId,
      worker: workerId,
      status: 'accepted',
    });

    // Update job status to in_progress
    console.log('👷 JobController: Updating job status to in_progress...');
    job.status = 'in_progress';
    job.assignedWorker = workerId;
    await job.save();

    console.log('✅ JobController: Job accepted successfully', {
      jobId: job._id,
      workerId,
      jobTitle: job.title,
      newStatus: job.status,
    });

    res.status(200).json({
      success: true,
      message: 'Job accepted successfully',
      data: job,
    });
  } catch (error) {
    console.error('❌ JobController: Error accepting job', {
      jobId: req.params.id,
      workerId: req.user.id,
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

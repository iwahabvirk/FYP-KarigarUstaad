const Application = require('../models/Application');
const Job = require('../models/Job');

// Apply to Job (Worker)
exports.applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    if (job.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'This job is no longer active',
      });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      worker: req.user.id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this job',
      });
    }

    const application = await Application.create({
      job: jobId,
      worker: req.user.id,
      coverLetter: coverLetter || '',
    });

    await Job.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1 } });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get My Applications (Worker)
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ worker: req.user.id })
      .populate({
        path: 'job',
        select: 'title description budget category employer',
        populate: { path: 'employer', select: 'name email rating' },
      })
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

// Update Application Status (Employer)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, rejectionReason } = req.body;

    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be pending, accepted, or rejected',
      });
    }

    const application = await Application.findById(applicationId).populate('job');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    if (application.job.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application',
      });
    }

    application.status = status;
    if (status === 'rejected' && rejectionReason) {
      application.rejectionReason = rejectionReason;
    }

    await application.save();

    if (status === 'accepted') {
      const job = await Job.findById(application.job._id);
      if (job) {
        job.status = 'accepted';
        await job.save();
        await Application.updateMany(
          { job: job._id, _id: { $ne: application._id }, status: 'pending' },
          { status: 'rejected' },
        );
      }
    }

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Application
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId)
      .populate('job')
      .populate('worker', 'name email skills rating');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Withdraw Application (Worker)
exports.withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    if (application.worker.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to withdraw this application',
      });
    }

    await Application.findByIdAndDelete(req.params.applicationId);
    await Job.findByIdAndUpdate(application.job, { $inc: { applicationCount: -1 } });

    res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

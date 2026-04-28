const InHouseStaff = require('../models/InHouseStaff');

// Get all in-house staff
exports.getAllStaff = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};

    if (category) {
      query.category = category.toLowerCase();
    }

    const staff = await InHouseStaff.find(query).sort({ rating: -1 });
    
    res.status(200).json({
      success: true,
      count: staff.length,
      data: staff,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Book in-house staff
exports.bookStaff = async (req, res) => {
  try {
    const { staffId, jobDetails } = req.body;
    const userId = req.user.id;

    // Find the staff member
    const staff = await InHouseStaff.findById(staffId);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found',
      });
    }

    // Create a job with type 'direct' and workerType 'inhouse'
    const Job = require('../models/Job');
    const job = await Job.create({
      title: jobDetails.title,
      description: jobDetails.description,
      budget: jobDetails.budget,
      location: jobDetails.location,
      category: staff.category,
      employer: userId,
      assignedWorker: null, // Will be assigned when accepted
      status: 'pending',
      type: 'direct',
      workerType: 'inhouse',
      requiredSkills: staff.skills,
    });

    res.status(201).json({
      success: true,
      message: 'Staff booking request created successfully',
      data: {
        job,
        staff,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
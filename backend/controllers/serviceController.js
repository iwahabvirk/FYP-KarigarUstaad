const mongoose = require('mongoose');
const Service = require('../models/Service');
const Job = require('../models/Job');
const User = require('../models/User');
const Application = require('../models/Application');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.createService = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;

    if (!title || !description || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and price',
      });
    }

    const parsedPrice = Number(price);
    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a valid number greater than 0',
      });
    }

    // Normalize and validate category
    const normalizedCategory = category?.toLowerCase().trim();
    const validCategories = ['plumbing','electrical','painting','cleaning','carpentry'];
    if (!validCategories.includes(normalizedCategory)) {
      console.error('❌ ServiceController: Invalid category', { category, normalizedCategory });
      return res.status(400).json({
        success: false,
        message: 'Invalid category provided',
      });
    }

    const service = await Service.create({
      title: title.trim(),
      description: description.trim(),
      price: parsedPrice,
      category: normalizedCategory,
      worker: req.user.id,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllServices = async (req, res) => {
  try {
    const filter = { isActive: true };

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.workerId && isValidObjectId(req.query.workerId)) {
      filter.worker = req.query.workerId;
    }

    const services = await Service.find(filter)
      .populate('worker', 'name email rating skills location')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ worker: req.user.id })
      .sort('-createdAt')
      .populate('worker', 'name email rating');

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service ID',
      });
    }

    const service = await Service.findById(req.params.id).populate(
      'worker',
      'name email rating skills location'
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.hireService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const { location } = req.body;

    if (!isValidObjectId(serviceId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service ID',
      });
    }

    const service = await Service.findById(serviceId).populate('worker', 'id location');

    if (!service || !service.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Service not found or unavailable',
      });
    }

    const customer = await User.findById(req.user.id).select('location');

    const job = await Job.create({
      title: service.title,
      description: service.description,
      budget: service.price,
      location: (location || customer?.location || 'Not specified').trim(),
      category: service.category || 'Other',
      requiredSkills: [service.category || 'Other'],
      employer: req.user.id,
      assignedWorker: service.worker._id,
      status: 'accepted',
    });

    await Application.create({
      job: job._id,
      worker: service.worker._id,
      status: 'accepted',
      coverLetter: 'Hired directly from service listing',
    });

    res.status(201).json({
      success: true,
      message: 'Service hired successfully',
      data: {
        job,
        service,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

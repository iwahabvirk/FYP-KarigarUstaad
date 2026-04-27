const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a job title'],
      trim: true,
      maxlength: [200, 'Job title cannot be more than 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a job description'],
      maxlength: [5000, 'Description cannot be more than 5000 characters'],
    },
    budget: {
      type: Number,
      required: [true, 'Please provide a budget'],
      min: 0,
    },
    location: {
      type: String,
      trim: true,
      required: [true, 'Please provide a location'],
    },
    category: {
      type: String,
      enum: ['Plumbing', 'Electrical', 'Painting', 'Carpentry', 'Cleaning', 'Installation', 'Repair', 'Other'],
      required: [true, 'Please provide a category'],
      default: 'Other',
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedWorker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'arrived', 'completed', 'paid', 'cancelled'],
      default: 'pending',
    },
    requiredSkills: [
      {
        type: String,
      },
    ],
    applicationCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

module.exports = mongoose.model('Job', jobSchema);

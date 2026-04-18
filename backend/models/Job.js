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
      enum: ['Electrician', 'Plumber', 'Painter', 'AC Technician', 'Carpenter', 'Carpentry', 'Tiling', 'Installation', 'Other'],
      required: [true, 'Please provide a category'],
      default: 'Other',
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'in_progress', 'completed', 'paid'],
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

const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a service title'],
      trim: true,
      maxlength: [200, 'Service title cannot be more than 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a service description'],
      trim: true,
      maxlength: [3000, 'Description cannot be more than 3000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a service price'],
      min: 1,
    },
    category: {
      type: String,
      enum: ['Plumbing', 'Electrical', 'Painting', 'Carpentry', 'Cleaning', 'Installation', 'Repair', 'Other'],
      default: 'Other',
    },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
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

module.exports = mongoose.model('Service', serviceSchema);

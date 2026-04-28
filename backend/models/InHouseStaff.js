const mongoose = require('mongoose');

const inHouseStaffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    skills: [
      {
        type: String,
        required: true,
      },
    ],
    category: {
      type: String,
      enum: ['plumbing','electrical','painting','cleaning','carpentry','other'],
      required: [true, 'Please provide a category'],
      lowercase: true,
      trim: true,
    },
    hourlyRate: {
      type: Number,
      required: [true, 'Please provide hourly rate'],
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    location: {
      type: String,
      required: [true, 'Please provide location'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide phone number'],
      trim: true,
    },
    availability: {
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

module.exports = mongoose.model('InHouseStaff', inHouseStaffSchema);
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide service title'],
      trim: true,
      maxlength: [80, 'Title cannot exceed 80 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide service description'],
      trim: true,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=800&q=80',
    },
    startingPrice: {
      type: Number,
      required: [true, 'Please provide starting price'],
      min: [0, 'Price must be positive'],
    },
    duration: {
      type: String,
      default: '2 - 4 Hours',
      trim: true,
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

serviceSchema.index({ slug: 1, active: 1 });

module.exports = mongoose.model('Service', serviceSchema);

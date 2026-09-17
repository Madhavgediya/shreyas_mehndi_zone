const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide package title'],
      trim: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: false,
    },
    serviceName: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Please provide package price'],
      min: [0, 'Price must be positive'],
    },
    priceType: {
      type: String,
      enum: ['Complete Package', 'Per Hand', 'Per Person', 'Hourly', 'Custom'],
      default: 'Complete Package',
    },
    duration: {
      type: String,
      default: '3 - 5 Hours',
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    discount: {
      type: String,
      default: '',
      trim: true,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
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

module.exports = mongoose.model('Pricing', pricingSchema);

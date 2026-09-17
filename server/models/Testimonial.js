const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide reviewer name'],
      trim: true,
    },
    profileImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    rating: {
      type: Number,
      required: [true, 'Please provide rating from 1 to 5'],
      min: 1,
      max: 5,
      default: 5,
    },
    review: {
      type: String,
      required: [true, 'Please provide review text'],
      trim: true,
    },
    eventType: {
      type: String,
      default: 'Bridal Mehndi',
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['Approved', 'Pending', 'Rejected'],
      default: 'Approved',
    },
  },
  {
    timestamps: true,
  }
);

testimonialSchema.index({ status: 1, featured: 1 });

module.exports = mongoose.model('Testimonial', testimonialSchema);

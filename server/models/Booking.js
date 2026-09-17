const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide customer name'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide phone number'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide email address'],
      trim: true,
      lowercase: true,
    },
    eventType: {
      type: String,
      required: [true, 'Please select event type'],
      enum: [
        'Bridal Mehndi',
        'Engagement',
        'Sangeet / Wedding Party',
        'Festival / Karwa Chauth / Eid',
        'Baby Shower (Godh Bharai)',
        'Private / Family Session',
        'Corporate / Event Booking',
        'Other',
      ],
      default: 'Bridal Mehndi',
    },
    eventDate: {
      type: Date,
      required: [true, 'Please select event date'],
    },
    preferredTime: {
      type: String,
      required: [true, 'Please select preferred time slot'],
      default: '10:00 AM - 01:00 PM',
    },
    numberOfPeople: {
      type: Number,
      default: 1,
      min: [1, 'At least 1 person is required'],
    },
    location: {
      type: String,
      required: [true, 'Please provide venue/service location address'],
      trim: true,
    },
    selectedDesign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Design',
      required: false,
    },
    designTitle: {
      type: String,
      default: '',
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: false,
    },
    serviceName: {
      type: String,
      default: '',
    },
    budget: {
      type: String,
      default: '',
      trim: true,
    },
    specialRequirements: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending',
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    adminNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ eventDate: 1, status: 1 });
bookingSchema.index({ email: 1, phone: 1 });

module.exports = mongoose.model('Booking', bookingSchema);

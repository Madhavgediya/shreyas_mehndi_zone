const Testimonial = require('../models/Testimonial');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get approved testimonials for public display
// @route   GET /api/testimonials
// @access  Public
const getApprovedTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ status: 'Approved' }).sort({
      featured: -1,
      createdAt: -1,
    });
    return successResponse(res, testimonials, 'Testimonials fetched successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Submit testimonial from public client
// @route   POST /api/testimonials
// @access  Public
const submitTestimonial = async (req, res, next) => {
  try {
    const { name, rating, review, eventType, profileImage } = req.body;
    if (!name || !review) {
      return errorResponse(res, 'Please provide name and review message', 400);
    }

    const testimonial = await Testimonial.create({
      name,
      rating: rating ? Number(rating) : 5,
      review,
      eventType: eventType || 'Bridal Mehndi',
      profileImage:
        profileImage ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      status: 'Approved', // Auto-approved or set to Pending based on admin preference
    });

    return successResponse(
      res,
      testimonial,
      'Thank you for your warm review! It will be featured on our site.',
      201
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get all testimonials (Admin)
// @route   GET /api/testimonials/all
// @access  Private/Admin
const getAllTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    return successResponse(res, testimonials, 'All testimonials fetched');
  } catch (error) {
    next(error);
  }
};

// @desc    Update testimonial status / featured flag (Admin)
// @route   PUT /api/testimonials/:id
// @access  Private/Admin
const updateTestimonialStatus = async (req, res, next) => {
  try {
    const { status, featured, name, review, rating, eventType } = req.body;
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return errorResponse(res, 'Testimonial not found', 404);
    }

    if (status !== undefined) testimonial.status = status;
    if (featured !== undefined) testimonial.featured = featured;
    if (name !== undefined) testimonial.name = name;
    if (review !== undefined) testimonial.review = review;
    if (rating !== undefined) testimonial.rating = Number(rating);
    if (eventType !== undefined) testimonial.eventType = eventType;

    const updated = await testimonial.save();
    return successResponse(res, updated, 'Testimonial updated');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete testimonial (Admin)
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return errorResponse(res, 'Testimonial not found', 404);
    }

    await Testimonial.findByIdAndDelete(req.params.id);
    return successResponse(res, null, 'Testimonial deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getApprovedTestimonials,
  submitTestimonial,
  getAllTestimonials,
  updateTestimonialStatus,
  deleteTestimonial,
};

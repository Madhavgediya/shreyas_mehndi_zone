const Booking = require('../models/Booking');
const generateBookingId = require('../utils/generateBookingId');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Submit a new booking request
// @route   POST /api/bookings
// @access  Public (or Private if token provided)
const createBooking = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      email,
      eventType,
      eventDate,
      preferredTime,
      numberOfPeople,
      location,
      selectedDesign,
      designTitle,
      service,
      serviceName,
      budget,
      specialRequirements,
    } = req.body;

    if (!name || !phone || !email || !eventDate || !location) {
      return errorResponse(res, 'Please provide all required fields (Name, Phone, Email, Event Date, Location)', 400);
    }

    // Prevent invalid dates in the past
    const selectedDate = new Date(eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return errorResponse(res, 'Event date cannot be in the past', 400);
    }

    const bookingId = generateBookingId();

    const booking = await Booking.create({
      bookingId,
      name,
      phone,
      email,
      eventType: eventType || 'Bridal Mehndi',
      eventDate: selectedDate,
      preferredTime: preferredTime || '10:00 AM - 01:00 PM',
      numberOfPeople: numberOfPeople ? Number(numberOfPeople) : 1,
      location,
      selectedDesign: selectedDesign || null,
      designTitle: designTitle || '',
      service: service || null,
      serviceName: serviceName || '',
      budget: budget || '',
      specialRequirements: specialRequirements || '',
      user: req.user ? req.user._id : null,
      status: 'Pending',
    });

    return successResponse(
      res,
      booking,
      'Booking request submitted successfully! We will contact you shortly.',
      201
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({
      $or: [{ user: req.user._id }, { email: req.user.email }],
    })
      .populate('selectedDesign', 'title images price slug')
      .sort({ createdAt: -1 });

    return successResponse(res, bookings, 'Your bookings retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res, next) => {
  try {
    const { status, search, date, page = 1, limit = 20 } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search && search.trim()) {
      query.$or = [
        { bookingId: { $regex: search.trim(), $options: 'i' } },
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { phone: { $regex: search.trim(), $options: 'i' } },
        { location: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    if (date) {
      const targetDate = new Date(date);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      query.eventDate = { $gte: targetDate, $lt: nextDate };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate('selectedDesign', 'title images price slug')
        .populate('service', 'title startingPrice')
        .sort({ eventDate: 1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Booking.countDocuments(query),
    ]);

    return successResponse(
      res,
      {
        bookings,
        pagination: {
          total,
          page: pageNum,
          pages: Math.ceil(total / limitNum) || 1,
          limit: limitNum,
        },
      },
      'Bookings retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking by ID or bookingId
// @route   GET /api/bookings/:id
// @access  Public (for verification with bookingId) or Private/Admin
const getBookingById = async (req, res, next) => {
  try {
    let booking;
    if (req.params.id.startsWith('MH-')) {
      booking = await Booking.findOne({ bookingId: req.params.id })
        .populate('selectedDesign', 'title images price slug')
        .populate('service', 'title startingPrice');
    } else {
      booking = await Booking.findById(req.params.id)
        .populate('selectedDesign', 'title images price slug')
        .populate('service', 'title startingPrice');
    }

    if (!booking) {
      return errorResponse(res, 'Booking not found', 404);
    }

    return successResponse(res, booking, 'Booking details fetched');
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (Admin)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    if (!['Pending', 'Confirmed', 'Completed', 'Cancelled'].includes(status)) {
      return errorResponse(res, 'Invalid booking status', 400);
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return errorResponse(res, 'Booking not found', 404);
    }

    booking.status = status;
    if (adminNotes !== undefined) {
      booking.adminNotes = adminNotes;
    }

    const updated = await booking.save();
    return successResponse(res, updated, `Booking marked as ${status}`);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete booking (Admin)
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return errorResponse(res, 'Booking not found', 404);
    }

    await Booking.findByIdAndDelete(req.params.id);
    return successResponse(res, null, 'Booking deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
};

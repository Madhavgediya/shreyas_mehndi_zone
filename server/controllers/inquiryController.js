const Inquiry = require('../models/Inquiry');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Submit contact inquiry
// @route   POST /api/inquiries
// @access  Public
const submitInquiry = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !phone || !message) {
      return errorResponse(res, 'Please provide name, email, phone, and message', 400);
    }

    const inquiry = await Inquiry.create({
      name,
      email,
      phone,
      subject: subject || 'General Mehndi Inquiry',
      message,
    });

    return successResponse(
      res,
      inquiry,
      'Thank you for contacting us! Shreya will reach out to you shortly.',
      201
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get all inquiries (Admin)
// @route   GET /api/inquiries
// @access  Private/Admin
const getAllInquiries = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [inquiries, total] = await Promise.all([
      Inquiry.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Inquiry.countDocuments(query),
    ]);

    return successResponse(
      res,
      {
        inquiries,
        pagination: {
          total,
          page: pageNum,
          pages: Math.ceil(total / limitNum) || 1,
          limit: limitNum,
        },
      },
      'Inquiries retrieved'
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Update inquiry status (Admin)
// @route   PUT /api/inquiries/:id/status
// @access  Private/Admin
const updateInquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['New', 'In Progress', 'Resolved'].includes(status)) {
      return errorResponse(res, 'Invalid inquiry status', 400);
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!inquiry) {
      return errorResponse(res, 'Inquiry not found', 404);
    }

    return successResponse(res, inquiry, `Inquiry updated to ${status}`);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete inquiry (Admin)
// @route   DELETE /api/inquiries/:id
// @access  Private/Admin
const deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return errorResponse(res, 'Inquiry not found', 404);
    }

    await Inquiry.findByIdAndDelete(req.params.id);
    return successResponse(res, null, 'Inquiry deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitInquiry,
  getAllInquiries,
  updateInquiryStatus,
  deleteInquiry,
};

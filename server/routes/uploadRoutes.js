const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadToStorage } = require('../config/cloudinary');
const { protect, adminOnly } = require('../middleware/auth');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Upload image or transparent overlay (Cloudinary or local fallback)
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, adminOnly, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'Please provide an image file to upload', 400);
    }

    const folder = req.body.folder || 'designs';
    const originalName = req.file.originalname || 'image';

    const result = await uploadToStorage(req.file.buffer, folder, originalName);

    return successResponse(
      res,
      result,
      'Image uploaded successfully',
      201
    );
  } catch (error) {
    next(error);
  }
});

module.exports = router;

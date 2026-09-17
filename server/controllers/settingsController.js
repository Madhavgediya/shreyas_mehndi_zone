const SiteSettings = require('../models/SiteSettings');
const { successResponse } = require('../utils/apiResponse');

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
const getSiteSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    return successResponse(res, settings, 'Settings fetched successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSiteSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings();
    }

    const fields = [
      'businessName',
      'tagline',
      'artistName',
      'artistBio',
      'phone',
      'whatsappNumber',
      'email',
      'address',
      'businessHours',
      'instagramUrl',
      'facebookUrl',
      'youtubeUrl',
      'heroTitle',
      'heroSubtitle',
      'aboutText',
      'footerText',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        settings[field] = req.body[field];
      }
    });

    const updated = await settings.save();
    return successResponse(res, updated, 'Site settings updated successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSiteSettings,
  updateSiteSettings,
};

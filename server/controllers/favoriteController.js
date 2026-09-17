const Favorite = require('../models/Favorite');
const Design = require('../models/Design');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Toggle favorite on a design
// @route   POST /api/favorites/toggle
// @access  Public (guestId) or Private (auth user)
const toggleFavorite = async (req, res, next) => {
  try {
    const { designId, guestId } = req.body;
    if (!designId) {
      return errorResponse(res, 'Design ID is required', 400);
    }

    const design = await Design.findById(designId);
    if (!design) {
      return errorResponse(res, 'Design not found', 404);
    }

    let isFavorite = false;

    if (req.user) {
      // Logged in user
      const existing = await Favorite.findOne({
        user: req.user._id,
        design: designId,
      });

      if (existing) {
        await Favorite.findByIdAndDelete(existing._id);
        await User.findByIdAndUpdate(req.user._id, {
          $pull: { favorites: designId },
        });
        await Design.findByIdAndUpdate(designId, {
          $inc: { likesCount: -1 },
        });
        isFavorite = false;
      } else {
        await Favorite.create({
          user: req.user._id,
          design: designId,
        });
        await User.findByIdAndUpdate(req.user._id, {
          $addToSet: { favorites: designId },
        });
        await Design.findByIdAndUpdate(designId, {
          $inc: { likesCount: 1 },
        });
        isFavorite = true;
      }
    } else if (guestId) {
      // Guest user with UUID
      const existing = await Favorite.findOne({
        guestId,
        design: designId,
      });

      if (existing) {
        await Favorite.findByIdAndDelete(existing._id);
        await Design.findByIdAndUpdate(designId, {
          $inc: { likesCount: -1 },
        });
        isFavorite = false;
      } else {
        await Favorite.create({
          guestId,
          design: designId,
        });
        await Design.findByIdAndUpdate(designId, {
          $inc: { likesCount: 1 },
        });
        isFavorite = true;
      }
    } else {
      return errorResponse(res, 'Must be logged in or supply guestId to favorite', 400);
    }

    const updatedDesign = await Design.findById(designId).select('likesCount');
    return successResponse(
      res,
      {
        isFavorite,
        likesCount: Math.max(0, updatedDesign.likesCount),
      },
      isFavorite ? 'Added to favorites' : 'Removed from favorites'
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's favorites
// @route   GET /api/favorites
// @access  Public (with guestId query or auth token)
const getMyFavorites = async (req, res, next) => {
  try {
    const { guestId } = req.query;
    let query = null;

    if (req.user) {
      query = { user: req.user._id };
    } else if (guestId) {
      query = { guestId };
    } else {
      return successResponse(res, [], 'No favorites');
    }

    const favorites = await Favorite.find(query)
      .populate({
        path: 'design',
        populate: { path: 'category', select: 'name slug' },
      })
      .sort({ createdAt: -1 });

    const validDesigns = favorites
      .filter((fav) => fav.design && fav.design.published)
      .map((fav) => fav.design);

    return successResponse(res, validDesigns, 'Favorites retrieved');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  toggleFavorite,
  getMyFavorites,
};

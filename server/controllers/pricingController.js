const Pricing = require('../models/Pricing');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get all pricing packages
// @route   GET /api/pricing
// @access  Public
const getPricing = async (req, res, next) => {
  try {
    const filter = req.query.all === 'true' ? {} : { active: true };
    const pricing = await Pricing.find(filter)
      .populate('service', 'title slug startingPrice')
      .sort({ order: 1, price: 1 });

    return successResponse(res, pricing, 'Pricing fetched successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Create pricing package (Admin)
// @route   POST /api/pricing
// @access  Private/Admin
const createPricing = async (req, res, next) => {
  try {
    const { title, service, serviceName, price, priceType, duration, features, discount, isPopular, active, order } =
      req.body;

    if (!title || !price) {
      return errorResponse(res, 'Please provide package title and price', 400);
    }

    const formattedFeatures = Array.isArray(features)
      ? features
      : typeof features === 'string'
      ? features.split(',').map((f) => f.trim()).filter(Boolean)
      : [];

    const packageItem = await Pricing.create({
      title,
      service: service || null,
      serviceName: serviceName || '',
      price: Number(price),
      priceType: priceType || 'Complete Package',
      duration: duration || '3 - 5 Hours',
      features: formattedFeatures,
      discount: discount || '',
      isPopular: isPopular || false,
      active: active !== undefined ? active : true,
      order: order || 0,
    });

    return successResponse(res, packageItem, 'Pricing package created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update pricing package (Admin)
// @route   PUT /api/pricing/:id
// @access  Private/Admin
const updatePricing = async (req, res, next) => {
  try {
    const packageItem = await Pricing.findById(req.params.id);
    if (!packageItem) {
      return errorResponse(res, 'Pricing package not found', 404);
    }

    const { title, service, serviceName, price, priceType, duration, features, discount, isPopular, active, order } =
      req.body;

    if (title !== undefined) packageItem.title = title;
    if (service !== undefined) packageItem.service = service || null;
    if (serviceName !== undefined) packageItem.serviceName = serviceName;
    if (price !== undefined) packageItem.price = Number(price);
    if (priceType !== undefined) packageItem.priceType = priceType;
    if (duration !== undefined) packageItem.duration = duration;
    if (features !== undefined) {
      packageItem.features = Array.isArray(features)
        ? features
        : features.split(',').map((f) => f.trim()).filter(Boolean);
    }
    if (discount !== undefined) packageItem.discount = discount;
    if (isPopular !== undefined) packageItem.isPopular = isPopular;
    if (active !== undefined) packageItem.active = active;
    if (order !== undefined) packageItem.order = order;

    const updated = await packageItem.save();
    return successResponse(res, updated, 'Pricing package updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete pricing package (Admin)
// @route   DELETE /api/pricing/:id
// @access  Private/Admin
const deletePricing = async (req, res, next) => {
  try {
    const packageItem = await Pricing.findById(req.params.id);
    if (!packageItem) {
      return errorResponse(res, 'Pricing package not found', 404);
    }

    await Pricing.findByIdAndDelete(req.params.id);
    return successResponse(res, null, 'Pricing package deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPricing,
  createPricing,
  updatePricing,
  deletePricing,
};

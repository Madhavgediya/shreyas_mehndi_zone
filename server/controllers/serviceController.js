const Service = require('../models/Service');
const createSlug = require('../utils/slugify');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get all active services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res, next) => {
  try {
    const filter = req.query.all === 'true' ? {} : { active: true };
    const services = await Service.find(filter).sort({ order: 1, createdAt: 1 });
    return successResponse(res, services, 'Services fetched successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get service by slug
// @route   GET /api/services/:slug
// @access  Public
const getServiceBySlug = async (req, res, next) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug });
    if (!service) {
      return errorResponse(res, 'Service not found', 404);
    }
    return successResponse(res, service, 'Service fetched successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Create service (Admin)
// @route   POST /api/services
// @access  Private/Admin
const createService = async (req, res, next) => {
  try {
    const { title, description, image, startingPrice, duration, features, active, order } =
      req.body;

    if (!title || !description || !startingPrice) {
      return errorResponse(res, 'Please provide title, description, and starting price', 400);
    }

    const slug = createSlug(title);
    const existing = await Service.findOne({ slug });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const formattedFeatures = Array.isArray(features)
      ? features
      : typeof features === 'string'
      ? features.split(',').map((f) => f.trim()).filter(Boolean)
      : [];

    const service = await Service.create({
      title,
      slug: finalSlug,
      description,
      image: image || 'https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=800&q=80',
      startingPrice: Number(startingPrice),
      duration: duration || '2 - 4 Hours',
      features: formattedFeatures,
      active: active !== undefined ? active : true,
      order: order || 0,
    });

    return successResponse(res, service, 'Service created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update service (Admin)
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return errorResponse(res, 'Service not found', 404);
    }

    const { title, description, image, startingPrice, duration, features, active, order } =
      req.body;

    if (title && title !== service.title) {
      service.title = title;
      const slug = createSlug(title);
      const existing = await Service.findOne({ slug, _id: { $ne: service._id } });
      service.slug = existing ? `${slug}-${Date.now()}` : slug;
    }

    if (description !== undefined) service.description = description;
    if (image !== undefined) service.image = image;
    if (startingPrice !== undefined) service.startingPrice = Number(startingPrice);
    if (duration !== undefined) service.duration = duration;
    if (features !== undefined) {
      service.features = Array.isArray(features)
        ? features
        : features.split(',').map((f) => f.trim()).filter(Boolean);
    }
    if (active !== undefined) service.active = active;
    if (order !== undefined) service.order = order;

    const updated = await service.save();
    return successResponse(res, updated, 'Service updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete service (Admin)
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return errorResponse(res, 'Service not found', 404);
    }

    await Service.findByIdAndDelete(req.params.id);
    return successResponse(res, null, 'Service deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
};

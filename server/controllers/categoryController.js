const Category = require('../models/Category');
const Design = require('../models/Design');
const createSlug = require('../utils/slugify');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get all active categories (public)
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const filter = req.query.all === 'true' ? {} : { active: true };
    const categories = await Category.find(filter).sort({ order: 1, createdAt: -1 });

    // Aggregate design counts for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Design.countDocuments({
          category: cat._id,
          published: true,
        });
        return {
          ...cat.toObject(),
          designCount: count,
        };
      })
    );

    return successResponse(res, categoriesWithCount, 'Categories fetched successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get category by slug
// @route   GET /api/categories/:slug
// @access  Public
const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return errorResponse(res, 'Category not found', 404);
    }
    const designs = await Design.find({ category: category._id, published: true }).sort({
      createdAt: -1,
    });
    return successResponse(
      res,
      {
        category,
        designs,
      },
      'Category details fetched successfully'
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res, next) => {
  try {
    const { name, description, image, featured, active, order } = req.body;
    if (!name) {
      return errorResponse(res, 'Category name is required', 400);
    }

    const slug = createSlug(name);
    const existing = await Category.findOne({ slug });
    if (existing) {
      return errorResponse(res, 'A category with this name already exists', 400);
    }

    const category = await Category.create({
      name,
      slug,
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80',
      featured: featured || false,
      active: active !== undefined ? active : true,
      order: order || 0,
    });

    return successResponse(res, category, 'Category created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res, next) => {
  try {
    const { name, description, image, featured, active, order } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) {
      return errorResponse(res, 'Category not found', 404);
    }

    if (name && name !== category.name) {
      category.name = name;
      category.slug = createSlug(name);
    }
    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (featured !== undefined) category.featured = featured;
    if (active !== undefined) category.active = active;
    if (order !== undefined) category.order = order;

    const updated = await category.save();
    return successResponse(res, updated, 'Category updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return errorResponse(res, 'Category not found', 404);
    }

    // Check if designs exist under category
    const count = await Design.countDocuments({ category: category._id });
    if (count > 0) {
      return errorResponse(
        res,
        `Cannot delete category. ${count} design(s) are currently associated with it.`,
        400
      );
    }

    await Category.findByIdAndDelete(req.params.id);
    return successResponse(res, null, 'Category deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};

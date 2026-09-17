const Design = require('../models/Design');
const Category = require('../models/Category');
const ShareAnalytics = require('../models/ShareAnalytics');
const createSlug = require('../utils/slugify');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get all designs with filters, search, pagination
// @route   GET /api/designs
// @access  Public
const getDesigns = async (req, res, next) => {
  try {
    const {
      search,
      category,
      difficulty,
      featured,
      sort,
      page = 1,
      limit = 12,
      tag,
      all,
    } = req.query;

    const query = all === 'true' ? {} : { published: true };

    // Search filter
    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { tags: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Category filter (supports either ObjectId or Category slug)
    if (category && category !== 'all') {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const foundCategory = await Category.findOne({ slug: category });
        if (foundCategory) {
          query.category = foundCategory._id;
        }
      }
    }

    // Difficulty filter
    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty;
    }

    // Tag filter
    if (tag) {
      query.tags = tag;
    }

    // Featured filter
    if (featured === 'true') {
      query.featured = true;
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === 'popular') {
      sortOptions = { likesCount: -1, viewsCount: -1 };
    } else if (sort === 'views') {
      sortOptions = { viewsCount: -1 };
    } else if (sort === 'price-asc') {
      sortOptions = { price: 1 };
    } else if (sort === 'price-desc') {
      sortOptions = { price: -1 };
    } else if (sort === 'title') {
      sortOptions = { title: 1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const [designs, total] = await Promise.all([
      Design.find(query)
        .populate('category', 'name slug image')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum),
      Design.countDocuments(query),
    ]);

    return successResponse(
      res,
      {
        designs,
        pagination: {
          total,
          page: pageNum,
          pages: Math.ceil(total / limitNum) || 1,
          limit: limitNum,
        },
      },
      'Designs fetched successfully'
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured designs
// @route   GET /api/designs/featured
// @access  Public
const getFeaturedDesigns = async (req, res, next) => {
  try {
    const designs = await Design.find({ published: true, featured: true })
      .populate('category', 'name slug')
      .sort({ likesCount: -1, createdAt: -1 })
      .limit(8);

    return successResponse(res, designs, 'Featured designs fetched successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get design by slug
// @route   GET /api/designs/:slug
// @access  Public
const getDesignBySlug = async (req, res, next) => {
  try {
    const design = await Design.findOne({ slug: req.params.slug }).populate(
      'category',
      'name slug'
    );

    if (!design) {
      return errorResponse(res, 'Design not found', 404);
    }

    // Increment view count asynchronously
    await Design.findByIdAndUpdate(design._id, { $inc: { viewsCount: 1 } });

    // Fetch related designs in the same category
    const relatedDesigns = await Design.find({
      category: design.category._id,
      _id: { $ne: design._id },
      published: true,
    })
      .populate('category', 'name slug')
      .limit(4);

    return successResponse(
      res,
      {
        design,
        relatedDesigns,
      },
      'Design details fetched successfully'
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Record share & increment share count
// @route   POST /api/designs/:id/share
// @access  Public
const recordShare = async (req, res, next) => {
  try {
    const { platform = 'CopyLink' } = req.body;
    const design = await Design.findById(req.params.id);
    if (!design) {
      return errorResponse(res, 'Design not found', 404);
    }

    design.sharesCount += 1;
    await design.save();

    await ShareAnalytics.create({
      design: design._id,
      platform,
      ipHash: req.ip || '',
    });

    return successResponse(res, { sharesCount: design.sharesCount }, 'Share recorded');
  } catch (error) {
    next(error);
  }
};

// @desc    Create design (Admin)
// @route   POST /api/designs
// @access  Private/Admin
const createDesign = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      tags,
      images,
      overlayImage,
      price,
      estimatedTime,
      difficulty,
      featured,
      published,
    } = req.body;

    if (!title || !description || !category || !price) {
      return errorResponse(res, 'Please provide title, description, category, and price', 400);
    }

    const slug = createSlug(title);
    const existing = await Design.findOne({ slug });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const formattedTags = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const formattedImages = Array.isArray(images) && images.length > 0
      ? images
      : ['https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80'];

    const design = await Design.create({
      title,
      slug: finalSlug,
      description,
      category,
      tags: formattedTags,
      images: formattedImages,
      overlayImage: overlayImage || '',
      price: Number(price),
      estimatedTime: estimatedTime || '2 - 3 Hours',
      difficulty: difficulty || 'Intermediate',
      featured: featured || false,
      published: published !== undefined ? published : true,
    });

    const populated = await Design.findById(design._id).populate('category', 'name slug');
    return successResponse(res, populated, 'Design created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update design (Admin)
// @route   PUT /api/designs/:id
// @access  Private/Admin
const updateDesign = async (req, res, next) => {
  try {
    const design = await Design.findById(req.params.id);
    if (!design) {
      return errorResponse(res, 'Design not found', 404);
    }

    const {
      title,
      description,
      category,
      tags,
      images,
      overlayImage,
      price,
      estimatedTime,
      difficulty,
      featured,
      published,
    } = req.body;

    if (title && title !== design.title) {
      design.title = title;
      const slug = createSlug(title);
      const existing = await Design.findOne({ slug, _id: { $ne: design._id } });
      design.slug = existing ? `${slug}-${Date.now()}` : slug;
    }

    if (description !== undefined) design.description = description;
    if (category !== undefined) design.category = category;
    if (tags !== undefined) {
      design.tags = Array.isArray(tags)
        ? tags
        : tags.split(',').map((t) => t.trim()).filter(Boolean);
    }
    if (images !== undefined) design.images = images;
    if (overlayImage !== undefined) design.overlayImage = overlayImage;
    if (price !== undefined) design.price = Number(price);
    if (estimatedTime !== undefined) design.estimatedTime = estimatedTime;
    if (difficulty !== undefined) design.difficulty = difficulty;
    if (featured !== undefined) design.featured = featured;
    if (published !== undefined) design.published = published;

    const updated = await design.save();
    const populated = await Design.findById(updated._id).populate('category', 'name slug');

    return successResponse(res, populated, 'Design updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete design (Admin)
// @route   DELETE /api/designs/:id
// @access  Private/Admin
const deleteDesign = async (req, res, next) => {
  try {
    const design = await Design.findById(req.params.id);
    if (!design) {
      return errorResponse(res, 'Design not found', 404);
    }

    await Design.findByIdAndDelete(req.params.id);
    return successResponse(res, null, 'Design deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDesigns,
  getFeaturedDesigns,
  getDesignBySlug,
  recordShare,
  createDesign,
  updateDesign,
  deleteDesign,
};

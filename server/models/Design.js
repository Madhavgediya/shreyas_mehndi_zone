const mongoose = require('mongoose');

const designSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide design title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide design description'],
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please select a category'],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    images: {
      type: [String],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'At least one design image is required',
      },
    },
    overlayImage: {
      type: String,
      default: '',
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please provide estimated price/starting price'],
      min: [0, 'Price must be positive'],
    },
    estimatedTime: {
      type: String,
      default: '2 - 3 Hours',
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Intermediate', 'Intricate', 'Master Bridal'],
      default: 'Intermediate',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: true,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    sharesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

designSchema.index({ title: 'text', description: 'text', tags: 'text' });
designSchema.index({ slug: 1, published: 1 });
designSchema.index({ category: 1, published: 1 });
designSchema.index({ featured: 1, published: 1 });

module.exports = mongoose.model('Design', designSchema);

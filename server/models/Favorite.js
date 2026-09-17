const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    guestId: {
      type: String,
      required: false,
      trim: true,
    },
    design: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Design',
      required: [true, 'Design reference is required'],
    },
  },
  {
    timestamps: true,
  }
);

favoriteSchema.index({ user: 1, design: 1 }, { unique: true, sparse: true });
favoriteSchema.index({ guestId: 1, design: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Favorite', favoriteSchema);

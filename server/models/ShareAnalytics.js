const mongoose = require('mongoose');

const shareAnalyticsSchema = new mongoose.Schema(
  {
    design: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Design',
      required: true,
      index: true,
    },
    platform: {
      type: String,
      enum: ['WhatsApp', 'Facebook', 'CopyLink', 'NativeShare', 'Other'],
      default: 'CopyLink',
    },
    ipHash: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

shareAnalyticsSchema.index({ design: 1, platform: 1, createdAt: -1 });

module.exports = mongoose.model('ShareAnalytics', shareAnalyticsSchema);

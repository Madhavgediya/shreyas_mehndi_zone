const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      default: "Shreya's Mehndi Zone",
      trim: true,
    },
    tagline: {
      type: String,
      default: 'Crafting Timeless Henna Art & Bridal Elegance',
      trim: true,
    },
    artistName: {
      type: String,
      default: 'Shreya Gediya',
      trim: true,
    },
    artistBio: {
      type: String,
      default:
        'Award-winning professional bridal Mehndi artist with over 8 years of passion, crafting bespoke intricate designs for weddings, engagements, and special celebrations across the nation.',
    },
    phone: {
      type: String,
      default: '+91 98765 43210',
      trim: true,
    },
    whatsappNumber: {
      type: String,
      default: '+919876543210',
      trim: true,
    },
    email: {
      type: String,
      default: 'hello@shreyasmehndizone.com',
      trim: true,
    },
    address: {
      type: String,
      default: 'Heritage Mehndi Studio, Ring Road, Surat, Gujarat 395007',
      trim: true,
    },
    businessHours: {
      type: String,
      default: 'Mon - Sun: 09:00 AM - 08:30 PM (By Appointment)',
      trim: true,
    },
    instagramUrl: {
      type: String,
      default: 'https://instagram.com/shreyasmehndizone',
      trim: true,
    },
    facebookUrl: {
      type: String,
      default: 'https://facebook.com/shreyasmehndizone',
      trim: true,
    },
    youtubeUrl: {
      type: String,
      default: 'https://youtube.com/@shreyasmehndizone',
      trim: true,
    },
    heroTitle: {
      type: String,
      default: 'Beautiful Mehndi, Crafted With Love',
      trim: true,
    },
    heroSubtitle: {
      type: String,
      default:
        'Elegant bridal, festive and traditional Mehndi designs created specially for your unforgettable moments.',
      trim: true,
    },
    aboutText: {
      type: String,
      default:
        'At Shreya\'s Mehndi Zone, we believe every stroke of henna tells a unique story of joy, heritage, and timeless celebration. We combine organic henna formulations with immaculate symmetry, modern flair, and cherished traditional Indian motifs.',
    },
    footerText: {
      type: String,
      default: '© 2026 Shreya\'s Mehndi Zone. All Rights Reserved. Crafted with passion & elegance.',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);

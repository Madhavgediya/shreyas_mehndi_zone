const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const dns = require('dns');

// Fallback to public DNS servers if local/ISP DNS fails to resolve MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Continue if dns override is unavailable
}

dotenv.config({ path: path.join(__dirname, '..', '.env') });
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const User = require('../models/User');
const Category = require('../models/Category');
const Design = require('../models/Design');
const Service = require('../models/Service');
const Pricing = require('../models/Pricing');
const Booking = require('../models/Booking');
const Testimonial = require('../models/Testimonial');
const Inquiry = require('../models/Inquiry');
const SiteSettings = require('../models/SiteSettings');
const createSlug = require('../utils/slugify');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shreyas_mehndi_zone';
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding!');

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Design.deleteMany({}),
      Service.deleteMany({}),
      Pricing.deleteMany({}),
      Booking.deleteMany({}),
      Testimonial.deleteMany({}),
      Inquiry.deleteMany({}),
      SiteSettings.deleteMany({}),
    ]);
    console.log('Cleared existing data.');

    // 1. Create Admin & Demo Users
    const adminUser = await User.create({
      name: 'Shreya Gediya (Admin)',
      email: 'admin@shreyasmehndizone.com',
      password: 'Admin@12345',
      role: 'ADMIN',
      phone: '+919876543210',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    });

    const demoUser = await User.create({
      name: 'Pooja Patel',
      email: 'pooja@example.com',
      password: 'User@12345',
      role: 'USER',
      phone: '+919822334455',
    });
    console.log('Admin & User accounts created.');

    // 2. Create Categories (10+ Categories)
    const categoryData = [
      {
        name: 'Bridal Mehndi',
        description: 'Lavish, full-hand traditional and royal bridal henna compositions symbolizing love and prosperity.',
        image: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80',
        featured: true,
        order: 1,
      },
      {
        name: 'Arabic Mehndi',
        description: 'Flowing floral vines, bold shaded petals, free-flowing trails, and modern negative space.',
        image: 'https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=800&q=80',
        featured: true,
        order: 2,
      },
      {
        name: 'Indo-Arabic',
        description: 'A harmonious blend of fine Indian checks and motifs filled inside bold Arabic floral contours.',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        featured: true,
        order: 3,
      },
      {
        name: 'Traditional Rajasthani',
        description: 'Authentic royal Marwari motifs, peacock figurines, dhol-shehnai, and intricate jali patterns.',
        image: 'https://images.unsplash.com/photo-1583875762487-5f8f7c718d14?auto=format&fit=crop&w=800&q=80',
        featured: true,
        order: 4,
      },
      {
        name: 'Minimal & Contemporary',
        description: 'Delicate geometric lines, fingertip mandalas, chic wrist cuffs, and subtle elegance.',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
        featured: true,
        order: 5,
      },
      {
        name: 'Modern Mandala',
        description: 'Sacred symmetrical circular mandalas centered on palms with lace cuffs and delicate accents.',
        image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80',
        featured: true,
        order: 6,
      },
      {
        name: 'Engagement Mehndi',
        description: 'Classy medium-coverage designs featuring personalized couple initials and soft romantic vines.',
        image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
        featured: false,
        order: 7,
      },
      {
        name: 'Baby Shower (Godh Bharai)',
        description: 'Sweet celebratory themes with baby cradles, mom-to-be portraits, lotus blossoms, and peacock trails.',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        featured: false,
        order: 8,
      },
      {
        name: 'Festival Special',
        description: 'Quick, striking patterns designed for Diwali, Karwa Chauth, Teej, Raksha Bandhan, and Eid.',
        image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
        featured: true,
        order: 9,
      },
      {
        name: 'Feet & Anklet Mehndi',
        description: 'Royal anklet jali, floral payal borders, and matching bridal feet henna compositions.',
        image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
        featured: false,
        order: 10,
      },
      {
        name: 'Finger & Ring Henna',
        description: 'Trendy micro-details, Bohemian ring chains, and dainty finger leaf bands.',
        image: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=800&q=80',
        featured: false,
        order: 11,
      },
    ];

    const createdCategories = await Promise.all(
      categoryData.map((cat) =>
        Category.create({
          ...cat,
          slug: createSlug(cat.name),
        })
      )
    );
    console.log(`Created ${createdCategories.length} categories.`);

    const catMap = {};
    createdCategories.forEach((c) => {
      catMap[c.name] = c._id;
    });

    // 3. Create 20+ Realistic Mehndi Designs with Try-on Overlays
    const overlayTemplates = [
      '/overlays/mandala-royal.svg',
      '/overlays/arabic-vine.svg',
      '/overlays/bridal-cuff.svg',
      '/overlays/finger-accent.svg',
      '/overlays/classic-floral.svg',
    ];

    const designList = [
      {
        title: 'Royal Maharani Bridal Extravaganza',
        description: 'A masterpiece bridal henna composition featuring portrait motifs of the bride and groom, royal elephants, peacock crests, and exquisite lotus jaal extending up to the elbows.',
        category: catMap['Bridal Mehndi'],
        tags: ['Bridal', 'Royal', 'Portraits', 'Full Hand', 'Elbow Length', 'Intricate'],
        images: [
          'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
        ],
        overlayImage: overlayTemplates[0],
        price: 8500,
        estimatedTime: '5 - 6 Hours',
        difficulty: 'Master Bridal',
        featured: true,
        likesCount: 284,
        viewsCount: 1420,
        sharesCount: 96,
      },
      {
        title: 'Cascade Arabic Rose & Shaded Leaf',
        description: 'Bespoke flowing Arabic design with bold contoured blooming roses, negative fill spaces, and delicate wrist bracelets connecting diagonally across the palm to the index finger.',
        category: catMap['Arabic Mehndi'],
        tags: ['Arabic', 'Floral', 'Shaded', 'Rose', 'Modern'],
        images: [
          'https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=1000&q=80',
        ],
        overlayImage: overlayTemplates[1],
        price: 2200,
        estimatedTime: '1.5 - 2 Hours',
        difficulty: 'Intermediate',
        featured: true,
        likesCount: 198,
        viewsCount: 950,
        sharesCount: 45,
      },
      {
        title: 'Celestial Mandala With Lace Cuffs',
        description: 'A central multi-tiered mandala radiating from the heart of the palm, complemented by fine French lace wrist cuffs and symmetrical leafy fingertip caps.',
        category: catMap['Modern Mandala'],
        tags: ['Mandala', 'Symmetry', 'Lace', 'Minimal', 'Festive'],
        images: [
          'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80',
        ],
        overlayImage: overlayTemplates[0],
        price: 1800,
        estimatedTime: '1 - 1.5 Hours',
        difficulty: 'Easy',
        featured: true,
        likesCount: 310,
        viewsCount: 1800,
        sharesCount: 112,
      },
      {
        title: 'Heritage Rajasthani Marwari Shehnai',
        description: 'Timeless folk motifs depicting celebration trumpets, kalash, fine checkwork net, and traditional paisley patterns honoring grand Indian wedding heritage.',
        category: catMap['Traditional Rajasthani'],
        tags: ['Rajasthani', 'Traditional', 'Heritage', 'Marwari', 'Jali'],
        images: [
          'https://images.unsplash.com/photo-1583875762487-5f8f7c718d14?auto=format&fit=crop&w=1000&q=80',
        ],
        overlayImage: overlayTemplates[2],
        price: 5500,
        estimatedTime: '3.5 - 4 Hours',
        difficulty: 'Intricate',
        featured: true,
        likesCount: 145,
        viewsCount: 820,
        sharesCount: 38,
      },
      {
        title: 'Indo-Arabic Fusion Flora & Checkers',
        description: 'The richness of traditional Indian geometric netting integrated seamlessly into the bold sweeping rhythm of Dubai-style Arabic petals.',
        category: catMap['Indo-Arabic'],
        tags: ['Indo-Arabic', 'Fusion', 'Checkerboard', 'Flora'],
        images: [
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
        ],
        overlayImage: overlayTemplates[1],
        price: 2800,
        estimatedTime: '2 - 2.5 Hours',
        difficulty: 'Intermediate',
        featured: true,
        likesCount: 167,
        viewsCount: 790,
        sharesCount: 52,
      },
      {
        title: 'Petite Bohemian Finger & Ring Accent',
        description: 'Subtle bohemian ring chains, leafy vines, and delicate knuckles adornment designed for brides who adore minimalism and western ring ceremonies.',
        category: catMap['Finger & Ring Henna'],
        tags: ['Finger Mehndi', 'Rings', 'Boho', 'Minimal', 'Modern'],
        images: [
          'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=1000&q=80',
        ],
        overlayImage: overlayTemplates[3],
        price: 1200,
        estimatedTime: '45 Mins',
        difficulty: 'Easy',
        featured: false,
        likesCount: 220,
        viewsCount: 1100,
        sharesCount: 80,
      },
      {
        title: 'Romantic Proposal Monogram Bridal Mehndi',
        description: 'Featuring hand-drawn initials of the couple embedded inside interlocking floral hearts, surrounded by fairy lights jali pattern.',
        category: catMap['Engagement Mehndi'],
        tags: ['Engagement', 'Monogram', 'Custom Initials', 'Romance'],
        images: [
          'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80',
        ],
        overlayImage: overlayTemplates[2],
        price: 4000,
        estimatedTime: '3 Hours',
        difficulty: 'Intermediate',
        featured: true,
        likesCount: 185,
        viewsCount: 990,
        sharesCount: 64,
      },
      {
        title: 'Royal Payal Anklet & Lotus Feet Henna',
        description: 'Seductive jewelry payal simulation around ankles with lotus bud motifs trailing down to each toe with uniform dark oxidation.',
        category: catMap['Feet & Anklet Mehndi'],
        tags: ['Feet Mehndi', 'Payal', 'Bridal Feet', 'Lotus', 'Anklet'],
        images: [
          'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1000&q=80',
        ],
        overlayImage: overlayTemplates[4],
        price: 3500,
        estimatedTime: '2.5 Hours',
        difficulty: 'Intricate',
        featured: false,
        likesCount: 130,
        viewsCount: 640,
        sharesCount: 29,
      },
      {
        title: 'Karwa Chauth Moon & Sieve Celebration',
        description: 'Captures the auspicious moonlight silhouette, traditional jali border, and delicate paisley garland celebrating Indian festive tradition.',
        category: catMap['Festival Special'],
        tags: ['Karwa Chauth', 'Festive', 'Moon', 'Special', 'Fast'],
        images: [
          'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1000&q=80',
        ],
        overlayImage: overlayTemplates[1],
        price: 1500,
        estimatedTime: '1 Hour',
        difficulty: 'Easy',
        featured: false,
        likesCount: 240,
        viewsCount: 1300,
        sharesCount: 75,
      },
      {
        title: 'Blissful Cradle (Godh Bharai) Motif',
        description: 'Celebrates maternal joy with hand-sketched rocking cradle, baby footprints, blooming lotus blossoms, and blessings in Devanagari script.',
        category: catMap['Baby Shower (Godh Bharai)'],
        tags: ['Baby Shower', 'Godh Bharai', 'Cradle', 'Maternity', 'Joy'],
        images: [
          'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
        ],
        overlayImage: overlayTemplates[2],
        price: 3200,
        estimatedTime: '2 - 2.5 Hours',
        difficulty: 'Intermediate',
        featured: false,
        likesCount: 155,
        viewsCount: 710,
        sharesCount: 42,
      },
      {
        title: 'Sleek Scandinavian Minimalist Henna',
        description: 'Ultra-contemporary geometric line art, spaced dots, and razor-sharp symmetry designed for corporate events and cocktail evenings.',
        category: catMap['Minimal & Contemporary'],
        tags: ['Minimal', 'Contemporary', 'Modern', 'Sleek', 'Cocktail'],
        images: [
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80',
        ],
        overlayImage: overlayTemplates[3],
        price: 1400,
        estimatedTime: '45 Mins',
        difficulty: 'Easy',
        featured: false,
        likesCount: 190,
        viewsCount: 880,
        sharesCount: 61,
      },
      {
        title: 'Regal Peacock Crest Bridal Splendor',
        description: 'Majestic dancing peacocks in full feather plumage intertwined with rich shaded rose garlands covering both palms, wrists, and mid-arms.',
        category: catMap['Bridal Mehndi'],
        tags: ['Bridal', 'Peacock', 'Crest', 'Full Hand', 'Elbow'],
        images: [
          'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=1000&q=80',
        ],
        overlayImage: overlayTemplates[0],
        price: 7800,
        estimatedTime: '5 Hours',
        difficulty: 'Master Bridal',
        featured: true,
        likesCount: 260,
        viewsCount: 1250,
        sharesCount: 90,
      },
      {
        title: 'Dubai Gulf Royal Shaded Henna',
        description: 'Broad leaf structures filled with gradient stain shading, deep brown contours, and sparkling negative space characteristic of modern Gulf design.',
        category: catMap['Arabic Mehndi'],
        tags: ['Arabic', 'Gulf', 'Dubai', 'Shaded', 'Broad'],
        images: [
          'https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=1000&q=80',
        ],
        overlayImage: overlayTemplates[1],
        price: 2400,
        estimatedTime: '2 Hours',
        difficulty: 'Intermediate',
        featured: false,
        likesCount: 175,
        viewsCount: 810,
        sharesCount: 48,
      },
      {
        title: 'Ornate Moroccan Geometric Lattice',
        description: 'Distinctive North African tribal geometry, chevron bands, diamond lattices, and rhythmic dot clusters for a truly unique aesthetic.',
        category: catMap['Minimal & Contemporary'],
        tags: ['Moroccan', 'Geometric', 'Tribal', 'Lattice'],
        images: [
          'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80',
        ],
        overlayImage: overlayTemplates[3],
        price: 2000,
        estimatedTime: '1.5 Hours',
        difficulty: 'Intermediate',
        featured: false,
        likesCount: 140,
        viewsCount: 670,
        sharesCount: 33,
      },
      {
        title: 'Imperial Jaal & Paisley Bridal Symphony',
        description: 'Full density symmetrical jaal weaving with microscopic paisley fillings, katori bells, and customized wedding date embroidery effect.',
        category: catMap['Bridal Mehndi'],
        tags: ['Bridal', 'Jaal', 'Paisley', 'Intricate', 'Full Arms'],
        images: [
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
        ],
        overlayImage: overlayTemplates[2],
        price: 9200,
        estimatedTime: '6 Hours',
        difficulty: 'Master Bridal',
        featured: true,
        likesCount: 340,
        viewsCount: 1950,
        sharesCount: 130,
      },
      {
        title: 'Diwali Sparkler Palm Mandala',
        description: 'Radiant festive sunburst mandala styled with shimmering oil finish and delicate finger fireworks accents.',
        category: catMap['Festival Special'],
        tags: ['Diwali', 'Sunburst', 'Mandala', 'Festival'],
        images: [
          'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1000&q=80',
        ],
        overlayImage: overlayTemplates[0],
        price: 1600,
        estimatedTime: '1 Hour',
        difficulty: 'Easy',
        featured: false,
        likesCount: 205,
        viewsCount: 1040,
        sharesCount: 57,
      },
      {
        title: 'Sangeet Party Shaded Floral Trail',
        description: 'Vibrant, camera-ready shaded floral belt designed to dry rapidly and stain deeply during energetic sangeet dance nights.',
        category: catMap['Indo-Arabic'],
        tags: ['Sangeet', 'Party', 'Floral', 'Quick Dry'],
        images: [
          'https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=1000&q=80',
        ],
        overlayImage: overlayTemplates[1],
        price: 1900,
        estimatedTime: '1.5 Hours',
        difficulty: 'Easy',
        featured: false,
        likesCount: 180,
        viewsCount: 890,
        sharesCount: 50,
      },
      {
        title: 'Groom Royal Minimal Crest & Palm Motif',
        description: 'Tailored for grooms who want a sophisticated, subtle touch—featuring royal sword or monogram mandala on one palm with crisp lines.',
        category: catMap['Minimal & Contemporary'],
        tags: ['Groom Mehndi', 'Men', 'Minimal', 'Monogram'],
        images: [
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80',
        ],
        overlayImage: overlayTemplates[3],
        price: 1500,
        estimatedTime: '45 Mins',
        difficulty: 'Easy',
        featured: false,
        likesCount: 160,
        viewsCount: 750,
        sharesCount: 40,
      },
      {
        title: 'Floral Payal & Ankle Vines',
        description: 'Gentle winding floral vines circling the ankle bone with miniature leafy cascades touching each side of the sole.',
        category: catMap['Feet & Anklet Mehndi'],
        tags: ['Feet', 'Anklet', 'Payal', 'Delicate'],
        images: [
          'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1000&q=80',
        ],
        overlayImage: overlayTemplates[4],
        price: 2600,
        estimatedTime: '1.5 Hours',
        difficulty: 'Intermediate',
        featured: false,
        likesCount: 125,
        viewsCount: 620,
        sharesCount: 25,
      },
      {
        title: 'Heirloom Lotus & Elephant Jali Composition',
        description: 'Symbolic royal Indian elephants carrying lotus buds framed inside multi-layered scalloped arches on wrists and palms.',
        category: catMap['Traditional Rajasthani'],
        tags: ['Elephant', 'Lotus', 'Heritage', 'Rajasthani', 'Traditional'],
        images: [
          'https://images.unsplash.com/photo-1583875762487-5f8f7c718d14?auto=format&fit=crop&w=1000&q=80',
        ],
        overlayImage: overlayTemplates[2],
        price: 6200,
        estimatedTime: '4 Hours',
        difficulty: 'Intricate',
        featured: true,
        likesCount: 295,
        viewsCount: 1650,
        sharesCount: 105,
      },
      {
        title: 'Contemporary Symmetrical Wrist Cuff',
        description: 'Modern jewelry-inspired bracelet wrap with suspended pearl droplets and micro-latticework across the back of the hand.',
        category: catMap['Modern Mandala'],
        tags: ['Wrist Cuff', 'Jewelry', 'Bracelet', 'Back Hand'],
        images: [
          'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80',
        ],
        overlayImage: overlayTemplates[2],
        price: 1700,
        estimatedTime: '1 Hour',
        difficulty: 'Easy',
        featured: false,
        likesCount: 145,
        viewsCount: 720,
        sharesCount: 35,
      },
    ];

    const createdDesigns = await Promise.all(
      designList.map((d) =>
        Design.create({
          ...d,
          slug: createSlug(d.title),
          published: true,
        })
      )
    );
    console.log(`Created ${createdDesigns.length} designs.`);

    // 4. Create Services (6+ Services)
    const servicesData = [
      {
        title: 'Grand Royal Bridal Mehndi',
        description: 'Complete high-density bespoke bridal henna for both hands (up to elbows) and feet (up to mid-calf). Includes customized bride-groom portrait sketches, love story monograms, and premium organic henna concoction for intense mahogany stains.',
        startingPrice: 11000,
        duration: '6 - 8 Hours',
        image: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80',
        features: [
          'Bespoke Bride & Groom Portraits',
          'Elbow-length palms & back hands',
          'Feet coverage up to mid-calf',
          'Complimentary aftercare kit & essential oil sealant',
          'Pre-wedding design consultation',
          '100% Organic certified triple-filtered Henna',
        ],
        order: 1,
      },
      {
        title: 'Classic Engagement & Roka Mehndi',
        description: 'Sophisticated medium-density henna tailored for the engagement ring ceremony. Symmetrical wrists, modern mandalas, or delicate Arabic trails that accentuate your engagement ring.',
        startingPrice: 4500,
        duration: '3 - 4 Hours',
        image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
        features: [
          'Both hands up to mid-forearm',
          'Couple initials monogramming',
          'Photogenic ring placement focus',
          'Natural darkening aftercare balm',
        ],
        order: 2,
      },
      {
        title: 'Sangeet & Wedding Party Guest Mehndi',
        description: 'Dedicated team booking for wedding guests, bridesmaids, mother of the bride, and family members during Sangeet and Mehndi ceremonies.',
        startingPrice: 6500,
        duration: '4 - 5 Hours (Hourly / Per Artist)',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        features: [
          'Handles 15 - 25 guests comfortably',
          'Choice of Arabic, Floral, or Mandala styles',
          'Senior assistant artists available for large gatherings',
          'Quick-dry natural organic cones',
        ],
        order: 3,
      },
      {
        title: 'Festival & Celebrations Special',
        description: 'Festive appointments for Karwa Chauth, Teej, Diwali, Eid, and Raksha Bandhan at the studio or on-location.',
        startingPrice: 1800,
        duration: '1 - 2 Hours',
        image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
        features: [
          'Front & back palms design',
          'Fast application without compromising precision',
          'Complimentary clove steam and lemon-sugar glaze',
        ],
        order: 4,
      },
      {
        title: 'Baby Shower (Godh Bharai) Mehndi',
        description: 'Cherish motherhood with heartwarming cradle themes, baby names, lotus gardens, and gentle calming application.',
        startingPrice: 3500,
        duration: '2.5 - 3 Hours',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        features: [
          'Palm & belly henna options available',
          'Safe lavender-infused organic essential oils',
          'Customized baby shower symbolism',
        ],
        order: 5,
      },
      {
        title: 'Bespoke Custom Studio Appointments',
        description: 'Private 1-on-1 personalized sessions at our luxury studio for portfolio shoots, anniversary celebrations, or customized tattoo-style henna art.',
        startingPrice: 2000,
        duration: '1.5 - 2 Hours',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
        features: [
          'Private relaxing air-conditioned studio ambience',
          'Custom stencil & freehand combinations',
          'Complimentary masala chai & photo shoot assistance',
        ],
        order: 6,
      },
    ];

    const createdServices = await Promise.all(
      servicesData.map((s) =>
        Service.create({
          ...s,
          slug: createSlug(s.title),
        })
      )
    );
    console.log(`Created ${createdServices.length} services.`);

    // 5. Create Pricing Packages
    const pricingData = [
      {
        title: 'Silver Festive Package',
        service: createdServices[3]._id,
        serviceName: 'Festival & Celebrations Special',
        price: 1800,
        priceType: 'Complete Package',
        duration: '1 - 1.5 Hours',
        features: [
          'Both hands front palm coverage',
          'Delicate floral mandala or Arabic vine',
          'Organic natural stain cone',
          'Lemon sugar sealant glaze',
        ],
        discount: 'Save 10%',
        isPopular: false,
        order: 1,
      },
      {
        title: 'Golden Engagement Elegance',
        service: createdServices[1]._id,
        serviceName: 'Classic Engagement & Roka Mehndi',
        price: 4500,
        priceType: 'Complete Package',
        duration: '3 Hours',
        features: [
          'Full palms & backs up to mid-forearm',
          'Interlocking couple initials monogram',
          'Symmetrical mandala & lace cuffs',
          'Complimentary aftercare balm',
          'Digital high-res preview photo',
        ],
        discount: 'Most Loved',
        isPopular: true,
        order: 2,
      },
      {
        title: 'Kohinoor Royal Bridal Signature',
        service: createdServices[0]._id,
        serviceName: 'Grand Royal Bridal Mehndi',
        price: 11000,
        priceType: 'Complete Package',
        duration: '6 - 7 Hours',
        features: [
          'Elbow-length intricate front & back hands',
          'Mid-calf royal bridal feet henna',
          'Bride & Groom portrait sketch motifs',
          'Custom love story wedding elements',
          'VIP home/venue artist travel included',
          'Organic luxury aftercare kit',
        ],
        discount: 'Bridal Best Seller',
        isPopular: true,
        order: 3,
      },
      {
        title: 'Sangeet Party Guest Package',
        service: createdServices[2]._id,
        serviceName: 'Sangeet & Wedding Party Guest Mehndi',
        price: 6500,
        priceType: 'Hourly',
        duration: '4 Hours (Up to 20 Guests)',
        features: [
          'Quick 1-hand Arabic & floral patterns',
          'Dedicated lead artist + 1 assistant artist',
          'High stain organic cones provided',
          'Perfect for sangeet & cocktail night',
        ],
        discount: '',
        isPopular: false,
        order: 4,
      },
    ];

    await Pricing.insertMany(pricingData);
    console.log('Created pricing packages.');

    // 6. Create Testimonials (6+ verified reviews)
    const testimonialData = [
      {
        name: 'Ananya Sharma',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        rating: 5,
        review: 'Shreya is an absolute magician! My bridal mehndi was the centerpiece of conversation throughout my wedding week. The color developed into the most gorgeous deep burgundy, and her patience with my portrait request was unbelievable.',
        eventType: 'Bridal Mehndi',
        featured: true,
      },
      {
        name: 'Priyanka Mehta',
        profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        rating: 5,
        review: 'I used the Virtual Try-On feature on the website first to select my engagement design, and the final result on my hand was even more breathtaking than the preview! Truly seamless experience and very professional.',
        eventType: 'Engagement Mehndi',
        featured: true,
      },
      {
        name: 'Dr. Radhika Desai',
        profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        rating: 5,
        review: 'We booked Shreya and her team for my sister’s Sangeet ceremony. They handled over 30 guests effortlessly with sheer grace and stunning designs. Everyone loved their natural organic henna smell!',
        eventType: 'Sangeet Party',
        featured: true,
      },
      {
        name: 'Kavita Joshi',
        profileImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80',
        rating: 5,
        review: 'My baby shower Godh Bharai mehndi was so delicate and emotional. The little cradle motif brought tears of happiness to my mother-in-law. Highly recommend Shreya’s Mehndi Zone!',
        eventType: 'Baby Shower',
        featured: true,
      },
      {
        name: 'Meera Patel',
        profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
        rating: 5,
        review: 'The precision in her lines is something you rarely find. Even the thinnest geometric jali was razor-sharp. Best mehndi artist in the city, hands down!',
        eventType: 'Bridal Mehndi',
        featured: false,
      },
      {
        name: 'Tanvi Shah',
        profileImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
        rating: 5,
        review: 'Super easy booking process and immediate response on WhatsApp. Shreya arrived right on time with her full professional kit and aftercare instructions.',
        eventType: 'Karwa Chauth Special',
        featured: false,
      },
    ];

    await Testimonial.insertMany(testimonialData);
    console.log('Created testimonials.');

    // 7. Create Sample Bookings (10+ realistic bookings)
    const sampleBookings = [
      {
        bookingId: 'MH-2026-104821',
        name: 'Riddhi Verma',
        phone: '+91 98112 33445',
        email: 'riddhi.verma@example.com',
        eventType: 'Bridal Mehndi',
        eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // in 14 days
        preferredTime: '10:00 AM - 01:00 PM',
        numberOfPeople: 1,
        location: 'Taj Gateway Heritage, Dumas Road, Surat',
        selectedDesign: createdDesigns[0]._id,
        designTitle: createdDesigns[0].title,
        service: createdServices[0]._id,
        serviceName: createdServices[0].title,
        budget: '₹12,000 - ₹15,000',
        specialRequirements: 'Would love bride & groom initials hidden inside the palm mandala.',
        status: 'Confirmed',
        adminNotes: 'Client confirmed via phone. Deposit received.',
      },
      {
        bookingId: 'MH-2026-218934',
        name: 'Aashi Shah',
        phone: '+91 99250 88776',
        email: 'aashi.shah@example.com',
        eventType: 'Engagement',
        eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // in 7 days
        preferredTime: '02:00 PM - 05:00 PM',
        numberOfPeople: 2,
        location: 'Greenfield Club House, Vesu, Surat',
        selectedDesign: createdDesigns[6]._id,
        designTitle: createdDesigns[6].title,
        service: createdServices[1]._id,
        serviceName: createdServices[1].title,
        budget: '₹5,000',
        specialRequirements: 'Matching floral cuffs for sister as well.',
        status: 'Pending',
      },
      {
        bookingId: 'MH-2026-339102',
        name: 'Sneha Choksi',
        phone: '+91 98795 12340',
        email: 'sneha.choksi@example.com',
        eventType: 'Sangeet / Wedding Party',
        eventDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        preferredTime: '04:00 PM - 08:00 PM',
        numberOfPeople: 20,
        location: 'Avadh Utopia Palace, Surat',
        selectedDesign: createdDesigns[16]._id,
        designTitle: createdDesigns[16].title,
        service: createdServices[2]._id,
        serviceName: createdServices[2].title,
        budget: '₹10,000',
        specialRequirements: 'Need 2 artists to cover 20 bridesmaids quickly.',
        status: 'Confirmed',
      },
      {
        bookingId: 'MH-2026-442819',
        name: 'Dhara Parekh',
        phone: '+91 97240 55667',
        email: 'dhara.p@example.com',
        eventType: 'Baby Shower (Godh Bharai)',
        eventDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        preferredTime: '11:00 AM - 02:00 PM',
        numberOfPeople: 1,
        location: 'Silver Bells Residency, Adajan, Surat',
        selectedDesign: createdDesigns[9]._id,
        designTitle: createdDesigns[9].title,
        service: createdServices[4]._id,
        serviceName: createdServices[4].title,
        budget: '₹4,000',
        specialRequirements: 'Cradle motif with soft soothing eucalyptus aroma.',
        status: 'Completed',
      },
      {
        bookingId: 'MH-2026-559012',
        name: 'Neha Kapoor',
        phone: '+91 98200 44321',
        email: 'neha.k@example.com',
        eventType: 'Festival / Karwa Chauth / Eid',
        eventDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        preferredTime: '06:00 PM - 08:00 PM',
        numberOfPeople: 3,
        location: 'Studio Visit Appointment',
        selectedDesign: createdDesigns[8]._id,
        designTitle: createdDesigns[8].title,
        service: createdServices[3]._id,
        serviceName: createdServices[3].title,
        budget: '₹2,500',
        status: 'Pending',
      },
      {
        bookingId: 'MH-2026-670192',
        name: 'Kareena Solanki',
        phone: '+91 98980 11223',
        email: 'kareena@example.com',
        eventType: 'Bridal Mehndi',
        eventDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // past completed
        preferredTime: '09:00 AM - 03:00 PM',
        numberOfPeople: 1,
        location: 'Marriott Hotel, Athwalines, Surat',
        selectedDesign: createdDesigns[14]._id,
        designTitle: createdDesigns[14].title,
        service: createdServices[0]._id,
        serviceName: createdServices[0].title,
        budget: '₹12,000',
        status: 'Completed',
      },
    ];

    await Booking.insertMany(sampleBookings);
    console.log('Created sample bookings.');

    // 8. Create Inquiries
    const sampleInquiries = [
      {
        name: 'Ritu Agrawal',
        email: 'ritu@example.com',
        phone: '+91 98765 11223',
        subject: 'Destination Wedding in Udaipur Booking Inquiry',
        message: 'Hello Shreya! We are planning a 3-day destination wedding in Udaipur in December 2026. Are you available for travel and what would be the package for the bride plus 30 guests?',
        status: 'New',
      },
      {
        name: 'Monika Singhania',
        email: 'monika@example.com',
        phone: '+91 98251 99887',
        subject: 'Organic Henna Powder Inquiry',
        message: 'Hi, do you sell the triple-filtered natural henna cones that you prepare? I have sensitive skin and loved the patch test.',
        status: 'In Progress',
      },
    ];
    await Inquiry.insertMany(sampleInquiries);
    console.log('Created sample inquiries.');

    // 9. Create Site Settings
    await SiteSettings.create({
      businessName: "Shreya's Mehndi Zone",
      tagline: 'Crafting Timeless Henna Art & Bridal Elegance',
      artistName: 'Shreya Gediya',
      artistBio: 'Award-winning professional bridal Mehndi artist with over 8 years of passion, crafting bespoke intricate designs for weddings, engagements, and special celebrations across India. Known for organic henna formulations, razor-sharp symmetry, and personalized love story motifs.',
      phone: '+91 98765 43210',
      whatsappNumber: '+919876543210',
      email: 'hello@shreyasmehndizone.com',
      address: 'Heritage Mehndi Studio, Ring Road, Surat, Gujarat 395007',
      businessHours: 'Mon - Sun: 09:00 AM - 08:30 PM (By Prior Appointment)',
      instagramUrl: 'https://instagram.com/shreyasmehndizone',
      facebookUrl: 'https://facebook.com/shreyasmehndizone',
      youtubeUrl: 'https://youtube.com/@shreyasmehndizone',
      heroTitle: 'Beautiful Mehndi, Crafted With Love',
      heroSubtitle: 'Elegant bridal, festive and traditional Mehndi designs created specially for your unforgettable moments.',
      aboutText: 'At Shreya\'s Mehndi Zone, we believe every stroke of henna tells a unique story of joy, heritage, and timeless celebration. We combine 100% certified organic Rajasthani henna leaves with immaculate precision, modern negative-space flair, and cherished traditional motifs.',
      footerText: '© 2026 Shreya\'s Mehndi Zone. All Rights Reserved. Crafted with love & bridal sophistication.',
    });
    console.log('Created site settings.');

    console.log('\n======================================================');
    console.log('🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('🔑 Admin Credentials:');
    console.log('   Email:    admin@shreyasmehndizone.com');
    console.log('   Password: Admin@12345');
    console.log('======================================================\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();

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
        image: '/images/real/royal-bridal-hashtag-rings.jpg',
        featured: true,
        order: 1,
      },
      {
        name: 'Arabic Mehndi',
        description: 'Flowing floral vines, bold shaded petals, free-flowing trails, and modern negative space.',
        image: '/images/real/peacock-floral-palms.jpg',
        featured: true,
        order: 2,
      },
      {
        name: 'Indo-Arabic',
        description: 'A harmonious blend of fine Indian checks and motifs filled inside bold Arabic floral contours.',
        image: '/images/real/bridal-dulhan-ganesha-full-arm.jpg',
        featured: true,
        order: 3,
      },
      {
        name: 'Traditional Rajasthani',
        description: 'Authentic royal Marwari motifs, peacock figurines, dhol-shehnai, and intricate jali patterns.',
        image: '/images/real/bridal-groom-portrait-blessing.jpg',
        featured: true,
        order: 4,
      },
      {
        name: 'Minimal & Contemporary',
        description: 'Delicate geometric lines, fingertip mandalas, chic wrist cuffs, and subtle elegance.',
        image: '/images/real/peacock-floral-palms.jpg',
        featured: true,
        order: 5,
      },
      {
        name: 'Modern Mandala',
        description: 'Sacred symmetrical circular mandalas centered on palms with lace cuffs and delicate accents.',
        image: '/images/real/royal-sunburst-mandala-kalash.jpg',
        featured: true,
        order: 6,
      },
      {
        name: 'Engagement Mehndi',
        description: 'Classy medium-coverage designs featuring personalized couple initials and soft romantic vines.',
        image: '/images/real/bridal-rings-monogram-cuff.jpg',
        featured: false,
        order: 7,
      },
      {
        name: 'Baby Shower (Godh Bharai)',
        description: 'Sweet celebratory themes with baby cradles, mom-to-be portraits, lotus blossoms, and peacock trails.',
        image: '/images/real/love-story-proposal-silhouette.jpg',
        featured: false,
        order: 8,
      },
      {
        name: 'Festival Special',
        description: 'Quick, striking patterns designed for Diwali, Karwa Chauth, Teej, Raksha Bandhan, and Eid.',
        image: '/images/real/bridal-shubh-vivah-palki.jpg',
        featured: true,
        order: 9,
      },
      {
        name: 'Feet & Anklet Mehndi',
        description: 'Royal anklet jali, floral payal borders, and matching bridal feet henna compositions.',
        image: '/images/real/bridal-feet-royal-mandala.jpg',
        featured: false,
        order: 10,
      },
      {
        name: 'Finger & Ring Henna',
        description: 'Trendy micro-details, Bohemian ring chains, and dainty finger leaf bands.',
        image: '/images/real/bridal-couple-initials-full-hands.jpg',
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
        title: 'Devang & Priyanshi Royal Wedding Suite',
        description: 'Masterpiece bespoke bridal henna featuring customized wedding hashtag #DevPri, interlocking diamond rings, couple initials monogram DP, and royal lotus borders extending to the forearms.',
        category: catMap['Bridal Mehndi'],
        tags: ['Bridal', 'Hashtag', 'Wedding Rings', 'Full Hand', 'Monogram', 'Intricate'],
        images: [
          '/images/real/royal-bridal-hashtag-rings.jpg',
          '/images/real/bridal-couple-initials-full-hands.jpg',
        ],
        overlayImage: overlayTemplates[0],
        price: 9500,
        estimatedTime: '5 - 6 Hours',
        difficulty: 'Master Bridal',
        featured: true,
        likesCount: 342,
        viewsCount: 1850,
        sharesCount: 124,
      },
      {
        title: 'Heritage Groom Portrait & Sanskrit Blessing',
        description: 'Timeless traditional masterpiece featuring hand-sketched groom portrait in royal turban, Sanskrit blessing "अखंड सौभाग्यवती भवः", sacred kalash, elephant procession, and swastik motifs.',
        category: catMap['Traditional Rajasthani'],
        tags: ['Rajasthani', 'Traditional', 'Groom Portrait', 'Heritage', 'Sanskrit', 'Jali'],
        images: [
          '/images/real/bridal-groom-portrait-blessing.jpg',
        ],
        overlayImage: overlayTemplates[2],
        price: 8500,
        estimatedTime: '5 Hours',
        difficulty: 'Master Bridal',
        featured: true,
        likesCount: 298,
        viewsCount: 1620,
        sharesCount: 95,
      },
      {
        title: 'Custom Love Story & Proposal Silhouette',
        description: 'Modern storytelling bridal henna depicting the kneeling proposal silhouette on the palms, romantic vows ("He said YES..."), milestone dates, and sacred lotus crowns.',
        category: catMap['Engagement Mehndi'],
        tags: ['Love Story', 'Proposal', 'Custom', 'Romance', 'Silhouette', 'Modern'],
        images: [
          '/images/real/love-story-proposal-silhouette.jpg',
        ],
        overlayImage: overlayTemplates[1],
        price: 7500,
        estimatedTime: '4 - 5 Hours',
        difficulty: 'Intricate',
        featured: true,
        likesCount: 380,
        viewsCount: 2100,
        sharesCount: 160,
      },
      {
        title: 'Celestial Royal Sunburst Mandala & Kalash',
        description: 'A sacred sunburst mandala centered on the palm with custom monogram S, sacred kalash urn motif, ornate jaali wristband, and fine lotus cuffs.',
        category: catMap['Modern Mandala'],
        tags: ['Mandala', 'Sunburst', 'Kalash', 'Monogram', 'Symmetry'],
        images: [
          '/images/real/royal-sunburst-mandala-kalash.jpg',
        ],
        overlayImage: overlayTemplates[0],
        price: 3200,
        estimatedTime: '2 - 2.5 Hours',
        difficulty: 'Intermediate',
        featured: true,
        likesCount: 245,
        viewsCount: 1180,
        sharesCount: 78,
      },
      {
        title: 'Indo-Arabic Dulhan Portrait & Lord Ganesha Arm',
        description: 'Full-arm bridal artwork showcasing the bride (Dulhan) portrait, auspicious Lord Ganesha motif, rich lotus jaal, and dense forearm lattice work.',
        category: catMap['Indo-Arabic'],
        tags: ['Indo-Arabic', 'Dulhan', 'Ganesha', 'Portraits', 'Full Arm'],
        images: [
          '/images/real/bridal-dulhan-ganesha-full-arm.jpg',
        ],
        overlayImage: overlayTemplates[2],
        price: 8800,
        estimatedTime: '5 - 6 Hours',
        difficulty: 'Master Bridal',
        featured: true,
        likesCount: 310,
        viewsCount: 1720,
        sharesCount: 110,
      },
      {
        title: 'Royal Bridal Lotus & Jhumka Payal Feet Henna',
        description: 'Royal bridal feet composition featuring arched lotus motifs, dangling jhumka bells, diamond lattice net, and bold toe cap detailing.',
        category: catMap['Feet & Anklet Mehndi'],
        tags: ['Feet Mehndi', 'Payal', 'Bridal Feet', 'Lotus', 'Jhumka'],
        images: [
          '/images/real/bridal-feet-royal-mandala.jpg',
          '/images/real/bridal-feet-lotus-jhumka.jpg',
          '/images/real/bridal-feet-lotus-arch.jpg',
        ],
        overlayImage: overlayTemplates[4],
        price: 4500,
        estimatedTime: '3 Hours',
        difficulty: 'Intricate',
        featured: true,
        likesCount: 275,
        viewsCount: 1390,
        sharesCount: 88,
      },
      {
        title: 'Peacock & Royal Floral Palm Harmony',
        description: 'Bespoke intricate peacock motifs nestled with floral jaal, elegant bracelet cuffs, shaded leaves, and delicate finger netting.',
        category: catMap['Arabic Mehndi'],
        tags: ['Arabic', 'Peacock', 'Floral', 'Palm', 'Elegance'],
        images: [
          '/images/real/peacock-floral-palms.jpg',
        ],
        overlayImage: overlayTemplates[1],
        price: 2800,
        estimatedTime: '2 Hours',
        difficulty: 'Intermediate',
        featured: true,
        likesCount: 215,
        viewsCount: 980,
        sharesCount: 62,
      },
      {
        title: 'Bridal Wedding Rings & Monogram Wrist Cuff',
        description: 'Detailed engagement and wedding cuff design featuring personalized initials monogram "A", interlocking wedding rings, and floral band work.',
        category: catMap['Engagement Mehndi'],
        tags: ['Engagement', 'Rings', 'Monogram', 'Wrist Cuff', 'Jewelry'],
        images: [
          '/images/real/bridal-rings-monogram-cuff.jpg',
          '/images/real/bridal-couple-initials-full-hands.jpg',
        ],
        overlayImage: overlayTemplates[2],
        price: 3600,
        estimatedTime: '2.5 Hours',
        difficulty: 'Intermediate',
        featured: false,
        likesCount: 195,
        viewsCount: 890,
        sharesCount: 54,
      },
      {
        title: 'Shubh Vivah & Royal Palki Heritage',
        description: 'Auspicious "श्री शुभ विवाह" inscription on palm with "सदा सौभाग्यवती भवः" blessing, swastik, hanging jhumkas, and royal bridal palki elements.',
        category: catMap['Traditional Rajasthani'],
        tags: ['Shubh Vivah', 'Blessing', 'Swastik', 'Traditional', 'Rajasthani'],
        images: [
          '/images/real/bridal-shubh-vivah-palki.jpg',
        ],
        overlayImage: overlayTemplates[0],
        price: 6500,
        estimatedTime: '4 Hours',
        difficulty: 'Intricate',
        featured: true,
        likesCount: 260,
        viewsCount: 1410,
        sharesCount: 85,
      },
      {
        title: 'Lotus Jharokha Bridal Feet Composition',
        description: 'Symmetrical bridal feet arches enclosing blooming lotus petals, dangling jhumka pearls, and structured netted checks.',
        category: catMap['Feet & Anklet Mehndi'],
        tags: ['Feet Mehndi', 'Lotus', 'Jharokha', 'Bridal Feet'],
        images: [
          '/images/real/bridal-feet-lotus-jhumka.jpg',
          '/images/real/bridal-feet-lotus-arch.jpg',
        ],
        overlayImage: overlayTemplates[4],
        price: 3800,
        estimatedTime: '2.5 Hours',
        difficulty: 'Intermediate',
        featured: false,
        likesCount: 180,
        viewsCount: 830,
        sharesCount: 42,
      },
      {
        title: 'Regal Couple Initials & Full Hand Symphony',
        description: 'Stunning full-hand bridal artwork highlighting custom initials DP, interlocking wedding bands, and dense Rajasthani lace fills.',
        category: catMap['Bridal Mehndi'],
        tags: ['Bridal', 'Full Hand', 'Initials', 'Symmetry'],
        images: [
          '/images/real/bridal-couple-initials-full-hands.jpg',
          '/images/real/royal-bridal-hashtag-rings.jpg',
        ],
        overlayImage: overlayTemplates[0],
        price: 8200,
        estimatedTime: '5 Hours',
        difficulty: 'Master Bridal',
        featured: false,
        likesCount: 290,
        viewsCount: 1540,
        sharesCount: 98,
      },
      {
        title: 'Arched Lotus & Payal Jali Feet Art',
        description: 'Graceful ankle payal border with arched lotus frames and diamond lattices creating an opulent stained bridal feet finish.',
        category: catMap['Feet & Anklet Mehndi'],
        tags: ['Feet Mehndi', 'Payal', 'Lattice', 'Lotus'],
        images: [
          '/images/real/bridal-feet-lotus-arch.jpg',
        ],
        overlayImage: overlayTemplates[4],
        price: 3200,
        estimatedTime: '2 Hours',
        difficulty: 'Intermediate',
        featured: false,
        likesCount: 165,
        viewsCount: 760,
        sharesCount: 38,
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
        image: '/images/real/royal-bridal-hashtag-rings.jpg',
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
        image: '/images/real/bridal-rings-monogram-cuff.jpg',
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
        image: '/images/real/peacock-floral-palms.jpg',
        features: [
          'Handles 15 - 25 guests comfortably',
          'Choice of Arabic, Floral, or Mandala styles',
          'Senior assistant artists available for large gatherings',
          'Quick-dry natural organic cones',
        ],
        order: 3,
      },
      {
        title: 'Traditional Rajasthani & Groom Portrait Henna',
        description: 'Authentic royal Marwari artwork featuring intricate groom & bride portraits, Sanskrit blessings, sacred kalash, and dhol-shehnai festivity.',
        startingPrice: 7500,
        duration: '4 - 5 Hours',
        image: '/images/real/bridal-groom-portrait-blessing.jpg',
        features: [
          'Hand-sketched royal portraits',
          'Auspicious Sanskrit marriage verses',
          'Deep mahogany Rajasthani stain guaranteed',
        ],
        order: 4,
      },
      {
        title: 'Intricate Royal Bridal Feet (Payal & Jali)',
        description: 'Regal bridal feet composition with arched lotus motifs, dangling jhumka bells, diamond lattice net, and stained toe caps.',
        startingPrice: 4500,
        duration: '2.5 - 3 Hours',
        image: '/images/real/bridal-feet-royal-mandala.jpg',
        features: [
          'Coverage from toes to mid-calf',
          'Symmetrical matching pair designs',
          'Long-lasting foot stain formulation',
        ],
        order: 5,
      },
      {
        title: 'Custom Love Story & Proposal Storytelling',
        description: 'One-of-a-kind storytelling henna weaving the couple proposal silhouette, romantic vows ("He said YES..."), milestone anniversary dates, and customized initials.',
        startingPrice: 8000,
        duration: '4 - 5 Hours',
        image: '/images/real/love-story-proposal-silhouette.jpg',
        features: [
          'Proposal silhouette on palms',
          'Custom love quotes & dates in Devanagari/English',
          'Personalized couple monogram crest',
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
        selectedDesign: createdDesigns[6]._id,
        designTitle: createdDesigns[6].title,
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
        selectedDesign: createdDesigns[10]._id,
        designTitle: createdDesigns[10].title,
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

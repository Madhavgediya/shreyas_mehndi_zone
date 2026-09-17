import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Award,
  Leaf,
  Clock,
  Star,
  Camera,
  Heart,
} from 'lucide-react';
import { designsApi, categoriesApi, servicesApi, testimonialsApi } from '../api';
import { useSettings } from '../context/SettingsContext';
import DesignCard from '../components/designs/DesignCard';
import DesignQuickViewModal from '../components/designs/DesignQuickViewModal';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import SEO from '../components/common/SEO';

export const Home = () => {
  const { settings, getWhatsAppLink } = useSettings();
  const [featuredDesigns, setFeaturedDesigns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [quickViewDesign, setQuickViewDesign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [designsRes, catRes, servicesRes, testRes] = await Promise.all([
          designsApi.getFeatured(),
          categoriesApi.getCategories(),
          servicesApi.getServices(),
          testimonialsApi.getApproved(),
        ]);

        if (designsRes.success) setFeaturedDesigns(designsRes.data || []);
        if (catRes.success) setCategories(catRes.data.slice(0, 8) || []);
        if (servicesRes.success) setServices(servicesRes.data.slice(0, 3) || []);
        if (testRes.success) setTestimonials(testRes.data.slice(0, 3) || []);
      } catch (err) {
        console.warn('Home data load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const whyChooseUs = [
    {
      icon: Leaf,
      title: '100% Organic Henna',
      description:
        'Prepared using triple-filtered Rajasthani sojat leaves and pure eucalyptus & tea tree oils. Guaranteed dark mahogany stains without chemicals.',
    },
    {
      icon: Award,
      title: 'Bespoke Bridal Mastery',
      description:
        'Over 8 years of dedicated experience delivering intricate love-story portraits, royal peacock jaal, and immaculate geometric precision.',
    },
    {
      icon: Sparkles,
      title: 'Virtual Try-On Technology',
      description:
        'Preview how any Mehndi design looks on your own hand using our interactive Virtual Try-On tool before your wedding day.',
    },
    {
      icon: Clock,
      title: 'Prompt & Punctual Service',
      description:
        'Comfortable on-location destination bridal services across India, adhering strictly to your wedding ceremony timelines.',
    },
  ];

  return (
    <>
      <SEO
        title="Home"
        description="Award-winning bridal Mehndi artist Shreya Gediya. Explore exquisite bridal, Arabic, and traditional henna with interactive Virtual Try-On and effortless booking."
      />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 bg-parchment-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-500/15 border border-accent-400/40 text-henna-800 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-accent-600 fill-accent-500" />
                <span>Award-Winning Bridal & Designer Mehndi Artist</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-espresso-900 tracking-tight leading-[1.15]">
                {settings.heroTitle || 'Beautiful Mehndi, Crafted With Love'}
              </h1>

              <p className="text-espresso-700 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {settings.heroSubtitle ||
                  'Elegant bridal, festive and traditional Mehndi designs created specially for your unforgettable moments.'}
              </p>

              {/* Hero CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link to="/gallery">
                  <Button variant="primary" size="lg">
                    Explore Designs
                  </Button>
                </Link>

                <Link to="/book">
                  <Button variant="secondary" size="lg" icon={Calendar}>
                    Book Appointment
                  </Button>
                </Link>

                <Link to="/try-on">
                  <Button variant="outline" size="lg" icon={Sparkles}>
                    Try Mehndi
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-parchment-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-espresso-700 font-medium">
                <span className="flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-emerald-600" /> 100% Organic Henna
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> 4.9/5 (250+ Brides)
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-henna-700" /> Verified On-Location Travel
                </span>
              </div>
            </motion.div>

            {/* Right Hero Image Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative Henna Rings */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-accent-400/20 to-henna-500/10 rounded-3xl filter blur-xl" />

                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-soft-lg border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=1200&q=85"
                    alt="Royal Bridal Mehndi Art"
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso-900/70 via-transparent to-transparent" />

                  {/* Floating Testimonial Pill */}
                  <div className="absolute bottom-6 inset-x-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-soft-md border border-parchment-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-parchment-200 shrink-0">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                          alt="Ananya Sharma"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex text-amber-500 text-xs mb-0.5">
                          ★★★★★
                        </div>
                        <p className="text-xs font-serif font-medium text-espresso-900 truncate">
                          "The most stunning bridal stain ever!"
                        </p>
                        <span className="text-[10px] text-espresso-700">
                          Ananya Sharma • Taj Gateway Bride
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. MEHNDI CATEGORIES SHOWCASE */}
      <section className="py-16 sm:py-20 bg-white border-y border-parchment-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-accent-600 block mb-1">
                Curated Styles
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-900">
                Explore Mehndi Categories
              </h2>
            </div>
            <Link
              to="/categories"
              className="mt-4 md:mt-0 text-sm font-semibold text-henna-700 hover:text-henna-800 flex items-center gap-1 group"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/gallery?category=${cat.slug}`}
                className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-parchment-100 border border-parchment-200 shadow-soft-sm hover:shadow-soft-md transition-all duration-300 hover:-translate-y-1"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso-900/85 via-espresso-900/30 to-transparent flex flex-col justify-end p-4 sm:p-5 text-white">
                  <h3 className="font-serif text-base sm:text-lg font-semibold leading-snug">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-parchment-200/80 mt-1 line-clamp-1">
                    {cat.description}
                  </p>
                  <span className="text-[10px] font-semibold text-accent-400 mt-2 flex items-center gap-1 group-hover:underline">
                    Explore Designs →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED DESIGNS SECTION */}
      <section className="py-16 sm:py-24 bg-parchment-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">
              Signature Portfolio
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-900">
              Featured Mehndi Creations
            </h2>
            <p className="text-espresso-700 text-sm">
              Hand-picked masterpieces celebrated for their artistic depth, razor-sharp symmetry, and dark natural stain development.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {featuredDesigns.map((design) => (
              <DesignCard
                key={design._id}
                design={design}
                onQuickView={setQuickViewDesign}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/gallery">
              <Button variant="outline" size="lg">
                View Complete Gallery ({featuredDesigns.length}+ Designs)
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. VIRTUAL MEHNDI TRY-ON BANNER */}
      <section className="py-16 bg-gradient-to-r from-[#522E1A] to-[#6B3E26] text-white relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-accent-500/10 filter blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-accent-300">
                <Sparkles className="w-3.5 h-3.5 text-accent-400" />
                <span>Interactive Innovation</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                Try Any Mehndi Design On Your Own Hand
              </h2>
              <p className="text-parchment-100/80 text-sm sm:text-base leading-relaxed max-w-2xl">
                Unsure which pattern compliments your hand structure or bridal lehenga? Upload a photo of your hand, drag and resize our transparent henna overlays, and see the realistic result instantly.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link to="/try-on">
                  <Button variant="secondary" size="lg" icon={Camera}>
                    Launch Virtual Try-On
                  </Button>
                </Link>
                <span className="text-xs text-parchment-200/70">
                  ⚡ 100% Free • No App Download Required
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="w-64 sm:w-72 aspect-[4/5] rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-4 shadow-soft-lg flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-20 h-20 rounded-2xl bg-white/15 flex items-center justify-center text-accent-400">
                  <Sparkles className="w-10 h-10" />
                </div>
                <h4 className="font-serif text-lg font-medium text-white">
                  Step-by-Step Preview
                </h4>
                <p className="text-xs text-parchment-200/80">
                  Upload photo → Select overlay → Drag, scale & rotate → Download & share preview!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SERVICES HIGHLIGHT */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">
              Professional Offerings
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-900">
              Bespoke Mehndi Services
            </h2>
            <p className="text-espresso-700 text-sm">
              Tailored packages for brides, bridesmaids, family gatherings, and festive celebrations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((srv) => (
              <Card key={srv._id} className="overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="aspect-[16/10] overflow-hidden bg-parchment-100">
                    <img
                      src={srv.image}
                      alt={srv.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between text-xs text-espresso-700 mb-2">
                      <span>{srv.duration}</span>
                      <span className="font-semibold text-henna-700">
                        From ₹{srv.startingPrice}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-espresso-900 mb-2">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-espresso-700 leading-relaxed line-clamp-3 mb-4">
                      {srv.description}
                    </p>

                    <ul className="space-y-1.5 border-t border-parchment-200 pt-3">
                      {srv.features?.slice(0, 3).map((f, i) => (
                        <li
                          key={i}
                          className="text-xs text-espresso-800 flex items-center gap-1.5"
                        >
                          <span className="text-henna-700 font-bold">•</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2">
                  <Link
                    to={`/book?service=${srv._id}&title=${encodeURIComponent(srv.title)}`}
                    className="block w-full"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      Book This Service
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/services" className="text-xs font-semibold text-henna-700 hover:underline">
              View all services & tiered pricing packages →
            </Link>
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE US */}
      <section className="py-16 sm:py-20 bg-parchment-100/70 border-y border-parchment-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">
              The Shreya's Mehndi Zone Standard
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-900">
              Why Brides Trust Us
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-parchment-200/80 shadow-soft-sm space-y-3 text-left"
              >
                <div className="w-12 h-12 rounded-2xl bg-parchment-100 text-henna-700 flex items-center justify-center shadow-soft-sm">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-espresso-900">
                  {item.title}
                </h3>
                <p className="text-xs text-espresso-700 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS SLIDER / PREVIEW */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-accent-600 block mb-1">
                Real Love Stories
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-900">
                Words From Our Happy Brides
              </h2>
            </div>
            <Link
              to="/testimonials"
              className="mt-4 md:mt-0 text-sm font-semibold text-henna-700 hover:underline flex items-center gap-1"
            >
              <span>Read all verified reviews</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t._id}
                className="bg-parchment-50 rounded-3xl p-6 sm:p-7 border border-parchment-200 shadow-soft-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex text-amber-500 text-sm">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="text-espresso-800 text-sm italic leading-relaxed">
                    "{t.review}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-5 mt-4 border-t border-parchment-200">
                  <img
                    src={t.profileImage}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-serif text-sm font-semibold text-espresso-900">
                      {t.name}
                    </h4>
                    <span className="text-[11px] text-espresso-700">
                      {t.eventType}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FINAL BOOKING CTA BANNER */}
      <section className="py-16 sm:py-20 bg-parchment-100 border-t border-parchment-200 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent-600 block">
            Limited Wedding Dates Available
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-espresso-900 leading-tight">
            Reserve Your Bridal & Festive Mehndi Dates
          </h2>
          <p className="text-espresso-700 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Due to the detailed custom nature of bridal portraits, dates fill months in advance. Check our availability and reserve your slot today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/book">
              <Button size="lg" variant="primary" icon={Calendar}>
                Book Appointment Online
              </Button>
            </Link>
            <a
              href={getWhatsAppLink('inquiry')}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="secondary">
                Chat on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <DesignQuickViewModal
        isOpen={Boolean(quickViewDesign)}
        onClose={() => setQuickViewDesign(null)}
        design={quickViewDesign}
      />
    </>
  );
};

export default Home;

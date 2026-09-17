import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Share2,
  Calendar,
  Sparkles,
  Clock,
  Tag,
  ArrowLeft,
  MessageCircle,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { designsApi } from '../api';
import { useFavorites } from '../context/FavoritesContext';
import { useSettings } from '../context/SettingsContext';
import Button from '../components/common/Button';
import ShareModal from '../components/common/ShareModal';
import DesignCard from '../components/designs/DesignCard';
import SEO from '../components/common/SEO';

export const DesignDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { getWhatsAppLink } = useSettings();

  const [design, setDesign] = useState(null);
  const [relatedDesigns, setRelatedDesigns] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    const fetchDesignDetails = async () => {
      setLoading(true);
      try {
        const res = await designsApi.getBySlug(slug);
        if (res.success) {
          setDesign(res.data.design);
          setRelatedDesigns(res.data.relatedDesigns || []);
          setActiveImageIndex(0);
        }
      } catch (err) {
        console.warn('Design detail error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDesignDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-parchment-50 flex items-center justify-center py-24">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-henna-700 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-espresso-700 font-medium">
            Loading design artwork...
          </p>
        </div>
      </div>
    );
  }

  if (!design) {
    return (
      <div className="min-h-screen bg-parchment-50 flex flex-col items-center justify-center py-24 px-4 text-center">
        <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-2">
          Design Not Found
        </h2>
        <p className="text-sm text-espresso-700 max-w-sm mb-6">
          The Mehndi pattern you are searching for might have been moved or updated.
        </p>
        <Link to="/gallery">
          <Button variant="primary">Return to Gallery</Button>
        </Link>
      </div>
    );
  }

  const favorite = isFavorite(design._id);
  const images = design.images || [
    'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=1000&q=80',
  ];

  const handleBookThisDesign = () => {
    navigate(`/book?design=${design._id}&title=${encodeURIComponent(design.title)}`);
  };

  const handleTryThisDesign = () => {
    navigate(`/try-on?design=${design._id}`);
  };

  const handleWhatsAppAsk = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const link = getWhatsAppLink('design', {
      title: design.title,
      url,
    });
    window.open(link, '_blank');
  };

  return (
    <>
      <SEO
        title={design.title}
        description={design.description}
        image={images[0]}
      />

      <div className="min-h-screen bg-parchment-50 py-8 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-espresso-700">
            <Link to="/gallery" className="hover:text-henna-700 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Gallery
            </Link>
            <span>/</span>
            <Link
              to={`/gallery?category=${design.category?.slug}`}
              className="hover:text-henna-700"
            >
              {design.category?.name}
            </Link>
            <span>/</span>
            <span className="text-espresso-900 font-medium truncate max-w-[200px]">
              {design.title}
            </span>
          </div>

          {/* Main Design Details Card */}
          <div className="bg-white rounded-3xl border border-parchment-200/90 shadow-soft-sm p-6 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column: High-Res Image Display (Col 7) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-parchment-100 border border-parchment-200 shadow-soft-sm relative group">
                  <img
                    src={images[activeImageIndex]}
                    alt={design.title}
                    className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                  />
                  {design.featured && (
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-accent-500 text-espresso-900 shadow-soft-sm flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 fill-espresso-900" /> Featured Design
                    </span>
                  )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                          activeImageIndex === idx
                            ? 'border-henna-700 shadow-soft-sm scale-105'
                            : 'border-parchment-200 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Specification & Actions (Col 5) */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  {/* Category & Action Icons */}
                  <div className="flex items-center justify-between">
                    <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-henna-100 text-henna-800 uppercase tracking-wider">
                      {design.category?.name || 'Mehndi Design'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFavorite(design)}
                        className="p-2.5 rounded-full border border-parchment-200 text-espresso-800 hover:text-red-500 hover:bg-parchment-100 transition-all"
                        aria-label="Favorite"
                      >
                        <Heart
                          className={`w-5 h-5 ${favorite ? 'text-red-500 fill-red-500' : ''}`}
                        />
                      </button>

                      <button
                        onClick={() => setShareModalOpen(true)}
                        className="p-2.5 rounded-full border border-parchment-200 text-espresso-800 hover:text-henna-700 hover:bg-parchment-100 transition-all"
                        aria-label="Share"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-espresso-900 leading-tight">
                    {design.title}
                  </h1>

                  {/* Price & Meta Pill */}
                  <div className="flex flex-wrap items-baseline gap-4 py-2 border-y border-parchment-200">
                    <div>
                      <span className="text-[10px] text-espresso-700 uppercase tracking-wider block font-medium">
                        Estimated Investment
                      </span>
                      <span className="text-3xl font-serif font-bold text-henna-800">
                        ₹{design.price}
                      </span>
                    </div>

                    <div className="h-8 w-px bg-parchment-200 hidden sm:block" />

                    <div>
                      <span className="text-[10px] text-espresso-700 uppercase tracking-wider block font-medium">
                        Application Time
                      </span>
                      <span className="text-sm font-semibold text-espresso-900 flex items-center gap-1 mt-1">
                        <Clock className="w-3.5 h-3.5 text-accent-600" />
                        {design.estimatedTime || '2 - 3 Hours'}
                      </span>
                    </div>

                    <div className="h-8 w-px bg-parchment-200 hidden sm:block" />

                    <div>
                      <span className="text-[10px] text-espresso-700 uppercase tracking-wider block font-medium">
                        Intricacy Level
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-parchment-100 text-espresso-800 inline-block mt-1">
                        {design.difficulty || 'Intermediate'}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-espresso-700 text-sm leading-relaxed">
                    {design.description}
                  </p>

                  {/* Inclusions / Highlights */}
                  <div className="space-y-2 py-2">
                    <span className="text-xs font-semibold text-espresso-900 block">
                      Artisan Inclusions:
                    </span>
                    <div className="space-y-1.5 text-xs text-espresso-800">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>100% Certified organic herbal henna formulation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Complimentary clove steam & lemon sugar glaze</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>High-res post-application photo session included</span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  {design.tags && design.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {design.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-[11px] px-3 py-1 rounded-full bg-parchment-100 text-espresso-800 border border-parchment-200/70"
                        >
                          <Tag className="w-3 h-3 text-accent-600" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Main Action CTAs */}
                <div className="space-y-3 pt-4 border-t border-parchment-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                      variant="primary"
                      size="lg"
                      icon={Calendar}
                      onClick={handleBookThisDesign}
                      className="w-full text-sm"
                    >
                      Book This Design
                    </Button>

                    <Button
                      variant="secondary"
                      size="lg"
                      icon={Sparkles}
                      onClick={handleTryThisDesign}
                      className="w-full text-sm"
                    >
                      Try On My Hand
                    </Button>
                  </div>

                  <button
                    onClick={handleWhatsAppAsk}
                    className="w-full py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 text-emerald-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Inquire About This Design via WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Related Designs "More Like This" */}
          {relatedDesigns.length > 0 && (
            <div className="space-y-6 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">
                    Recommendations
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-espresso-900">
                    More Like This in {design.category?.name}
                  </h3>
                </div>
                <Link
                  to={`/gallery?category=${design.category?.slug}`}
                  className="text-xs font-semibold text-henna-700 hover:underline"
                >
                  View all category designs →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedDesigns.map((rel) => (
                  <DesignCard key={rel._id} design={rel} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        design={design}
      />
    </>
  );
};

export default DesignDetails;

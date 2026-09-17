import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Share2, Eye, Sparkles, Clock } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
import ShareModal from '../common/ShareModal';

export const DesignCard = ({ design, onQuickView }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const navigate = useNavigate();

  if (!design) return null;

  const favorite = isFavorite(design._id);
  const primaryImage =
    design.images?.[0] ||
    'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80';

  const handleTryOn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/try-on?design=${design._id}`);
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(design);
  };

  const handleShareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShareModalOpen(true);
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(design);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.25 }}
        className="group bg-white rounded-3xl overflow-hidden border border-parchment-200/90 shadow-soft-sm hover:shadow-soft-md transition-all flex flex-col h-full"
      >
        {/* Image Container with Badges */}
        <div className="relative aspect-[4/5] overflow-hidden bg-parchment-100">
          <Link to={`/designs/${design.slug}`} className="block w-full h-full">
            <img
              src={primaryImage}
              alt={design.title}
              loading="lazy"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </Link>

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
            {design.category && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-md text-espresso-900 shadow-soft-sm uppercase tracking-wider">
                {design.category.name}
              </span>
            )}
            {design.featured && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accent-500 text-espresso-900 shadow-soft-sm flex items-center gap-1 w-fit">
                <Sparkles className="w-3 h-3 fill-espresso-900" /> Featured
              </span>
            )}
          </div>

          {/* Top Right Actions (Favorite & Share) */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
            <button
              onClick={handleFavoriteClick}
              className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-espresso-800 hover:text-red-500 shadow-soft-sm flex items-center justify-center transition-all duration-200 hover:scale-110"
              aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  favorite ? 'text-red-500 fill-red-500' : ''
                }`}
              />
            </button>

            <button
              onClick={handleShareClick}
              className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-espresso-800 hover:text-henna-700 shadow-soft-sm flex items-center justify-center transition-all duration-200 hover:scale-110"
              aria-label="Share design"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Quick View Hover Button */}
          <div className="absolute inset-x-4 bottom-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
            <button
              onClick={handleQuickViewClick}
              className="flex-1 py-2 px-3 rounded-xl bg-white/95 backdrop-blur-md text-espresso-900 hover:bg-white text-xs font-semibold shadow-soft-md flex items-center justify-center gap-1.5 transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick View</span>
            </button>
            <button
              onClick={handleTryOn}
              className="py-2 px-3 rounded-xl bg-henna-700 hover:bg-henna-800 text-white text-xs font-semibold shadow-soft-md flex items-center justify-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent-400" />
              <span>Try-On</span>
            </button>
          </div>
        </div>

        {/* Card Details */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-espresso-700 mb-1.5">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-accent-600" />
                {design.estimatedTime || '2 - 3 hrs'}
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-parchment-100 text-espresso-800">
                {design.difficulty || 'Intermediate'}
              </span>
            </div>

            <Link to={`/designs/${design.slug}`}>
              <h3 className="font-serif text-base sm:text-lg font-medium text-espresso-900 group-hover:text-henna-700 transition-colors line-clamp-1">
                {design.title}
              </h3>
            </Link>

            <p className="text-xs text-espresso-700 mt-1 line-clamp-2 leading-relaxed">
              {design.description}
            </p>
          </div>

          <div className="pt-3 mt-3 border-t border-parchment-200/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-espresso-700 uppercase tracking-wider block font-medium">
                Starting from
              </span>
              <span className="text-base font-bold text-henna-800 font-serif">
                ₹{design.price}
              </span>
            </div>

            <Link
              to={`/designs/${design.slug}`}
              className="text-xs font-semibold text-henna-700 hover:text-henna-800 hover:underline flex items-center gap-1"
            >
              Details →
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        design={design}
      />
    </>
  );
};

export default DesignCard;

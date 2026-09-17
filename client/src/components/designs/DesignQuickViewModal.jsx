import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Sparkles, Calendar, Clock, Heart, Share2, Tag, ExternalLink } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
import ShareModal from '../common/ShareModal';

export const DesignQuickViewModal = ({ isOpen, onClose, design }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  if (!design) return null;

  const favorite = isFavorite(design._id);
  const images = design.images || [
    'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80',
  ];

  const handleBookNow = () => {
    onClose();
    navigate(`/book?design=${design._id}&title=${encodeURIComponent(design.title)}`);
  };

  const handleTryOn = () => {
    onClose();
    navigate(`/try-on?design=${design._id}`);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Left Column: Image gallery */}
          <div className="space-y-3">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-parchment-100 border border-parchment-200 shadow-soft-sm">
              <img
                src={images[activeImageIndex]}
                alt={design.title}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
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

          {/* Right Column: Design Details */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-henna-100 text-henna-800 uppercase tracking-wider">
                  {design.category?.name || 'Mehndi Design'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFavorite(design)}
                    className="p-2 rounded-full hover:bg-parchment-100 text-espresso-700 transition-colors"
                    aria-label="Favorite"
                  >
                    <Heart
                      className={`w-5 h-5 ${favorite ? 'text-red-500 fill-red-500' : ''}`}
                    />
                  </button>
                  <button
                    onClick={() => setShareModalOpen(true)}
                    className="p-2 rounded-full hover:bg-parchment-100 text-espresso-700 transition-colors"
                    aria-label="Share"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <h2 className="font-serif text-2xl font-semibold text-espresso-900 leading-snug">
                {design.title}
              </h2>

              {/* Price & Meta info */}
              <div className="flex items-baseline gap-3 my-3">
                <span className="text-2xl font-serif font-bold text-henna-800">
                  ₹{design.price}
                </span>
                <span className="text-xs text-espresso-700 font-medium">
                  • Estimated {design.estimatedTime || '2 - 3 Hours'}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-parchment-100 text-espresso-800 font-medium">
                  {design.difficulty || 'Intermediate'}
                </span>
              </div>

              <p className="text-espresso-700 text-sm leading-relaxed mb-4">
                {design.description}
              </p>

              {/* Tags */}
              {design.tags && design.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {design.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-parchment-100 text-espresso-800 border border-parchment-200/60"
                    >
                      <Tag className="w-3 h-3 text-accent-600" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-4 border-t border-parchment-200">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  icon={Sparkles}
                  onClick={handleTryOn}
                  className="w-full text-xs sm:text-sm"
                >
                  Try On My Hand
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  icon={Calendar}
                  onClick={handleBookNow}
                  className="w-full text-xs sm:text-sm"
                >
                  Book This Design
                </Button>
              </div>

              <Link
                to={`/designs/${design.slug}`}
                onClick={onClose}
                className="w-full py-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-henna-700 hover:text-henna-800 hover:underline transition-colors"
              >
                <span>View Full High-Res Design Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </Modal>

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        design={design}
      />
    </>
  );
};

export default DesignQuickViewModal;

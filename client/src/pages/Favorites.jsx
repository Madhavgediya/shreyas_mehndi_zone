import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import DesignCard from '../components/designs/DesignCard';
import DesignQuickViewModal from '../components/designs/DesignQuickViewModal';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import SEO from '../components/common/SEO';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';

export const Favorites = () => {
  const { favorites } = useFavorites();
  const [quickViewDesign, setQuickViewDesign] = useState(null);

  return (
    <>
      <SEO
        title="Your Saved Mehndi Designs"
        description="View your shortlisted bridal and festive Mehndi designs."
      />

      <div className="min-h-screen bg-parchment-50 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-parchment-200/80 pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-semibold uppercase tracking-wider mb-2">
                <Heart className="w-3.5 h-3.5 fill-red-500" />
                <span>Personal Lookbook</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-900">
                Your Favorite Designs ({favorites.length})
              </h1>
              <p className="text-espresso-700 text-xs sm:text-sm mt-1">
                All your shortlisted henna designs saved in one convenient place for your wedding planning.
              </p>
            </div>

            {favorites.length > 0 && (
              <Link to="/book">
                <Button variant="primary" size="md">
                  Book an Appointment
                </Button>
              </Link>
            )}
          </div>

          {favorites.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="Your lookbook is empty"
              description="Browse our Mehndi gallery and tap the heart icon on any design you adore to save it here."
              actionText="Explore Design Gallery"
              onAction={() => window.location.assign('/gallery')}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
              {favorites.map((design) => (
                <DesignCard
                  key={design._id}
                  design={design}
                  onQuickView={setQuickViewDesign}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <DesignQuickViewModal
        isOpen={Boolean(quickViewDesign)}
        onClose={() => setQuickViewDesign(null)}
        design={quickViewDesign}
      />
    </>
  );
};

export default Favorites;

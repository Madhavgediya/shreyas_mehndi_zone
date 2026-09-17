import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { designsApi, categoriesApi } from '../api';
import DesignGrid from '../components/designs/DesignGrid';
import DesignQuickViewModal from '../components/designs/DesignQuickViewModal';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import SEO from '../components/common/SEO';
import { Search, SlidersHorizontal, ArrowUpDown, Sparkles } from 'lucide-react';

export const Gallery = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [designs, setDesigns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewDesign, setQuickViewDesign] = useState(null);

  // Filters from URL params or state
  const currentCategory = searchParams.get('category') || 'all';
  const currentSearch = searchParams.get('search') || '';
  const currentDifficulty = searchParams.get('difficulty') || 'all';
  const currentSort = searchParams.get('sort') || 'latest';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoriesApi.getCategories();
        if (res.success) setCategories(res.data);
      } catch (err) {
        // Fallback
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchDesigns = async () => {
      setLoading(true);
      try {
        const res = await designsApi.getDesigns({
          category: currentCategory !== 'all' ? currentCategory : undefined,
          search: currentSearch || undefined,
          difficulty: currentDifficulty !== 'all' ? currentDifficulty : undefined,
          sort: currentSort,
          page: currentPage,
          limit: 12,
        });

        if (res.success) {
          setDesigns(res.data.designs || []);
          setPagination(res.data.pagination || { page: 1, pages: 1, total: 0 });
        }
      } catch (err) {
        console.warn('Designs fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDesigns();
  }, [currentCategory, currentSearch, currentDifficulty, currentSort, currentPage]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // Reset to page 1
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-parchment-50 py-10 sm:py-16">
      <SEO
        title="Mehndi Design Gallery"
        description="Browse our comprehensive gallery of Bridal, Arabic, Rajasthani, Mandala, and Minimal Mehndi designs with prices and application times."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">
            Artistic Showcase
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-espresso-900">
            Mehndi Gallery & Portfolio
          </h1>
          <p className="text-espresso-700 text-sm sm:text-base leading-relaxed">
            Discover bespoke bridal, festive, and modern Mehndi patterns. Tap any design to view details, save to favorites, or try it on your hand.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-parchment-200/90 shadow-soft-sm space-y-4">
          {/* Top Search & Sort Row */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-espresso-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by design name, bridal, arabic, tags..."
                value={currentSearch}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-parchment-50 border border-parchment-200 text-espresso-900 text-xs sm:text-sm focus:outline-none focus:border-henna-700"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={currentDifficulty}
                onChange={(e) => updateFilter('difficulty', e.target.value)}
                className="px-3.5 py-2.5 rounded-2xl bg-parchment-50 border border-parchment-200 text-espresso-900 text-xs sm:text-sm focus:outline-none focus:border-henna-700 cursor-pointer"
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Intricate">Intricate</option>
                <option value="Master Bridal">Master Bridal</option>
              </select>

              <select
                value={currentSort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="px-3.5 py-2.5 rounded-2xl bg-parchment-50 border border-parchment-200 text-espresso-900 text-xs sm:text-sm focus:outline-none focus:border-henna-700 cursor-pointer"
              >
                <option value="latest">Newest Additions</option>
                <option value="popular">Most Popular / Liked</option>
                <option value="views">Most Viewed</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Pills Slider */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
            <button
              onClick={() => updateFilter('category', 'all')}
              className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all ${
                currentCategory === 'all'
                  ? 'bg-henna-700 text-white shadow-soft-sm'
                  : 'bg-parchment-100 hover:bg-parchment-200 text-espresso-800'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => updateFilter('category', cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-medium shrink-0 transition-all ${
                  currentCategory === cat.slug
                    ? 'bg-henna-700 text-white shadow-soft-sm font-semibold'
                    : 'bg-parchment-100 hover:bg-parchment-200 text-espresso-800'
                }`}
              >
                {cat.name} ({cat.designCount || 0})
              </button>
            ))}
          </div>
        </div>

        {/* Designs Content Grid */}
        {loading ? (
          <LoadingSkeleton count={8} />
        ) : designs.length === 0 ? (
          <EmptyState
            title="No Mehndi designs matched your criteria"
            description="Try changing or clearing your search keywords and filters to browse other designs."
            actionText="Clear All Filters"
            onAction={() => setSearchParams({})}
          />
        ) : (
          <div className="space-y-10">
            <DesignGrid
              designs={designs}
              onQuickView={(d) => setQuickViewDesign(d)}
            />

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                {Array.from({ length: pagination.pages }).map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => {
                        const newParams = new URLSearchParams(searchParams);
                        newParams.set('page', String(pNum));
                        setSearchParams(newParams);
                        window.scrollTo({ top: 150, behavior: 'smooth' });
                      }}
                      className={`w-10 h-10 rounded-xl text-xs font-semibold transition-all ${
                        currentPage === pNum
                          ? 'bg-henna-700 text-white shadow-soft-sm'
                          : 'bg-white text-espresso-800 hover:bg-parchment-100 border border-parchment-200'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      <DesignQuickViewModal
        isOpen={Boolean(quickViewDesign)}
        onClose={() => setQuickViewDesign(null)}
        design={quickViewDesign}
      />
    </div>
  );
};

export default Gallery;

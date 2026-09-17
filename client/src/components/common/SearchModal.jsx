import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { designsApi, categoriesApi } from '../../api';

export const SearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      fetchQuickCategories();
    } else {
      setSearchTerm('');
      setResults([]);
    }
  }, [isOpen]);

  const fetchQuickCategories = async () => {
    try {
      const res = await categoriesApi.getCategories();
      if (res.success) {
        setCategories(res.data.slice(0, 6));
      }
    } catch (err) {
      // Ignore
    }
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await designsApi.getDesigns({
          search: searchTerm.trim(),
          limit: 5,
        });
        if (res.success) {
          setResults(res.data.designs || []);
        }
      } catch (err) {
        console.warn('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSelect = (slug) => {
    onClose();
    navigate(`/designs/${slug}`);
  };

  const handleFullSearch = () => {
    if (searchTerm.trim()) {
      onClose();
      navigate(`/gallery?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm"
        />

        {/* Search Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-soft-lg border border-parchment-200 z-10 overflow-hidden"
        >
          {/* Search Input Bar */}
          <div className="flex items-center px-5 py-4 border-b border-parchment-200 bg-parchment-50">
            <Search className="w-5 h-5 text-espresso-700 mr-3 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search by design name, bridal, arabic, mandala, tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleFullSearch();
                if (e.key === 'Escape') onClose();
              }}
              className="w-full bg-transparent text-espresso-900 placeholder:text-espresso-700/60 text-base focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="p-1 rounded-full text-espresso-700 hover:text-espresso-900 hover:bg-parchment-200 mr-2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-xs font-semibold px-2 py-1 rounded bg-parchment-200/80 text-espresso-700 uppercase"
            >
              ESC
            </button>
          </div>

          {/* Results / Suggestions */}
          <div className="p-5 max-h-[60vh] overflow-y-auto">
            {loading && (
              <div className="py-8 text-center text-espresso-700 text-sm animate-pulse flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-500 animate-spin" />
                <span>Searching our Mehndi portfolio...</span>
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="space-y-2.5">
                <div className="text-xs font-semibold text-espresso-700 uppercase tracking-wider mb-2">
                  Designs Found
                </div>
                {results.map((design) => (
                  <div
                    key={design._id}
                    onClick={() => handleSelect(design.slug)}
                    className="flex items-center gap-3.5 p-2.5 rounded-2xl hover:bg-parchment-100 cursor-pointer transition-colors group"
                  >
                    <img
                      src={design.images?.[0]}
                      alt={design.title}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-medium text-espresso-900 text-sm group-hover:text-henna-700 transition-colors truncate">
                        {design.title}
                      </h4>
                      <p className="text-xs text-espresso-700">
                        {design.category?.name} • ₹{design.price} • {design.difficulty}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-espresso-700/50 group-hover:text-henna-700 group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                ))}

                <button
                  onClick={handleFullSearch}
                  className="w-full mt-3 py-2.5 text-center text-xs font-semibold text-henna-700 bg-parchment-100 hover:bg-parchment-200 rounded-xl transition-colors"
                >
                  View all results for "{searchTerm}" →
                </button>
              </div>
            )}

            {!loading && searchTerm.trim() && results.length === 0 && (
              <div className="py-8 text-center text-espresso-700 text-sm">
                No designs matched "{searchTerm}". Try searching for 'Bridal', 'Arabic', or 'Mandala'.
              </div>
            )}

            {/* Popular Category Shortcuts */}
            {!searchTerm && (
              <div>
                <div className="text-xs font-semibold text-espresso-700 uppercase tracking-wider mb-3">
                  Popular Categories
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => {
                        onClose();
                        navigate(`/gallery?category=${cat.slug}`);
                      }}
                      className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-parchment-100 hover:bg-parchment-200 text-espresso-800 border border-parchment-200/80 transition-all hover:scale-105"
                    >
                      {cat.name}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/try-on');
                    }}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-accent-400/20 text-henna-700 border border-accent-400/40 hover:bg-accent-400/30 transition-all"
                  >
                    ✨ Virtual Try-On
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SearchModal;

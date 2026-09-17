import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoriesApi } from '../api';
import { ArrowRight, Sparkles } from 'lucide-react';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import SEO from '../components/common/SEO';

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoriesApi.getCategories();
        if (res.success) {
          setCategories(res.data);
        }
      } catch (err) {
        console.warn('Error loading categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <SEO
        title="Mehndi Design Categories"
        description="Explore Bridal, Arabic, Indo-Arabic, Rajasthani, Mandala, and Minimal Mehndi categories by Shreya's Mehndi Zone."
      />

      <div className="min-h-screen bg-parchment-50 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">
              Style Collections
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-espresso-900">
              Mehndi Categories
            </h1>
            <p className="text-espresso-700 text-sm leading-relaxed">
              Explore our diverse genres of henna art—from timeless Marwari heritage traditions to chic contemporary minimalism.
            </p>
          </div>

          {loading ? (
            <LoadingSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/gallery?category=${cat.slug}`}
                  className="group bg-white rounded-3xl overflow-hidden border border-parchment-200/90 shadow-soft-sm hover:shadow-soft-md transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-parchment-100 relative">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-espresso-900 shadow-soft-sm">
                      {cat.designCount || 0} Designs
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-xl font-semibold text-espresso-900 group-hover:text-henna-700 transition-colors mb-2">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-espresso-700 leading-relaxed line-clamp-2">
                        {cat.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-parchment-200/60 flex items-center justify-between text-xs font-semibold text-henna-700">
                      <span>Explore Collection</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Categories;

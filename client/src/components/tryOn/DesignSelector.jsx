import React, { useState, useEffect } from 'react';
import { designsApi } from '../../api';
import { Sparkles, Check } from 'lucide-react';

const OVERLAY_PRESETS = [
  {
    id: 'mandala-royal',
    title: 'Royal Sunburst Mandala',
    category: 'Mandala',
    overlayUrl: '/overlays/mandala-royal.svg',
    price: 1800,
  },
  {
    id: 'arabic-vine',
    title: 'Dubai Flowing Arabic Vine',
    category: 'Arabic',
    overlayUrl: '/overlays/arabic-vine.svg',
    price: 2200,
  },
  {
    id: 'bridal-cuff',
    title: 'Imperial Bridal Wrist Cuff',
    category: 'Bridal',
    overlayUrl: '/overlays/bridal-cuff.svg',
    price: 3500,
  },
  {
    id: 'finger-accent',
    title: 'Boho Knuckle & Ring Accent',
    category: 'Finger',
    overlayUrl: '/overlays/finger-accent.svg',
    price: 1200,
  },
  {
    id: 'classic-floral',
    title: 'Sacred Lotus & Floral Trail',
    category: 'Traditional',
    overlayUrl: '/overlays/classic-floral.svg',
    price: 2600,
  },
];

export const DesignSelector = ({ selectedDesign, onSelectDesign }) => {
  const [designs, setDesigns] = useState(OVERLAY_PRESETS);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchApiDesigns = async () => {
      try {
        const res = await designsApi.getDesigns({ limit: 16 });
        if (res.success && res.data.designs?.length > 0) {
          const withOverlays = res.data.designs.map((d) => ({
            id: d._id,
            title: d.title,
            category: d.category?.name || 'Bridal',
            overlayUrl: d.overlayImage || '/overlays/mandala-royal.svg',
            thumbnail: d.images?.[0],
            price: d.price,
            rawDesign: d,
          }));
          // Merge presets and API designs
          setDesigns([...OVERLAY_PRESETS, ...withOverlays]);
        }
      } catch (err) {
        // Fallback to presets
      }
    };
    fetchApiDesigns();
  }, []);

  const categories = ['All', 'Mandala', 'Arabic', 'Bridal', 'Finger', 'Traditional'];

  const filteredDesigns = designs.filter((d) => {
    if (activeCategory === 'All') return true;
    return d.category.toLowerCase().includes(activeCategory.toLowerCase());
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-serif text-sm font-semibold text-espresso-900">
          Select Mehndi Pattern
        </h4>
        <span className="text-[11px] text-espresso-700">
          {filteredDesigns.length} transparent overlays available
        </span>
      </div>

      {/* Category Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-all ${
              activeCategory === cat
                ? 'bg-henna-700 text-white shadow-soft-sm'
                : 'bg-parchment-100 hover:bg-parchment-200 text-espresso-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Designs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
        {filteredDesigns.map((d) => {
          const isSelected = selectedDesign?.id === d.id || selectedDesign?.overlayUrl === d.overlayUrl;
          return (
            <button
              key={d.id}
              onClick={() => onSelectDesign(d)}
              className={`p-2 rounded-2xl border-2 transition-all text-left flex flex-col items-center group relative ${
                isSelected
                  ? 'border-henna-700 bg-henna-50/60 shadow-soft-sm'
                  : 'border-parchment-200 hover:border-accent-400 bg-white'
              }`}
            >
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-henna-700 text-white flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
              )}

              <div className="w-full aspect-square rounded-xl bg-parchment-50 p-2 flex items-center justify-center overflow-hidden mb-1.5 border border-parchment-200/50">
                <img
                  src={d.overlayUrl}
                  alt={d.title}
                  className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform"
                />
              </div>

              <span className="text-xs font-serif font-medium text-espresso-900 line-clamp-1 text-center w-full">
                {d.title}
              </span>
              <span className="text-[10px] text-henna-700 font-semibold mt-0.5">
                ₹{d.price}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DesignSelector;

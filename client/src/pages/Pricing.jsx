import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pricingApi } from '../api';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import SEO from '../components/common/SEO';
import { Check, Sparkles, Clock, Calendar } from 'lucide-react';

export const Pricing = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await pricingApi.getPricing();
        if (res.success) {
          setPackages(res.data);
        }
      } catch (err) {
        console.warn('Pricing load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPricing();
  }, []);

  return (
    <>
      <SEO
        title="Pricing & Packages | Transparent Mehndi Rates"
        description="Explore our transparent Mehndi packages for Bridal, Engagement, Sangeet, and Festive occasions. No hidden fees."
      />

      <div className="min-h-screen bg-parchment-50 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">
              Clear & Transparent Rates
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-espresso-900">
              Mehndi Packages & Pricing
            </h1>
            <p className="text-espresso-700 text-sm leading-relaxed">
              Every package is backed by 100% certified chemical-free organic henna cones, pre-wedding consultation, and complete aftercare.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-stretch">
            {packages.map((pkg) => (
              <div
                key={pkg._id}
                className={`bg-white rounded-3xl p-6 sm:p-7 border flex flex-col justify-between shadow-soft-sm relative transition-all duration-300 hover:shadow-soft-md ${
                  pkg.isPopular
                    ? 'border-2 border-henna-700 shadow-soft-md scale-105 z-10'
                    : 'border-parchment-200'
                }`}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-henna-700 text-white text-[11px] font-bold uppercase tracking-wider shadow-soft-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-accent-400" />
                    <span>Most Popular</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-espresso-900 mb-1">
                      {pkg.title}
                    </h3>
                    {pkg.serviceName && (
                      <span className="text-xs text-espresso-700 block">
                        {pkg.serviceName}
                      </span>
                    )}
                  </div>

                  <div className="py-2 border-y border-parchment-200">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-serif font-bold text-henna-800">
                        ₹{pkg.price}
                      </span>
                      <span className="text-xs text-espresso-700 font-medium">
                        / {pkg.priceType || 'Package'}
                      </span>
                    </div>
                    {pkg.discount && (
                      <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {pkg.discount}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-xs text-espresso-700">
                    <Clock className="w-3.5 h-3.5 text-accent-600" />
                    <span>Duration: {pkg.duration}</span>
                  </div>

                  {/* Feature Checklist */}
                  <div className="pt-2 space-y-2.5">
                    <span className="text-xs font-semibold text-espresso-900 uppercase tracking-wider block">
                      Inclusions:
                    </span>
                    {pkg.features?.map((f, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-xs text-espresso-800"
                      >
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-parchment-200">
                  <Link
                    to={`/book?title=${encodeURIComponent(pkg.title)}&budget=₹${pkg.price}`}
                    className="block w-full"
                  >
                    <Button
                      variant={pkg.isPopular ? 'primary' : 'outline'}
                      size="md"
                      className="w-full"
                    >
                      Book This Package
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Custom Package CTA banner */}
          <div className="bg-parchment-100 rounded-3xl p-8 sm:p-10 border border-parchment-200 text-center space-y-3">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-espresso-900">
              Need a Custom Group or Destination Wedding Package?
            </h3>
            <p className="text-xs sm:text-sm text-espresso-700 max-w-xl mx-auto">
              We travel across India for destination weddings (Udaipur, Jaipur, Goa, Surat, Mumbai). Contact us with your guest count for bespoke team quotations.
            </p>
            <div className="pt-2">
              <Link to="/contact">
                <Button variant="secondary" size="md">
                  Inquire for Custom Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pricing;

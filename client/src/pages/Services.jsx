import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { servicesApi } from '../api';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import SEO from '../components/common/SEO';
import { Clock, Check, Sparkles, Calendar } from 'lucide-react';

export const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await servicesApi.getServices();
        if (res.success) {
          setServices(res.data);
        }
      } catch (err) {
        console.warn('Services load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <>
      <SEO
        title="Mehndi Services & Packages"
        description="Discover our professional Mehndi services for Royal Bridal, Engagement, Sangeet Parties, Baby Showers, and Festive celebrations."
      />

      <div className="min-h-screen bg-parchment-50 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">
              Artisan Services
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-espresso-900">
              Our Mehndi Services
            </h1>
            <p className="text-espresso-700 text-sm leading-relaxed">
              Bespoke henna packages designed to bring royal splendour, emotional storytelling, and effortless beauty to your celebrations.
            </p>
          </div>

          <div className="space-y-8">
            {services.map((srv, idx) => (
              <div
                key={srv._id}
                className={`bg-white rounded-3xl border border-parchment-200/90 shadow-soft-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center ${
                  idx % 2 === 1 ? 'lg:grid-flow-dense' : ''
                }`}
              >
                {/* Image */}
                <div
                  className={`lg:col-span-5 aspect-[16/11] lg:aspect-auto lg:h-full overflow-hidden bg-parchment-100 ${
                    idx % 2 === 1 ? 'lg:col-start-8' : ''
                  }`}
                >
                  <img
                    src={srv.image}
                    alt={srv.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div
                  className={`lg:col-span-7 p-6 sm:p-10 space-y-4 ${
                    idx % 2 === 1 ? 'lg:col-start-1' : ''
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-accent-600 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Duration: {srv.duration}
                    </span>
                    <span className="text-lg font-serif font-bold text-henna-800">
                      Starting from ₹{srv.startingPrice}
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-espresso-900">
                    {srv.title}
                  </h2>

                  <p className="text-espresso-700 text-sm leading-relaxed">
                    {srv.description}
                  </p>

                  {/* Features list */}
                  {srv.features && srv.features.length > 0 && (
                    <div className="pt-2">
                      <h4 className="text-xs font-semibold text-espresso-900 mb-2 uppercase tracking-wider">
                        Package Inclusions:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {srv.features.map((feature, fIdx) => (
                          <div
                            key={fIdx}
                            className="flex items-center gap-2 text-xs text-espresso-800"
                          >
                            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 flex flex-wrap gap-3">
                    <Link
                      to={`/book?service=${srv._id}&title=${encodeURIComponent(srv.title)}`}
                    >
                      <Button variant="primary" size="md" icon={Calendar}>
                        Book This Service
                      </Button>
                    </Link>

                    <Link to="/pricing">
                      <Button variant="outline" size="md">
                        Compare Packages
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;

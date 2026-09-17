import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import BookingForm from '../components/booking/BookingForm';
import { Calendar, ShieldCheck, Clock, Sparkles } from 'lucide-react';
import SEO from '../components/common/SEO';

export const Booking = () => {
  const [searchParams] = useSearchParams();
  const preselectedDesignId = searchParams.get('design');
  const preselectedTitle = searchParams.get('title');

  return (
    <>
      <SEO
        title="Book Appointment | Bridal & Event Mehndi"
        description="Book your bridal, engagement, sangeet, or festive Mehndi appointment online with Shreya's Mehndi Zone."
      />

      <div className="min-h-screen bg-parchment-50 py-10 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500/15 border border-accent-400/40 text-henna-800 text-xs font-semibold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-accent-600" />
              <span>Reserve Your Date</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-espresso-900">
              Book Your Mehndi Appointment
            </h1>
            <p className="text-espresso-700 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              Fill out the details below to request your booking. We will review your dates, design preferences, and contact you promptly.
            </p>
          </div>

          {/* Booking Form Card */}
          <BookingForm
            preselectedDesignId={preselectedDesignId}
            preselectedTitle={preselectedTitle}
          />

          {/* FAQs / Guarantees Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-center">
            <div className="p-4 rounded-2xl bg-white border border-parchment-200 shadow-soft-sm space-y-1">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto" />
              <h4 className="font-serif text-sm font-semibold text-espresso-900">
                100% Organic Henna
              </h4>
              <p className="text-[11px] text-espresso-700">
                Safe for sensitive skin with no synthetic chemicals.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-parchment-200 shadow-soft-sm space-y-1">
              <Clock className="w-5 h-5 text-accent-600 mx-auto" />
              <h4 className="font-serif text-sm font-semibold text-espresso-900">
                Timely & Reliable
              </h4>
              <p className="text-[11px] text-espresso-700">
                We arrive at least 20 minutes prior to ceremony start.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-parchment-200 shadow-soft-sm space-y-1">
              <Sparkles className="w-5 h-5 text-henna-700 mx-auto" />
              <h4 className="font-serif text-sm font-semibold text-espresso-900">
                Bespoke Customization
              </h4>
              <p className="text-[11px] text-espresso-700">
                Initials and couple portraits incorporated on request.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Booking;

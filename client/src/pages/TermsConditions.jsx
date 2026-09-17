import React from 'react';
import SEO from '../components/common/SEO';

export const TermsConditions = () => {
  return (
    <>
      <SEO title="Terms & Conditions" />
      <div className="min-h-screen bg-parchment-50 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-3xl p-8 sm:p-12 border border-parchment-200 shadow-soft-sm space-y-6 text-espresso-800 text-sm leading-relaxed">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-900">
            Terms & Conditions
          </h1>
          <p className="text-xs text-espresso-700">Effective Date: January 1, 2026</p>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-espresso-900">
              1. Appointments & Confirmations
            </h2>
            <p>
              Submitting a booking request through our online portal constitutes an inquiry. An appointment is confirmed once our studio contacts you and mutually agreed dates, timings, and advance deposits (where applicable) are recorded.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-espresso-900">
              2. Stain Variations
            </h2>
            <p>
              Because our henna is 100% natural and organic, final stain color and intensity depend upon skin chemistry, body temperature, duration of paste retention, and adherence to our aftercare guidelines.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-espresso-900">
              3. Copyright & Photography
            </h2>
            <p>
              All Mehndi compositions, portfolio photography, and transparent design assets showcased on this platform remain the intellectual property of Shreya's Mehndi Zone.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default TermsConditions;

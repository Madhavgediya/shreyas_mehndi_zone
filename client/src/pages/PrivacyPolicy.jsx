import React from 'react';
import SEO from '../components/common/SEO';

export const PrivacyPolicy = () => {
  return (
    <>
      <SEO title="Privacy Policy" />
      <div className="min-h-screen bg-parchment-50 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-3xl p-8 sm:p-12 border border-parchment-200 shadow-soft-sm space-y-6 text-espresso-800 text-sm leading-relaxed">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-900">
            Privacy Policy
          </h1>
          <p className="text-xs text-espresso-700">Effective Date: January 1, 2026</p>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-espresso-900">
              1. Information We Collect
            </h2>
            <p>
              When you submit an appointment booking, contact inquiry, or review on Shreya's Mehndi Zone, we collect your name, phone number, email address, event date, and location strictly for scheduling and providing our henna design services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-espresso-900">
              2. Virtual Mehndi Try-On Photos
            </h2>
            <p>
              Photos uploaded to our Virtual Try-On tool are processed locally in your web browser canvas. We do not store or sell your personal hand photos without your explicit consent.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-espresso-900">
              3. Protection of Your Data
            </h2>
            <p>
              We implement industry-standard security safeguards, secure JWT tokens, and encrypted database connections to protect your personal details. We never sell or share your contact data with third-party advertisers.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;

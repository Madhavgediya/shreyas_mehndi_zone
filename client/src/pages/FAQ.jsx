import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import SEO from '../components/common/SEO';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const FAQS = [
  {
    q: 'How far in advance should I book my bridal Mehndi?',
    a: 'We strongly recommend booking 3 to 6 months in advance, especially during the auspicious wedding seasons (October through March). Popular dates fill up fast as bridal henna requires dedicated full-day artist focus.',
  },
  {
    q: 'How does your henna achieve such a deep mahogany stain?',
    a: 'All our henna paste is hand-mixed fresh before every session using triple-filtered 100% organic Rajasthani henna powder, pure organic eucalyptus and tea tree essential oils, and lemon juice. We never use chemicals, black henna dyes, or artificial colorants.',
  },
  {
    q: 'How should I care for my bridal Mehndi after application?',
    a: 'Allow the paste to dry naturally for 30 minutes, then apply our complimentary lemon-sugar sealant glaze. Keep the crust on for 6-8 hours (ideally overnight). Scrape it off gently without washing with water for the first 12-24 hours. Full oxidation color matures after 48 hours.',
  },
  {
    q: 'Do you travel for destination weddings outside Surat?',
    a: 'Yes! Shreya and her team travel nationwide (Udaipur, Jaipur, Mumbai, Goa, Delhi) and internationally for destination wedding events. Client covers travel and accommodation expenses.',
  },
  {
    q: 'Can you include custom portraits and groom initials in my design?',
    a: 'Absolutely! Personalized sketches (Bride & Groom portraits, bridal baraat, elephant crests, dates, and hidden initials) are our hallmark specialty. You can provide your photos beforehand.',
  },
  {
    q: 'How does the Virtual Mehndi Try-On tool work?',
    a: 'Our online Try-On tool lets you upload a photo of your palm or arm from your phone or computer, select a transparent Mehndi design, drag and resize it to test the look before your appointment. It is completely free to use!',
  },
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <>
      <SEO
        title="Frequently Asked Questions (FAQ)"
        description="Find answers about bridal Mehndi preparation, stain aftercare, destination wedding travel, and bookings."
      />

      <div className="min-h-screen bg-parchment-50 py-10 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent-600 block">
              Helpful Guidance
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-espresso-900">
              Frequently Asked Questions
            </h1>
            <p className="text-espresso-700 text-xs sm:text-sm max-w-lg mx-auto">
              Everything you need to know about preparing for your Mehndi appointment and achieving the darkest natural stain.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-parchment-200 shadow-soft-sm divide-y divide-parchment-200">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="py-4 first:pt-0 last:pb-0">
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                  className="w-full flex items-center justify-between text-left gap-4 group"
                >
                  <span className="font-serif text-base sm:text-lg font-semibold text-espresso-900 group-hover:text-henna-700 transition-colors">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-espresso-700 shrink-0 transition-transform duration-200 ${
                      openIndex === idx ? 'rotate-180 text-henna-700' : ''
                    }`}
                  />
                </button>

                {openIndex === idx && (
                  <p className="text-xs sm:text-sm text-espresso-700 mt-3 leading-relaxed animate-in fade-in duration-200">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <p className="text-xs text-espresso-700 mb-3">
              Still have a specific question about your big day?
            </p>
            <Link to="/contact">
              <Button variant="outline" size="sm">
                Ask Us Directly
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ;

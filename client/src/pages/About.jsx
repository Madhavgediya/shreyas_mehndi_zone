import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import Button from '../components/common/Button';
import SEO from '../components/common/SEO';
import { Award, Leaf, Heart, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

export const About = () => {
  const { settings } = useSettings();

  return (
    <>
      <SEO
        title="About Shreya Gediya | The Mehndi Artist"
        description="Learn about Shreya Gediya's 8+ year journey as a bespoke bridal Mehndi designer and our commitment to 100% organic henna."
      />

      <div className="min-h-screen bg-parchment-50 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Top Story Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Image Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-soft-lg border-4 border-white">
                  <img
                    src="/images/real/bridal-groom-portrait-blessing.jpg"
                    alt="Shreya Gediya - Mehndi Artistry"
                    className="w-full h-full object-cover object-top"
                  />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-5 rounded-3xl shadow-soft-md border border-parchment-200 hidden sm:block max-w-[220px]">
                <span className="text-3xl font-serif font-bold text-henna-800 block">
                  8+ Years
                </span>
                <span className="text-xs text-espresso-700">
                  Crafting Timeless Bridal Memories Across India
                </span>
              </div>
            </div>

            {/* Right Story Text */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500/15 border border-accent-400/40 text-henna-800 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-accent-600" />
                <span>Our Heritage & Vision</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-espresso-900 leading-tight">
                Crafting Timeless Stories, One Stroke at a Time
              </h1>

              <p className="text-espresso-700 text-sm sm:text-base leading-relaxed">
                {settings.aboutText ||
                  "At Shreya's Mehndi Zone, we believe every stroke of henna tells a unique story of joy, heritage, and timeless celebration. We combine 100% certified organic Rajasthani henna leaves with immaculate precision, modern negative-space flair, and cherished traditional motifs."}
              </p>

              <p className="text-espresso-700 text-sm leading-relaxed">
                Founded by <strong>{settings.artistName || 'Shreya Gediya'}</strong>, our studio has had the privilege of adorning over 250 brides across Gujarat, Rajasthan, and international destination weddings. Every composition is tailored individually to weave couple monograms, portrait sketches, and auspicious wedding iconography into a living work of art.
              </p>

              {/* Core Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                <div className="flex items-center gap-2.5 text-xs font-medium text-espresso-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Triple-Filtered Rajasthani Organic Henna</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-medium text-espresso-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Custom Bride & Groom Portrait Sketches</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-medium text-espresso-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>On-Location Bridal Travel Across India</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-medium text-espresso-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Guaranteed Deep Mahogany Staining</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link to="/gallery">
                  <Button variant="primary" size="md">
                    Explore Our Gallery
                  </Button>
                </Link>
                <Link to="/book">
                  <Button variant="secondary" size="md">
                    Book an Appointment
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Henna Philosophy Section */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-parchment-200/90 shadow-soft-sm grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-espresso-900">
                100% Organic Henna
              </h3>
              <p className="text-xs text-espresso-700 leading-relaxed">
                We prepare all henna cones in-house with certified pure Lawsonia Inermis, fresh lemon juice, eucalyptus oil, and sugar—strictly 0% PPD or chemical additives.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-espresso-900">
                Immaculate Symmetry
              </h3>
              <p className="text-xs text-espresso-700 leading-relaxed">
                Trained in both fine arts and classical Indian iconography, every jali line and scallop petal is drawn with microscopic accuracy and balanced flow.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-espresso-900">
                Personalized Care
              </h3>
              <p className="text-xs text-espresso-700 leading-relaxed">
                From pre-wedding patch tests to post-application clove steaming and aftercare kits, we ensure your wedding day is comfortable and stress-free.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Youtube,
  Heart,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const Footer = () => {
  const { settings, getWhatsAppLink } = useSettings();

  return (
    <footer className="bg-[#231A13] text-parchment-100/90 pt-16 pb-8 border-t border-[#3D2F24]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-[#3D2F24]">
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-accent-500 text-espresso-900 flex items-center justify-center font-serif text-lg font-bold">
                S
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-parchment-50">
                {settings.businessName || "Shreya's Mehndi Zone"}
              </span>
            </Link>

            <p className="text-sm text-parchment-200/70 leading-relaxed max-w-sm">
              {settings.artistBio ||
                'Crafting timeless bridal & designer henna with organic formulations and bespoke love story portraits.'}
            </p>

            <div className="flex items-center gap-3 pt-2">
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#34271D] hover:bg-accent-500 hover:text-espresso-900 flex items-center justify-center transition-all duration-200 text-parchment-100"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#34271D] hover:bg-accent-500 hover:text-espresso-900 flex items-center justify-center transition-all duration-200 text-parchment-100"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#34271D] hover:bg-accent-500 hover:text-espresso-900 flex items-center justify-center transition-all duration-200 text-parchment-100"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-serif text-base font-medium text-parchment-50 mb-4 tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-parchment-200/80">
              <li>
                <Link to="/gallery" className="hover:text-accent-400 transition-colors">
                  Mehndi Gallery
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-accent-400 transition-colors">
                  Design Categories
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-accent-400 transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-accent-400 transition-colors">
                  Pricing & Packages
                </Link>
              </li>
              <li>
                <Link to="/try-on" className="hover:text-accent-400 transition-colors flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-accent-400" />
                  <span>Virtual Try-On</span>
                </Link>
              </li>
              <li>
                <Link to="/book" className="hover:text-accent-400 transition-colors">
                  Book Appointment
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Styles & Occasions */}
          <div>
            <h4 className="font-serif text-base font-medium text-parchment-50 mb-4 tracking-wide">
              Specialties
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-parchment-200/80">
              <li>
                <Link to="/gallery?category=bridal-mehndi" className="hover:text-accent-400 transition-colors">
                  Royal Bridal Henna
                </Link>
              </li>
              <li>
                <Link to="/gallery?category=arabic-mehndi" className="hover:text-accent-400 transition-colors">
                  Arabic Floral Trails
                </Link>
              </li>
              <li>
                <Link to="/gallery?category=modern-mandala" className="hover:text-accent-400 transition-colors">
                  Symmetrical Mandalas
                </Link>
              </li>
              <li>
                <Link to="/gallery?category=traditional-rajasthani" className="hover:text-accent-400 transition-colors">
                  Rajasthani Marwari Art
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="hover:text-accent-400 transition-colors">
                  Client Testimonials
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-accent-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="space-y-3 text-xs sm:text-sm text-parchment-200/80">
            <h4 className="font-serif text-base font-medium text-parchment-50 mb-4 tracking-wide">
              Studio & Contact
            </h4>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-accent-400 shrink-0 mt-0.5" />
              <span>{settings.address || 'Heritage Mehndi Studio, Surat, Gujarat'}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-accent-400 shrink-0" />
              <a href={`tel:${settings.phone}`} className="hover:text-accent-400">
                {settings.phone}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-accent-400 shrink-0" />
              <a href={`mailto:${settings.email}`} className="hover:text-accent-400">
                {settings.email}
              </a>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-accent-400 shrink-0 mt-0.5" />
              <span>{settings.businessHours || 'Mon - Sun: 09:00 AM - 08:30 PM'}</span>
            </div>

            <div className="pt-2">
              <a
                href={getWhatsAppLink('inquiry')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-accent-400 hover:text-accent-300 font-medium underline"
              >
                Chat directly on WhatsApp <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-parchment-200/60">
          <p>{settings.footerText || "© 2026 Shreya's Mehndi Zone. All Rights Reserved."}</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-accent-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-conditions" className="hover:text-accent-400 transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/admin/login" className="hover:text-accent-400 transition-colors">
              Artist Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

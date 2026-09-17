import React, { createContext, useContext, useState, useEffect } from 'react';
import { settingsApi } from '../api';

const defaultSettings = {
  businessName: "Shreya's Mehndi Zone",
  tagline: 'Crafting Timeless Henna Art & Bridal Elegance',
  artistName: 'Shreya Gediya',
  artistBio: 'Award-winning professional bridal Mehndi artist with over 8 years of passion, crafting bespoke intricate designs for weddings and special celebrations.',
  phone: '+91 98765 43210',
  whatsappNumber: '+919876543210',
  email: 'hello@shreyasmehndizone.com',
  address: 'Heritage Mehndi Studio, Ring Road, Surat, Gujarat 395007',
  businessHours: 'Mon - Sun: 09:00 AM - 08:30 PM (By Appointment)',
  instagramUrl: 'https://instagram.com/shreyasmehndizone',
  facebookUrl: 'https://facebook.com/shreyasmehndizone',
  youtubeUrl: 'https://youtube.com/@shreyasmehndizone',
  heroTitle: 'Beautiful Mehndi, Crafted With Love',
  heroSubtitle: 'Elegant bridal, festive and traditional Mehndi designs created specially for your unforgettable moments.',
  aboutText: 'At Shreya\'s Mehndi Zone, we believe every stroke of henna tells a unique story of joy, heritage, and timeless celebration.',
  footerText: '© 2026 Shreya\'s Mehndi Zone. All Rights Reserved. Crafted with love & bridal sophistication.',
};

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await settingsApi.getSettings();
      if (res.success && res.data) {
        setSettings({ ...defaultSettings, ...res.data });
      }
    } catch (err) {
      console.warn('Using default site settings:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  /**
   * Generate a prefilled WhatsApp link with dynamic message
   * @param {string} type - 'inquiry' | 'design' | 'booking' | 'tryon'
   * @param {object} payload - dynamic parameters
   */
  const getWhatsAppLink = (type = 'inquiry', payload = {}) => {
    const rawNumber = settings.whatsappNumber || '+919876543210';
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');

    let text = '';
    if (type === 'design' && payload.title) {
      const pageUrl = payload.url || window.location.href;
      text = `Hello Shreya! I am interested in this Mehndi design:\n\n*Design:* ${payload.title}\n*Link:* ${pageUrl}\n\nPlease share more details and availability.`;
    } else if (type === 'booking' && payload.bookingId) {
      text = `Hello Shreya! I just submitted an appointment request on your website.\n\n*Booking ID:* ${payload.bookingId}\n*Name:* ${payload.name}\n*Event:* ${payload.eventType}\n*Date:* ${payload.date}\n\nLooking forward to confirming!`;
    } else if (type === 'tryon') {
      text = `Hello Shreya! I tried a Mehndi design on your website's Virtual Try-On tool and loved the preview! Can we discuss booking this pattern for my upcoming event?`;
    } else {
      text = `Hello Shreya! I visited your website (Shreya's Mehndi Zone) and would love to inquire about your Mehndi packages and date availability.`;
    }

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        refreshSettings: fetchSettings,
        getWhatsAppLink,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

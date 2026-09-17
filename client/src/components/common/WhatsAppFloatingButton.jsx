import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const WhatsAppFloatingButton = () => {
  const { getWhatsAppLink, settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenWhatsApp = (type) => {
    const link = getWhatsAppLink(type);
    window.open(link, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Popover Bubble */}
      {isOpen && (
        <div className="mb-3 w-72 bg-white rounded-2xl shadow-soft-lg border border-parchment-200 p-4 transition-all animate-in fade-in slide-in-from-bottom-3">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-parchment-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-semibold text-espresso-900">
                Chat with {settings.artistName || 'Shreya'}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-espresso-700 hover:text-espresso-900 p-1 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-espresso-700 mb-3 leading-relaxed">
            Need design advice or immediate bridal date availability? Say hello on WhatsApp!
          </p>

          <div className="space-y-1.5">
            <button
              onClick={() => handleOpenWhatsApp('inquiry')}
              className="w-full text-left text-xs px-3 py-2 rounded-xl bg-emerald-50 text-emerald-900 hover:bg-emerald-100 font-medium transition-colors"
            >
              💬 Check Date Availability
            </button>
            <button
              onClick={() => handleOpenWhatsApp('tryon')}
              className="w-full text-left text-xs px-3 py-2 rounded-xl bg-parchment-100 text-espresso-900 hover:bg-parchment-200 font-medium transition-colors"
            >
              ✨ Virtual Try-On Question
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-soft-lg flex items-center justify-center transition-all duration-200 hover:scale-105 group relative"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-white/20" />
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
        </span>
      </button>
    </div>
  );
};

export default WhatsAppFloatingButton;

import React, { useState } from 'react';
import Modal from './Modal';
import { Share2, MessageCircle, Facebook, Copy, Check } from 'lucide-react';
import { designsApi } from '../../api';
import { toast } from 'react-toastify';

export const ShareModal = ({ isOpen, onClose, design }) => {
  const [copied, setCopied] = useState(false);

  if (!design) return null;

  const currentUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/designs/${design.slug}`
      : `https://shreyasmehndizone.com/designs/${design.slug}`;

  const recordShareAction = async (platform) => {
    try {
      if (design._id) {
        await designsApi.recordShare(design._id, platform);
      }
    } catch (err) {
      console.warn('Share analytics error:', err.message);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      recordShareAction('CopyLink');
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleWhatsAppShare = () => {
    recordShareAction('WhatsApp');
    const msg = `Check out this gorgeous Mehndi design "*${design.title}*" by Shreya's Mehndi Zone:\n${currentUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleFacebookShare = () => {
    recordShareAction('Facebook');
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      '_blank'
    );
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: design.title,
          text: `Explore this stunning Mehndi design: ${design.title}`,
          url: currentUrl,
        });
        recordShareAction('NativeShare');
      } catch (err) {
        // User dismissed native share sheet
      }
    } else {
      handleCopy();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share This Design" maxWidth="max-w-md">
      <div className="space-y-6">
        {/* Design brief preview */}
        <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-parchment-100 border border-parchment-200">
          <img
            src={design.images?.[0] || 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=400&q=80'}
            alt={design.title}
            className="w-16 h-16 rounded-xl object-cover"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-serif text-sm font-medium text-espresso-900 truncate">
              {design.title}
            </h4>
            <p className="text-xs text-espresso-700 capitalize">
              {design.category?.name || 'Mehndi Design'}
            </p>
            <p className="text-xs font-semibold text-henna-700 mt-1">
              ₹{design.price}
            </p>
          </div>
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleWhatsAppShare}
            className="flex items-center justify-center gap-2.5 p-3.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100 transition-colors font-medium text-sm"
          >
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handleFacebookShare}
            className="flex items-center justify-center gap-2.5 p-3.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200/80 hover:bg-blue-100 transition-colors font-medium text-sm"
          >
            <Facebook className="w-5 h-5 text-blue-600" />
            <span>Facebook</span>
          </button>
        </div>

        {/* Copy Link bar */}
        <div>
          <label className="block text-xs font-medium text-espresso-700 mb-1.5">
            Design Page URL
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 px-3.5 py-2.5 text-xs rounded-xl bg-parchment-50 border border-parchment-200 text-espresso-800 select-all focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className={`px-4 py-2.5 text-xs font-medium rounded-xl flex items-center gap-1.5 transition-all ${
                copied
                  ? 'bg-emerald-700 text-white'
                  : 'bg-henna-700 hover:bg-henna-800 text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {typeof navigator !== 'undefined' && navigator.share && (
          <button
            onClick={handleNativeShare}
            className="w-full py-2.5 rounded-xl border border-henna-600/40 text-henna-700 hover:bg-henna-50 flex items-center justify-center gap-2 text-sm font-medium transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>More Sharing Options...</span>
          </button>
        )}
      </div>
    </Modal>
  );
};

export default ShareModal;

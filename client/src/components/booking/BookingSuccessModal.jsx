import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { CheckCircle2, MessageCircle, Calendar, ArrowRight, Copy } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const BookingSuccessModal = ({ isOpen, onClose, booking }) => {
  const { getWhatsAppLink } = useSettings();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      // Trigger festive confetti shower
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6B3E26', '#D4A373', '#C8A27A', '#8B5E3C'],
        });
      } catch (err) {
        // Ignore if unsupported
      }
    }
  }, [isOpen]);

  if (!booking) return null;

  const handleCopyBookingId = () => {
    navigator.clipboard.writeText(booking.bookingId);
    toast.success('Booking ID copied!');
  };

  const handleWhatsAppConfirm = () => {
    const link = getWhatsAppLink('booking', {
      bookingId: booking.bookingId,
      name: booking.name,
      eventType: booking.eventType,
      date: new Date(booking.eventDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    });
    window.open(link, '_blank');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="text-center space-y-5">
        {/* Animated Celebration Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-soft-sm animate-bounce">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div>
          <h3 className="text-2xl font-serif font-bold text-espresso-900">
            Booking Request Received!
          </h3>
          <p className="text-xs text-espresso-700 mt-1 leading-relaxed">
            Thank you, <span className="font-semibold">{booking.name}</span>. Shreya will review your request and contact you to finalize arrangements.
          </p>
        </div>

        {/* Unique Booking ID Badge */}
        <div className="p-3.5 rounded-2xl bg-parchment-100 border border-parchment-200 text-center">
          <span className="text-[11px] font-semibold text-espresso-700 uppercase tracking-wider block">
            Your Booking Reference Number
          </span>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-lg font-mono font-bold text-henna-800">
              {booking.bookingId}
            </span>
            <button
              onClick={handleCopyBookingId}
              className="p-1 rounded-md text-espresso-700 hover:text-henna-700 hover:bg-parchment-200"
              title="Copy ID"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Event Quick Summary */}
        <div className="text-left text-xs space-y-2 p-4 rounded-2xl bg-white border border-parchment-200 text-espresso-800">
          <div className="flex justify-between">
            <span className="text-espresso-700">Event:</span>
            <span className="font-medium">{booking.eventType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-espresso-700">Date & Slot:</span>
            <span className="font-medium">
              {new Date(booking.eventDate).toLocaleDateString()} ({booking.preferredTime})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-espresso-700">Location:</span>
            <span className="font-medium truncate max-w-[200px]">{booking.location}</span>
          </div>
          {booking.designTitle && (
            <div className="flex justify-between">
              <span className="text-espresso-700">Selected Design:</span>
              <span className="font-medium text-henna-700">{booking.designTitle}</span>
            </div>
          )}
        </div>

        {/* CTAs */}
        <div className="space-y-2 pt-2">
          <Button
            variant="secondary"
            className="w-full"
            icon={MessageCircle}
            onClick={handleWhatsAppConfirm}
          >
            Confirm Fast via WhatsApp
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              onClose();
              navigate('/gallery');
            }}
          >
            Explore More Designs
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BookingSuccessModal;

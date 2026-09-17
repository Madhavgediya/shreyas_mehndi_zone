import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { inquiriesApi } from '../api';
import { useSettings } from '../context/SettingsContext';
import Button from '../components/common/Button';
import SEO from '../components/common/SEO';
import { toast } from 'react-toastify';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  Sparkles,
} from 'lucide-react';

export const Contact = () => {
  const { settings, getWhatsAppLink } = useSettings();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await inquiriesApi.submit(data);
      if (res.success) {
        toast.success(res.message || 'Thank you! Your message was sent.');
        reset();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to send inquiry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact & Studio Location"
        description="Get in touch with Shreya's Mehndi Zone for bridal appointments, destination wedding inquiries, or studio visits."
      />

      <div className="min-h-screen bg-parchment-50 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">
              Get in Touch
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-espresso-900">
              Contact & Studio Visits
            </h1>
            <p className="text-espresso-700 text-xs sm:text-sm leading-relaxed">
              Have questions about customized bridal packages or travel availability? Reach out via form, phone, or instant WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Contact Info Card (Col 5) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-parchment-200 shadow-soft-sm space-y-6">
              <div className="space-y-2">
                <h3 className="font-serif text-xl font-bold text-espresso-900">
                  Studio Details
                </h3>
                <p className="text-xs text-espresso-700 leading-relaxed">
                  We welcome pre-wedding bridal consultations at our heritage studio by prior appointment.
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-espresso-800">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-parchment-100 text-henna-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-espresso-900 block">
                      Studio Address
                    </span>
                    <span className="text-espresso-700">
                      {settings.address || 'Heritage Mehndi Studio, Surat, Gujarat'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-parchment-100 text-henna-700 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-espresso-900 block">
                      Phone Number
                    </span>
                    <a href={`tel:${settings.phone}`} className="text-henna-700 hover:underline">
                      {settings.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-parchment-100 text-henna-700 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-espresso-900 block">
                      Email Address
                    </span>
                    <a href={`mailto:${settings.email}`} className="text-henna-700 hover:underline">
                      {settings.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-parchment-100 text-henna-700 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-espresso-900 block">
                      Operating Hours
                    </span>
                    <span className="text-espresso-700">
                      {settings.businessHours || 'Mon - Sun: 09:00 AM - 08:30 PM'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Fast WhatsApp Chat Banner */}
              <div className="pt-4 border-t border-parchment-200">
                <a
                  href={getWhatsAppLink('inquiry')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-soft-sm"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Connect with Shreya on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right: Interactive Contact Form (Col 7) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-parchment-200 shadow-soft-sm">
              <h3 className="font-serif text-xl font-bold text-espresso-900 mb-1">
                Send Us a Message
              </h3>
              <p className="text-xs text-espresso-700 mb-6">
                Fill out the form below and we will respond within 24 hours.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-espresso-800 mb-1">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Pooja Patel"
                      {...register('name', { required: 'Name is required' })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900 text-xs sm:text-sm focus:outline-none focus:border-henna-700"
                    />
                    {errors.name && (
                      <span className="text-red-500 text-[11px] mt-0.5 block">
                        {errors.name.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-espresso-800 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      {...register('phone', { required: 'Phone is required' })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900 text-xs sm:text-sm focus:outline-none focus:border-henna-700"
                    />
                    {errors.phone && (
                      <span className="text-red-500 text-[11px] mt-0.5 block">
                        {errors.phone.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-espresso-800 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="pooja@example.com"
                      {...register('email', { required: 'Email is required' })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900 text-xs sm:text-sm focus:outline-none focus:border-henna-700"
                    />
                    {errors.email && (
                      <span className="text-red-500 text-[11px] mt-0.5 block">
                        {errors.email.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-espresso-800 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Destination Wedding in Goa"
                      {...register('subject')}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900 text-xs sm:text-sm focus:outline-none focus:border-henna-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-espresso-800 mb-1">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Tell us about your event date, number of people, or specific design questions..."
                    {...register('message', { required: 'Message is required' })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900 text-xs sm:text-sm focus:outline-none focus:border-henna-700"
                  />
                  {errors.message && (
                    <span className="text-red-500 text-[11px] mt-0.5 block">
                      {errors.message.message}
                    </span>
                  )}
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    loading={loading}
                    icon={Send}
                    className="w-full sm:w-auto"
                  >
                    Send Message
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;

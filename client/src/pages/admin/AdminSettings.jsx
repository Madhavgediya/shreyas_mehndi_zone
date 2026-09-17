import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/common/Button';
import { settingsApi } from '../../api';
import { useSettings } from '../../context/SettingsContext';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Save, Sparkles, MessageCircle } from 'lucide-react';

export const AdminSettings = () => {
  const { settings, refreshSettings } = useSettings();
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (settings) {
      reset(settings);
    }
  }, [settings, reset]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const res = await settingsApi.updateSettings(data);
      if (res.success) {
        toast.success('Site settings updated! Public website reflects changes immediately.');
        refreshSettings();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Brand & Business Settings"
      subtitle="Customize studio details, WhatsApp number, hero text, and social links stored in MongoDB."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
        {/* General Business Info */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-parchment-200 shadow-soft-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-espresso-900 border-b border-parchment-200 pb-3">
            Studio Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-espresso-800 mb-1">
                Business Name
              </label>
              <input
                type="text"
                {...register('businessName')}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-espresso-800 mb-1">
                Lead Artist Name
              </label>
              <input
                type="text"
                {...register('artistName')}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-espresso-800 mb-1 flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp Number</span>
              </label>
              <input
                type="text"
                placeholder="+919876543210"
                {...register('whatsappNumber')}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900"
              />
              <span className="text-[10px] text-espresso-700 block mt-0.5">
                Powers all dynamic WhatsApp CTA links across the site.
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-espresso-800 mb-1">
                Public Phone
              </label>
              <input
                type="text"
                {...register('phone')}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-espresso-800 mb-1">
                Public Email
              </label>
              <input
                type="email"
                {...register('email')}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-espresso-800 mb-1">
              Studio Address
            </label>
            <input
              type="text"
              {...register('address')}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-espresso-800 mb-1">
              Business Hours
            </label>
            <input
              type="text"
              {...register('businessHours')}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900"
            />
          </div>
        </div>

        {/* Hero & About Copywriting */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-parchment-200 shadow-soft-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-espresso-900 border-b border-parchment-200 pb-3">
            Homepage & About Copy
          </h3>

          <div>
            <label className="block text-xs font-medium text-espresso-800 mb-1">
              Hero Section Title
            </label>
            <input
              type="text"
              {...register('heroTitle')}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-espresso-800 mb-1">
              Hero Subtitle
            </label>
            <textarea
              rows="2"
              {...register('heroSubtitle')}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-espresso-800 mb-1">
              About Philosophy Text
            </label>
            <textarea
              rows="3"
              {...register('aboutText')}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900"
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-parchment-200 shadow-soft-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-espresso-900 border-b border-parchment-200 pb-3">
            Social Media Links
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-espresso-800 mb-1">
                Instagram Profile URL
              </label>
              <input
                type="text"
                {...register('instagramUrl')}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-espresso-800 mb-1">
                Facebook Profile URL
              </label>
              <input
                type="text"
                {...register('facebookUrl')}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-espresso-800 mb-1">
                YouTube Channel URL
              </label>
              <input
                type="text"
                {...register('youtubeUrl')}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900"
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={Save}
            loading={saving}
          >
            Save All Settings
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminSettings;

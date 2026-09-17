import React, { useState, useEffect } from 'react';
import { testimonialsApi } from '../api';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import SEO from '../components/common/SEO';
import { Star, MessageSquarePlus, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

export const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchReviews = async () => {
    try {
      const res = await testimonialsApi.getApproved();
      if (res.success) {
        setTestimonials(res.data);
      }
    } catch (err) {
      console.warn('Reviews error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const onSubmitReview = async (data) => {
    setSubmitting(true);
    try {
      const res = await testimonialsApi.submit(data);
      if (res.success) {
        toast.success(res.message || 'Review submitted successfully!');
        reset();
        setSubmitModalOpen(false);
        fetchReviews();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Client Testimonials & Bride Reviews"
        description="Read heartfelt reviews and experiences from our brides and clients across India."
      />

      <div className="min-h-screen bg-parchment-50 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-parchment-200/80 pb-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-accent-600 block mb-1">
                Warm Feedback
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-espresso-900">
                Bride Reviews & Testimonials
              </h1>
              <p className="text-espresso-700 text-xs sm:text-sm mt-1 max-w-xl">
                Real words from brides and families whose special celebrations were graced by our henna artistry.
              </p>
            </div>

            <Button
              variant="secondary"
              size="md"
              icon={MessageSquarePlus}
              onClick={() => setSubmitModalOpen(true)}
            >
              Share Your Experience
            </Button>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((t) => (
              <div
                key={t._id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-parchment-200/90 shadow-soft-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex text-amber-500 text-sm">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>

                  <p className="text-espresso-800 text-sm leading-relaxed italic">
                    "{t.review}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-5 mt-4 border-t border-parchment-200">
                  <img
                    src={t.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover border border-parchment-200"
                  />
                  <div>
                    <h4 className="font-serif text-sm font-semibold text-espresso-900">
                      {t.name}
                    </h4>
                    <span className="text-[11px] text-espresso-700">
                      {t.eventType}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Review Modal */}
      <Modal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        title="Share Your Mehndi Experience"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit(onSubmitReview)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-espresso-800 mb-1">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Pooja Patel"
              {...register('name', { required: 'Name is required' })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900 text-sm focus:outline-none focus:border-henna-700"
            />
            {errors.name && (
              <span className="text-red-500 text-[11px] mt-0.5 block">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-espresso-800 mb-1">
                Event Type
              </label>
              <select
                {...register('eventType')}
                className="w-full px-3 py-2.5 rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900 text-sm focus:outline-none focus:border-henna-700"
              >
                <option value="Bridal Mehndi">Bridal Mehndi</option>
                <option value="Engagement">Engagement</option>
                <option value="Sangeet Party">Sangeet Party</option>
                <option value="Festival / Special">Festival Special</option>
                <option value="Baby Shower">Baby Shower</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-espresso-800 mb-1">
                Rating
              </label>
              <select
                {...register('rating')}
                className="w-full px-3 py-2.5 rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900 text-sm focus:outline-none focus:border-henna-700"
              >
                <option value="5">★★★★★ (5 Stars)</option>
                <option value="4">★★★★☆ (4 Stars)</option>
                <option value="3">★★★☆☆ (3 Stars)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-espresso-800 mb-1">
              Your Review & Feedback <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="4"
              placeholder="Tell us about the design precision, stain development, and artist experience..."
              {...register('review', { required: 'Review message is required' })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900 text-sm focus:outline-none focus:border-henna-700"
            />
            {errors.review && (
              <span className="text-red-500 text-[11px] mt-0.5 block">
                {errors.review.message}
              </span>
            )}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              loading={submitting}
            >
              Submit Review
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Testimonials;

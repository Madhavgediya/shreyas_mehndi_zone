import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { bookingsApi, designsApi, servicesApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import BookingSuccessModal from './BookingSuccessModal';
import { toast } from 'react-toastify';
import { Calendar, Clock, MapPin, Users, Sparkles, Send } from 'lucide-react';

const EVENT_TYPES = [
  'Bridal Mehndi',
  'Engagement',
  'Sangeet / Wedding Party',
  'Festival / Karwa Chauth / Eid',
  'Baby Shower (Godh Bharai)',
  'Private / Family Session',
  'Corporate / Event Booking',
  'Other',
];

const TIME_SLOTS = [
  '09:00 AM - 12:00 PM (Morning Slot)',
  '12:30 PM - 03:30 PM (Afternoon Slot)',
  '04:00 PM - 07:00 PM (Evening Slot)',
  '07:30 PM - 10:30 PM (Night Special)',
];

export const BookingForm = ({ preselectedDesignId, preselectedTitle }) => {
  const { user } = useAuth();
  const [designs, setDesigns] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successBooking, setSuccessBooking] = useState(null);

  // Today's ISO date string YYYY-MM-DD for min date
  const today = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      eventType: 'Bridal Mehndi',
      eventDate: '',
      preferredTime: TIME_SLOTS[0],
      numberOfPeople: 1,
      location: '',
      selectedDesign: preselectedDesignId || '',
      designTitle: preselectedTitle || '',
      service: '',
      serviceName: '',
      budget: '',
      specialRequirements: '',
    },
  });

  useEffect(() => {
    if (user) {
      if (user.name) setValue('name', user.name);
      if (user.email) setValue('email', user.email);
      if (user.phone) setValue('phone', user.phone);
    }
  }, [user, setValue]);

  useEffect(() => {
    if (preselectedDesignId) {
      setValue('selectedDesign', preselectedDesignId);
    }
    if (preselectedTitle) {
      setValue('designTitle', preselectedTitle);
    }
  }, [preselectedDesignId, preselectedTitle, setValue]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [designsRes, servicesRes] = await Promise.all([
          designsApi.getDesigns({ limit: 30 }),
          servicesApi.getServices(),
        ]);
        if (designsRes.success) setDesigns(designsRes.data.designs || []);
        if (servicesRes.success) setServices(servicesRes.data || []);
      } catch (err) {
        // Fallback silently
      }
    };
    fetchOptions();
  }, []);

  const handleDesignChange = (e) => {
    const dId = e.target.value;
    const found = designs.find((d) => d._id === dId);
    setValue('selectedDesign', dId);
    setValue('designTitle', found ? found.title : '');
  };

  const handleServiceChange = (e) => {
    const sId = e.target.value;
    const found = services.find((s) => s._id === sId);
    setValue('service', sId);
    setValue('serviceName', found ? found.title : '');
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await bookingsApi.create(data);
      if (res.success) {
        setSuccessBooking(res.data);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit booking request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-3xl border border-parchment-200/90 shadow-soft-sm p-6 sm:p-10 space-y-8"
      >
        {/* Section 1: Contact Information */}
        <div>
          <h3 className="font-serif text-lg font-semibold text-espresso-900 mb-1">
            1. Your Contact Details
          </h3>
          <p className="text-xs text-espresso-700 mb-4">
            We will use these details to confirm your appointment and send updates.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-espresso-800 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Pooja Patel"
                {...register('name', { required: 'Name is required' })}
                className="w-full px-4 py-2.5 rounded-xl border border-parchment-200 bg-parchment-50/50 text-espresso-900 text-sm focus:outline-none focus:border-henna-700"
              />
              {errors.name && (
                <span className="text-red-500 text-[11px] mt-0.5 block">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-espresso-800 mb-1">
                Phone / WhatsApp <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="e.g. +91 98765 43210"
                {...register('phone', { required: 'Phone number is required' })}
                className="w-full px-4 py-2.5 rounded-xl border border-parchment-200 bg-parchment-50/50 text-espresso-900 text-sm focus:outline-none focus:border-henna-700"
              />
              {errors.phone && (
                <span className="text-red-500 text-[11px] mt-0.5 block">
                  {errors.phone.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-espresso-800 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="pooja@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address',
                  },
                })}
                className="w-full px-4 py-2.5 rounded-xl border border-parchment-200 bg-parchment-50/50 text-espresso-900 text-sm focus:outline-none focus:border-henna-700"
              />
              {errors.email && (
                <span className="text-red-500 text-[11px] mt-0.5 block">
                  {errors.email.message}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Event Details */}
        <div>
          <h3 className="font-serif text-lg font-semibold text-espresso-900 mb-1">
            2. Event & Schedule
          </h3>
          <p className="text-xs text-espresso-700 mb-4">
            Select the occasion, date, time slot, and venue location.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-espresso-800 mb-1">
                Event Type <span className="text-red-500">*</span>
              </label>
              <select
                {...register('eventType')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-parchment-200 bg-parchment-50/50 text-espresso-900 text-sm focus:outline-none focus:border-henna-700"
              >
                {EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-espresso-800 mb-1">
                Event Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                min={today}
                {...register('eventDate', { required: 'Event date is required' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-parchment-200 bg-parchment-50/50 text-espresso-900 text-sm focus:outline-none focus:border-henna-700"
              />
              {errors.eventDate && (
                <span className="text-red-500 text-[11px] mt-0.5 block">
                  {errors.eventDate.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-espresso-800 mb-1">
                Preferred Time Slot
              </label>
              <select
                {...register('preferredTime')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-parchment-200 bg-parchment-50/50 text-espresso-900 text-sm focus:outline-none focus:border-henna-700"
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-espresso-800 mb-1">
                Number of Guests
              </label>
              <input
                type="number"
                min="1"
                max="100"
                {...register('numberOfPeople')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-parchment-200 bg-parchment-50/50 text-espresso-900 text-sm focus:outline-none focus:border-henna-700"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-medium text-espresso-800 mb-1">
              Venue / Service Location Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Hotel / Banquet Hall Name, Area, City (or Studio Visit)"
              {...register('location', { required: 'Venue address is required' })}
              className="w-full px-4 py-2.5 rounded-xl border border-parchment-200 bg-parchment-50/50 text-espresso-900 text-sm focus:outline-none focus:border-henna-700"
            />
            {errors.location && (
              <span className="text-red-500 text-[11px] mt-0.5 block">
                {errors.location.message}
              </span>
            )}
          </div>
        </div>

        {/* Section 3: Design & Package Preferences */}
        <div>
          <h3 className="font-serif text-lg font-semibold text-espresso-900 mb-1">
            3. Design & Customization
          </h3>
          <p className="text-xs text-espresso-700 mb-4">
            Choose a Mehndi design or service package, or leave blank for a custom consultation.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-espresso-800 mb-1">
                Selected Mehndi Design (Optional)
              </label>
              <select
                value={watch('selectedDesign')}
                onChange={handleDesignChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-parchment-200 bg-parchment-50/50 text-espresso-900 text-sm focus:outline-none focus:border-henna-700"
              >
                <option value="">-- Choose from our Gallery --</option>
                {designs.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.title} (₹{d.price})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-espresso-800 mb-1">
                Service Package (Optional)
              </label>
              <select
                value={watch('service')}
                onChange={handleServiceChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-parchment-200 bg-parchment-50/50 text-espresso-900 text-sm focus:outline-none focus:border-henna-700"
              >
                <option value="">-- Choose a Service Package --</option>
                {services.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.title} (From ₹{s.startingPrice})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-medium text-espresso-800 mb-1">
                Estimated Budget (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. ₹5,000 - ₹10,000"
                {...register('budget')}
                className="w-full px-4 py-2.5 rounded-xl border border-parchment-200 bg-parchment-50/50 text-espresso-900 text-sm focus:outline-none focus:border-henna-700"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-espresso-800 mb-1">
                Special Customizations / Notes
              </label>
              <input
                type="text"
                placeholder="e.g. Bride-groom portraits, initials, organic dark stain cones"
                {...register('specialRequirements')}
                className="w-full px-4 py-2.5 rounded-xl border border-parchment-200 bg-parchment-50/50 text-espresso-900 text-sm focus:outline-none focus:border-henna-700"
              />
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-4 border-t border-parchment-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-espresso-700 text-center sm:text-left">
            🔒 No upfront payment required to request an appointment. We will confirm dates via call/WhatsApp.
          </p>

          <Button
            type="submit"
            size="lg"
            variant="primary"
            loading={loading}
            icon={Send}
            className="w-full sm:w-auto"
          >
            Submit Booking Request
          </Button>
        </div>
      </form>

      {/* Success Modal */}
      <BookingSuccessModal
        isOpen={Boolean(successBooking)}
        onClose={() => setSuccessBooking(null)}
        booking={successBooking}
      />
    </>
  );
};

export default BookingForm;

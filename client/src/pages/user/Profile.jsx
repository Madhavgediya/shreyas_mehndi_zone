import React, { useState, useEffect } from 'react';
import { bookingsApi, authApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import SEO from '../../components/common/SEO';
import { Calendar, Heart, Clock, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export const Profile = () => {
  const { user, updateUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const res = await bookingsApi.getMyBookings();
        if (res.success) {
          setBookings(res.data || []);
        }
      } catch (err) {
        console.warn('Error fetching personal bookings:', err);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchMyBookings();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await authApi.updateProfile({ name, phone });
      if (res.success) {
        updateUser(res.data);
        toast.success('Profile updated successfully!');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <>
      <SEO title="My Account & Bookings" />

      <div className="min-h-screen bg-parchment-50 py-10 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div>
            <h1 className="font-serif text-3xl font-bold text-espresso-900">
              My Account & Appointments
            </h1>
            <p className="text-xs sm:text-sm text-espresso-700 mt-1">
              Manage your personal information and track your appointment requests.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Profile Card (Col 4) */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-parchment-200 shadow-soft-sm space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-parchment-200">
                <div className="w-14 h-14 rounded-2xl bg-henna-700 text-white font-serif text-2xl font-bold flex items-center justify-center">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-espresso-900">
                    {user?.name}
                  </h3>
                  <span className="text-xs text-espresso-700">{user?.email}</span>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-espresso-800 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-espresso-800 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900"
                  />
                </div>

                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  className="w-full"
                  loading={savingProfile}
                >
                  Save Changes
                </Button>
              </form>

              <div className="pt-2 border-t border-parchment-200">
                <Link
                  to="/favorites"
                  className="flex items-center justify-between p-3 rounded-xl bg-parchment-100 hover:bg-parchment-200 text-xs font-medium text-espresso-900 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    <span>My Saved Mehndi Lookbook</span>
                  </span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Right: Booking History (Col 8) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-espresso-900">
                  Appointment History ({bookings.length})
                </h3>
                <Link to="/book">
                  <Button size="sm" variant="outline">
                    New Booking
                  </Button>
                </Link>
              </div>

              {loadingBookings ? (
                <div className="py-12 text-center text-xs text-espresso-700">
                  Loading your appointments...
                </div>
              ) : bookings.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 border border-parchment-200 text-center space-y-3 shadow-soft-sm">
                  <Calendar className="w-8 h-8 text-henna-700 mx-auto" />
                  <h4 className="font-serif text-base font-semibold text-espresso-900">
                    No bookings yet
                  </h4>
                  <p className="text-xs text-espresso-700 max-w-sm mx-auto">
                    Ready for your upcoming wedding or celebration? Submit an appointment request now.
                  </p>
                  <div className="pt-2">
                    <Link to="/book">
                      <Button size="sm" variant="primary">
                        Book Your First Appointment
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="bg-white rounded-2xl p-5 border border-parchment-200 shadow-soft-sm space-y-3 hover:border-accent-400 transition-all"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-parchment-200/60 pb-3">
                        <div>
                          <span className="text-xs font-mono font-bold text-henna-800">
                            {booking.bookingId}
                          </span>
                          <h4 className="font-serif text-base font-semibold text-espresso-900">
                            {booking.eventType}
                          </h4>
                        </div>
                        <span
                          className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${getStatusBadge(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-espresso-700">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-accent-600" />
                          <span>
                            Date:{' '}
                            {new Date(booking.eventDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-accent-600" />
                          <span>Slot: {booking.preferredTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:col-span-2">
                          <MapPin className="w-3.5 h-3.5 text-accent-600 shrink-0" />
                          <span className="truncate">Venue: {booking.location}</span>
                        </div>
                        {booking.designTitle && (
                          <div className="sm:col-span-2 text-henna-700 font-medium">
                            Design: {booking.designTitle}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

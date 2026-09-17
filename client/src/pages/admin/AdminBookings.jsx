import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { bookingsApi } from '../../api';
import { Eye, MessageCircle, Check, X, Calendar, MapPin, Phone, Mail } from 'lucide-react';
import { toast } from 'react-toastify';

export const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingsApi.getAll({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        limit: 100,
      });
      if (res.success) {
        setBookings(res.data.bookings || []);
      }
    } catch (err) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const handleOpenDetails = (booking) => {
    setSelectedBooking(booking);
    setAdminNotes(booking.adminNotes || '');
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedBooking) return;
    setUpdating(true);
    try {
      const res = await bookingsApi.updateStatus(selectedBooking._id, {
        status: newStatus,
        adminNotes,
      });
      if (res.success) {
        toast.success(`Booking status changed to ${newStatus}`);
        setSelectedBooking(res.data);
        fetchBookings();
      }
    } catch (err) {
      toast.error(err.message || 'Status update failed');
    } finally {
      setUpdating(false);
    }
  };

  const handleClientWhatsApp = (booking) => {
    const rawNum = booking.phone.replace(/[^0-9]/g, '');
    const cleanNum = rawNum.startsWith('91') ? rawNum : `91${rawNum}`;
    const msg = `Hello ${booking.name}! This is Shreya from Shreya's Mehndi Zone regarding your booking *${booking.bookingId}* for ${booking.eventType} on ${new Date(booking.eventDate).toLocaleDateString()}.`;
    window.open(`https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const columns = [
    {
      header: 'Booking ID',
      render: (row) => (
        <span className="font-mono font-bold text-henna-800">{row.bookingId}</span>
      ),
    },
    {
      header: 'Customer',
      render: (row) => (
        <div>
          <span className="font-semibold text-espresso-900 block">{row.name}</span>
          <span className="text-[11px] text-espresso-700">{row.phone}</span>
        </div>
      ),
    },
    {
      header: 'Event & Date',
      render: (row) => (
        <div>
          <span className="font-medium text-espresso-900 block">{row.eventType}</span>
          <span className="text-[11px] text-espresso-700">
            {new Date(row.eventDate).toLocaleDateString()} ({row.preferredTime})
          </span>
        </div>
      ),
    },
    {
      header: 'Venue',
      render: (row) => (
        <span className="text-xs text-espresso-700 truncate max-w-[150px] block">
          {row.location}
        </span>
      ),
    },
    {
      header: 'Status',
      render: (row) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
            row.status === 'Confirmed'
              ? 'bg-emerald-100 text-emerald-800'
              : row.status === 'Completed'
              ? 'bg-blue-100 text-blue-800'
              : row.status === 'Cancelled'
              ? 'bg-rose-100 text-rose-800'
              : 'bg-amber-100 text-amber-800'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenDetails(row)}
            className="p-1.5 rounded-lg text-espresso-700 hover:text-henna-700 hover:bg-parchment-100"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleClientWhatsApp(row)}
            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
            title="WhatsApp Client"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Appointment Bookings"
      subtitle="Review customer requests, confirm schedules, and communicate via WhatsApp."
    >
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-1.5 bg-parchment-200/70 p-1 rounded-2xl">
          {['all', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                statusFilter === status
                  ? 'bg-white text-espresso-900 shadow-soft-sm'
                  : 'text-espresso-700 hover:text-espresso-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <span className="text-xs text-espresso-700">
          Showing <strong className="text-espresso-900">{bookings.length}</strong> bookings
        </span>
      </div>

      <DataTable
        columns={columns}
        data={bookings}
        searchField="name"
        loading={loading}
      />

      {/* Booking Details Modal */}
      <Modal
        isOpen={Boolean(selectedBooking)}
        onClose={() => setSelectedBooking(null)}
        title="Booking Details"
        maxWidth="max-w-xl"
      >
        {selectedBooking && (
          <div className="space-y-5 text-xs text-espresso-800">
            <div className="flex justify-between items-center p-3 rounded-2xl bg-parchment-100 border border-parchment-200">
              <div>
                <span className="text-[10px] text-espresso-700 block uppercase">Reference ID</span>
                <span className="font-mono font-bold text-sm text-henna-800">
                  {selectedBooking.bookingId}
                </span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  selectedBooking.status === 'Confirmed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : selectedBooking.status === 'Completed'
                    ? 'bg-blue-100 text-blue-800'
                    : selectedBooking.status === 'Cancelled'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {selectedBooking.status}
              </span>
            </div>

            {/* Client Info */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-parchment-50">
              <div>
                <span className="text-[10px] text-espresso-700 block">Customer Name</span>
                <span className="font-semibold text-espresso-900">{selectedBooking.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-espresso-700 block">Phone</span>
                <span>{selectedBooking.phone}</span>
              </div>
              <div>
                <span className="text-[10px] text-espresso-700 block">Email</span>
                <span>{selectedBooking.email}</span>
              </div>
              <div>
                <span className="text-[10px] text-espresso-700 block">Guest Count</span>
                <span>{selectedBooking.numberOfPeople || 1} people</span>
              </div>
            </div>

            {/* Event Info */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-espresso-700">Event:</span>
                <span className="font-medium">{selectedBooking.eventType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-espresso-700">Date:</span>
                <span className="font-medium">
                  {new Date(selectedBooking.eventDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-espresso-700">Time Slot:</span>
                <span className="font-medium">{selectedBooking.preferredTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-espresso-700">Venue Address:</span>
                <span className="font-medium text-right max-w-xs">{selectedBooking.location}</span>
              </div>
              {selectedBooking.designTitle && (
                <div className="flex justify-between">
                  <span className="text-espresso-700">Design Selected:</span>
                  <span className="font-semibold text-henna-700">{selectedBooking.designTitle}</span>
                </div>
              )}
              {selectedBooking.specialRequirements && (
                <div className="pt-1 text-espresso-700">
                  <strong className="text-espresso-900">Custom Notes:</strong> {selectedBooking.specialRequirements}
                </div>
              )}
            </div>

            {/* Admin Notes */}
            <div>
              <label className="block text-xs font-medium text-espresso-900 mb-1">
                Internal Admin Notes
              </label>
              <textarea
                rows="2"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Deposit received, specific artist assigned, etc..."
                className="w-full p-2 text-xs rounded-xl border border-parchment-200 bg-parchment-50"
              />
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-parchment-200 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => handleClientWhatsApp(selectedBooking)}
                className="py-2 px-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold flex items-center gap-1.5 text-xs hover:bg-emerald-100"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp Client</span>
              </button>

              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleUpdateStatus('Confirmed')}
                  loading={updating}
                >
                  Confirm
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateStatus('Completed')}
                  loading={updating}
                >
                  Mark Done
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => handleUpdateStatus('Cancelled')}
                  loading={updating}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default AdminBookings;

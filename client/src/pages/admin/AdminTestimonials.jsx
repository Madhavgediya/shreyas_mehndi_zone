import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import Button from '../../components/common/Button';
import { testimonialsApi } from '../../api';
import { Check, X, Trash2, Star, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';

export const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await testimonialsApi.getAll();
      if (res.success) setTestimonials(res.data || []);
    } catch (err) {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await testimonialsApi.updateStatus(id, { status });
      toast.success(`Review ${status.toLowerCase()}`);
      fetchReviews();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleToggleFeatured = async (id, currentVal) => {
    try {
      await testimonialsApi.updateStatus(id, { featured: !currentVal });
      toast.success(!currentVal ? 'Review featured' : 'Review unfeatured');
      fetchReviews();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete review?')) return;
    try {
      await testimonialsApi.delete(id);
      toast.success('Review deleted');
      fetchReviews();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const columns = [
    {
      header: 'Reviewer',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.profileImage} alt="" className="w-9 h-9 rounded-full object-cover" />
          <div>
            <span className="font-semibold text-espresso-900 block">{row.name}</span>
            <span className="text-[10px] text-espresso-700">{row.eventType}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Rating & Feedback',
      render: (row) => (
        <div className="max-w-md">
          <div className="flex text-amber-500 text-xs mb-0.5">
            {Array.from({ length: row.rating || 5 }).map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>
          <p className="text-xs text-espresso-800 line-clamp-2 italic">"{row.review}"</p>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
              row.status === 'Approved'
                ? 'bg-emerald-100 text-emerald-800'
                : row.status === 'Rejected'
                ? 'bg-rose-100 text-rose-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {row.status}
          </span>
          {row.featured && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-accent-400 text-espresso-900">
              Featured
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Moderate',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          {row.status !== 'Approved' && (
            <button
              onClick={() => handleUpdateStatus(row._id, 'Approved')}
              className="p-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              title="Approve"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          )}
          {row.status !== 'Rejected' && (
            <button
              onClick={() => handleUpdateStatus(row._id, 'Rejected')}
              className="p-1 rounded bg-amber-50 text-amber-700 hover:bg-amber-100"
              title="Reject"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => handleToggleFeatured(row._id, row.featured)}
            className={`p-1 rounded ${
              row.featured
                ? 'bg-accent-400 text-espresso-900'
                : 'bg-parchment-100 text-espresso-700 hover:bg-parchment-200'
            }`}
            title="Feature on Homepage"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="p-1 rounded text-red-600 hover:bg-red-50"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Testimonials & Reviews"
      subtitle="Moderate customer reviews and choose which stories appear on the homepage."
    >
      <div className="flex justify-between items-center">
        <span className="text-xs text-espresso-700">Reviews ({testimonials.length})</span>
      </div>

      <DataTable columns={columns} data={testimonials} searchField="name" loading={loading} />
    </AdminLayout>
  );
};

export default AdminTestimonials;

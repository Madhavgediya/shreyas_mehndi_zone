import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import { inquiriesApi } from '../../api';
import { MessageCircle, Mail, Trash2, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';

export const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await inquiriesApi.getAll({ limit: 100 });
      if (res.success) setInquiries(res.data.inquiries || []);
    } catch (err) {
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await inquiriesApi.updateStatus(id, status);
      toast.success(`Inquiry marked as ${status}`);
      fetchInquiries();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    try {
      await inquiriesApi.delete(id);
      toast.success('Inquiry deleted');
      fetchInquiries();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleWhatsApp = (inquiry) => {
    const raw = inquiry.phone.replace(/[^0-9]/g, '');
    const clean = raw.startsWith('91') ? raw : `91${raw}`;
    const msg = `Hello ${inquiry.name}! This is Shreya from Shreya's Mehndi Zone responding to your message regarding: "${inquiry.subject}".`;
    window.open(`https://wa.me/${clean}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const columns = [
    {
      header: 'Client',
      render: (row) => (
        <div>
          <span className="font-semibold text-espresso-900 block">{row.name}</span>
          <span className="text-[11px] text-espresso-700">{row.email}</span>
        </div>
      ),
    },
    {
      header: 'Subject & Message',
      render: (row) => (
        <div className="max-w-md">
          <span className="font-medium text-espresso-900 block">{row.subject}</span>
          <p className="text-xs text-espresso-700 line-clamp-2 mt-0.5">{row.message}</p>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (row) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
            row.status === 'Resolved'
              ? 'bg-emerald-100 text-emerald-800'
              : row.status === 'In Progress'
              ? 'bg-blue-100 text-blue-800'
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
            onClick={() => handleWhatsApp(row)}
            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
            title="WhatsApp Reply"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
          {row.status !== 'Resolved' && (
            <button
              onClick={() => handleUpdateStatus(row._id, 'Resolved')}
              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
              title="Mark Resolved"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => handleDelete(row._id)}
            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Customer Inquiries"
      subtitle="Messages submitted through the public contact form."
    >
      <div className="flex justify-between items-center">
        <span className="text-xs text-espresso-700">Messages ({inquiries.length})</span>
      </div>

      <DataTable columns={columns} data={inquiries} searchField="name" loading={loading} />
    </AdminLayout>
  );
};

export default AdminInquiries;

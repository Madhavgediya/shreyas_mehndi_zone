import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { pricingApi } from '../../api';
import { Plus, Edit2, Trash2, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

export const AdminPricing = () => {
  const [pricing, setPricing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPricing, setEditingPricing] = useState(null);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchPricing = async () => {
    setLoading(true);
    try {
      const res = await pricingApi.getPricing({ all: 'true' });
      if (res.success) setPricing(res.data || []);
    } catch (err) {
      toast.error('Failed to load pricing packages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  const handleOpenAdd = () => {
    setEditingPricing(null);
    reset({
      title: '',
      serviceName: '',
      price: '',
      priceType: 'Complete Package',
      duration: '3 - 5 Hours',
      features: '',
      discount: '',
      isPopular: false,
      active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (pkg) => {
    setEditingPricing(pkg);
    reset({
      title: pkg.title,
      serviceName: pkg.serviceName || '',
      price: pkg.price,
      priceType: pkg.priceType,
      duration: pkg.duration,
      features: pkg.features ? pkg.features.join(', ') : '',
      discount: pkg.discount || '',
      isPopular: pkg.isPopular,
      active: pkg.active,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this pricing package?')) return;
    try {
      const res = await pricingApi.delete(id);
      if (res.success) {
        toast.success('Pricing package deleted');
        fetchPricing();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        price: Number(data.price),
        features: data.features.split(',').map((f) => f.trim()).filter(Boolean),
      };

      if (editingPricing) {
        await pricingApi.update(editingPricing._id, payload);
        toast.success('Package updated');
      } else {
        await pricingApi.create(payload);
        toast.success('Package created');
      }
      setModalOpen(false);
      fetchPricing();
    } catch (err) {
      toast.error(err.message || 'Error saving package');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      header: 'Package Title',
      render: (row) => (
        <div>
          <span className="font-serif font-semibold text-espresso-900 block">
            {row.title}
          </span>
          <span className="text-[10px] text-espresso-700">{row.serviceName}</span>
        </div>
      ),
    },
    {
      header: 'Price',
      render: (row) => (
        <div>
          <span className="font-semibold text-henna-800">₹{row.price}</span>
          <span className="text-[10px] text-espresso-700 block">/{row.priceType}</span>
        </div>
      ),
    },
    {
      header: 'Inclusions',
      render: (row) => (
        <span className="text-xs text-espresso-700">
          {row.features?.length || 0} features
        </span>
      ),
    },
    {
      header: 'Badge',
      render: (row) => (
        <div className="flex gap-1">
          {row.isPopular && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-henna-700 text-white">
              Popular
            </span>
          )}
          {row.discount && (
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800">
              {row.discount}
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 rounded-lg text-espresso-700 hover:text-henna-700 hover:bg-parchment-100"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Pricing Packages"
      subtitle="Manage rates, discounts, and tier features."
    >
      <div className="flex justify-between items-center">
        <span className="text-xs text-espresso-700">Packages ({pricing.length})</span>
        <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenAdd}>
          Add Package
        </Button>
      </div>

      <DataTable columns={columns} data={pricing} searchField="title" loading={loading} />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPricing ? 'Edit Pricing Package' : 'Add New Pricing Package'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-espresso-800 mb-1">
              Package Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Golden Engagement Elegance"
              {...register('title', { required: 'Title is required' })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-espresso-800 mb-1">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="4500"
                {...register('price', { required: 'Price is required' })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-espresso-800 mb-1">
                Price Type
              </label>
              <select
                {...register('priceType')}
                className="w-full px-3 py-2 text-xs rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900"
              >
                <option value="Complete Package">Complete Package</option>
                <option value="Per Hand">Per Hand</option>
                <option value="Per Person">Per Person</option>
                <option value="Hourly">Hourly</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-espresso-800 mb-1">
              Features (Comma separated)
            </label>
            <textarea
              rows="3"
              placeholder="Full hands, Initials, Aftercare balm, Photo preview"
              {...register('features')}
              className="w-full px-3 py-2 text-xs rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-espresso-800 mb-1">
                Discount / Badge Text
              </label>
              <input
                type="text"
                placeholder="e.g. Save 15%"
                {...register('discount')}
                className="w-full px-3 py-2 text-xs rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-espresso-800 mb-1">
                Duration
              </label>
              <input
                type="text"
                placeholder="3 Hours"
                {...register('duration')}
                className="w-full px-3 py-2 text-xs rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 text-xs font-medium text-espresso-900 cursor-pointer">
              <input type="checkbox" {...register('isPopular')} className="rounded" />
              <span>Mark as Popular</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-medium text-espresso-900 cursor-pointer">
              <input type="checkbox" {...register('active')} className="rounded" />
              <span>Active</span>
            </label>
          </div>

          <div className="pt-2 border-t border-parchment-200">
            <Button type="submit" variant="primary" size="md" loading={saving} className="w-full">
              {editingPricing ? 'Update Package' : 'Create Package'}
            </Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default AdminPricing;

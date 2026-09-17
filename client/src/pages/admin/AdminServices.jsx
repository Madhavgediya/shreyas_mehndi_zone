import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import ImageUpload from '../../components/common/ImageUpload';
import { servicesApi } from '../../api';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

export const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await servicesApi.getServices({ all: 'true' });
      if (res.success) setServices(res.data || []);
    } catch (err) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenAdd = () => {
    setEditingService(null);
    reset({
      title: '',
      description: '',
      startingPrice: '',
      duration: '2 - 4 Hours',
      features: '',
      image: '',
      active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (srv) => {
    setEditingService(srv);
    reset({
      title: srv.title,
      description: srv.description,
      startingPrice: srv.startingPrice,
      duration: srv.duration,
      features: srv.features ? srv.features.join(', ') : '',
      image: srv.image,
      active: srv.active,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      const res = await servicesApi.delete(id);
      if (res.success) {
        toast.success('Service deleted');
        fetchServices();
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
        startingPrice: Number(data.startingPrice),
        features: data.features.split(',').map((f) => f.trim()).filter(Boolean),
      };

      if (editingService) {
        await servicesApi.update(editingService._id, payload);
        toast.success('Service updated');
      } else {
        await servicesApi.create(payload);
        toast.success('Service created');
      }
      setModalOpen(false);
      fetchServices();
    } catch (err) {
      toast.error(err.message || 'Error saving service');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      header: 'Service',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.image} alt="" className="w-10 h-10 rounded-xl object-cover" />
          <div>
            <span className="font-serif font-semibold text-espresso-900 block">
              {row.title}
            </span>
            <span className="text-[10px] text-espresso-700">{row.duration}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Starting Price',
      render: (row) => (
        <span className="font-semibold text-henna-800">₹{row.startingPrice}</span>
      ),
    },
    {
      header: 'Features',
      render: (row) => (
        <span className="text-xs text-espresso-700">
          {row.features?.length || 0} Inclusions
        </span>
      ),
    },
    {
      header: 'Status',
      render: (row) => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
            row.active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
          }`}
        >
          {row.active ? 'Active' : 'Inactive'}
        </span>
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
      title="Service Management"
      subtitle="Manage your studio and on-location Mehndi offerings."
    >
      <div className="flex justify-between items-center">
        <span className="text-xs text-espresso-700">Services ({services.length})</span>
        <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenAdd}>
          Add Service
        </Button>
      </div>

      <DataTable columns={columns} data={services} searchField="title" loading={loading} />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingService ? 'Edit Service' : 'Add New Service'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-espresso-800 mb-1">
              Service Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Grand Royal Bridal Mehndi"
              {...register('title', { required: 'Title is required' })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-espresso-800 mb-1">
                Starting Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="6500"
                {...register('startingPrice', { required: 'Price is required' })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-espresso-800 mb-1">
                Duration
              </label>
              <input
                type="text"
                placeholder="4 - 6 Hours"
                {...register('duration')}
                className="w-full px-3 py-2 text-xs rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-espresso-800 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="3"
              placeholder="Describe service inclusions and coverage..."
              {...register('description', { required: 'Description is required' })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-espresso-800 mb-1">
              Features (Comma separated)
            </label>
            <input
              type="text"
              placeholder="Full hands, Portraits, Organic cones, Aftercare balm"
              {...register('features')}
              className="w-full px-3 py-2 text-xs rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900"
            />
          </div>

          <ImageUpload
            label="Service Image"
            value={watch('image') || ''}
            onChange={(url) => setValue('image', url, { shouldValidate: true, shouldDirty: true })}
            folder="services"
            placeholder="https://... or upload service image"
            helpText="Upload a photo showcasing this service package"
          />

          <label className="flex items-center gap-2 text-xs font-medium text-espresso-900 cursor-pointer pt-1">
            <input type="checkbox" {...register('active')} className="rounded" />
            <span>Active Service</span>
          </label>

          <div className="pt-2 border-t border-parchment-200">
            <Button type="submit" variant="primary" size="md" loading={saving} className="w-full">
              {editingService ? 'Update Service' : 'Create Service'}
            </Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default AdminServices;

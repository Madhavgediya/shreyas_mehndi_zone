import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import ImageUpload from '../../components/common/ImageUpload';
import { designsApi, categoriesApi, uploadApi } from '../../api';
import { Plus, Edit2, Trash2, Sparkles, Upload, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

export const AdminDesigns = () => {
  const [designs, setDesigns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDesign, setEditingDesign] = useState(null);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();

  const fetchDesigns = async () => {
    setLoading(true);
    try {
      const [desRes, catRes] = await Promise.all([
        designsApi.getDesigns({ all: 'true', limit: 100 }),
        categoriesApi.getCategories({ all: 'true' }),
      ]);
      if (desRes.success) setDesigns(desRes.data.designs || []);
      if (catRes.success) setCategories(catRes.data || []);
    } catch (err) {
      toast.error('Failed to load designs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesigns();
  }, []);

  const handleOpenAdd = () => {
    setEditingDesign(null);
    reset({
      title: '',
      description: '',
      category: categories[0]?._id || '',
      price: '',
      estimatedTime: '2 - 3 Hours',
      difficulty: 'Intermediate',
      tags: '',
      imageUrl: '',
      overlayUrl: '/overlays/mandala-royal.svg',
      featured: false,
      published: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (design) => {
    setEditingDesign(design);
    reset({
      title: design.title,
      description: design.description,
      category: design.category?._id || design.category,
      price: design.price,
      estimatedTime: design.estimatedTime,
      difficulty: design.difficulty,
      tags: design.tags ? design.tags.join(', ') : '',
      imageUrl: design.images?.[0] || '',
      overlayUrl: design.overlayImage || '',
      featured: design.featured,
      published: design.published,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this design?')) return;
    try {
      const res = await designsApi.delete(id);
      if (res.success) {
        toast.success('Design deleted');
        fetchDesigns();
      }
    } catch (err) {
      toast.error(err.message || 'Could not delete design');
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        price: Number(data.price),
        tags: data.tags.split(',').map((t) => t.trim()).filter(Boolean),
        images: [data.imageUrl || 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80'],
        overlayImage: data.overlayUrl || '',
      };

      if (editingDesign) {
        await designsApi.update(editingDesign._id, payload);
        toast.success('Design updated successfully!');
      } else {
        await designsApi.create(payload);
        toast.success('Design created successfully!');
      }

      setModalOpen(false);
      fetchDesigns();
    } catch (err) {
      toast.error(err.message || 'Failed to save design');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      header: 'Design',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.images?.[0]}
            alt=""
            className="w-11 h-11 rounded-xl object-cover"
          />
          <div>
            <span className="font-serif font-semibold text-espresso-900 block truncate max-w-[200px]">
              {row.title}
            </span>
            <span className="text-[10px] text-espresso-700">
              {row.category?.name || 'Uncategorized'}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Price',
      render: (row) => (
        <span className="font-semibold text-henna-800">₹{row.price}</span>
      ),
    },
    {
      header: 'Difficulty / Time',
      render: (row) => (
        <div className="text-xs">
          <span className="block font-medium">{row.difficulty}</span>
          <span className="text-[10px] text-espresso-700">{row.estimatedTime}</span>
        </div>
      ),
    },
    {
      header: 'Stats',
      render: (row) => (
        <div className="text-[11px] text-espresso-700 space-x-2">
          <span>❤️ {row.likesCount}</span>
          <span>👁️ {row.viewsCount}</span>
          <span>🔗 {row.sharesCount}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (row) => (
        <div className="flex gap-1.5">
          {row.featured && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-accent-400 text-espresso-900">
              Featured
            </span>
          )}
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
              row.published ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}
          >
            {row.published ? 'Published' : 'Draft'}
          </span>
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
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
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
      title="Design Management"
      subtitle="Add, update, or unpublish Mehndi designs and overlay assets."
    >
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs text-espresso-700">
            Total Designs in Database: <strong className="text-espresso-900">{designs.length}</strong>
          </span>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenAdd}>
          Add New Design
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={designs}
        searchField="title"
        loading={loading}
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingDesign ? 'Edit Mehndi Design' : 'Add New Mehndi Design'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-espresso-800 mb-1">
              Design Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Royal Maharani Bridal Extravaganza"
              {...register('title', { required: 'Title is required' })}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900"
            />
            {errors.title && (
              <span className="text-red-500 text-[11px] block mt-0.5">
                {errors.title.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-espresso-800 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                {...register('category', { required: 'Category is required' })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-espresso-800 mb-1">
                Estimated Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="2500"
                {...register('price', { required: 'Price is required' })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-espresso-800 mb-1">
                Difficulty Level
              </label>
              <select
                {...register('difficulty')}
                className="w-full px-3 py-2 text-xs rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900"
              >
                <option value="Easy">Easy</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Intricate">Intricate</option>
                <option value="Master Bridal">Master Bridal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-espresso-800 mb-1">
                Estimated Application Time
              </label>
              <input
                type="text"
                placeholder="2 - 3 Hours"
                {...register('estimatedTime')}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-espresso-800 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="3"
              placeholder="Describe the motif elements, inspiration, and coverage..."
              {...register('description', { required: 'Description is required' })}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900"
            />
          </div>

          <ImageUpload
            label="Primary Design Image"
            value={watch('imageUrl') || ''}
            onChange={(url) => setValue('imageUrl', url, { shouldValidate: true, shouldDirty: true })}
            folder="designs"
            placeholder="https://images.unsplash.com/... or upload image file"
            helpText="Upload a photo from your device (JPG, PNG, WebP) or paste an image URL"
            required
          />

          <ImageUpload
            label="Virtual Try-On Transparent Overlay Asset (SVG / PNG)"
            value={watch('overlayUrl') || ''}
            onChange={(url) => setValue('overlayUrl', url, { shouldValidate: true, shouldDirty: true })}
            folder="overlays"
            placeholder="/overlays/mandala-royal.svg or upload overlay"
            helpText="Upload a transparent PNG or SVG motif used in the interactive Virtual AR Try-On"
            isOverlay
          />

          <div>
            <label className="block text-xs font-medium text-espresso-800 mb-1">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              placeholder="Bridal, Royal, Mandala, Floral, Full Hand"
              {...register('tags')}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-medium text-espresso-900 cursor-pointer">
              <input type="checkbox" {...register('featured')} className="rounded" />
              <span>Feature on Homepage</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-medium text-espresso-900 cursor-pointer">
              <input type="checkbox" {...register('published')} className="rounded" />
              <span>Published (Visible in Gallery)</span>
            </label>
          </div>

          <div className="pt-3 border-t border-parchment-200">
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={saving}
              className="w-full"
            >
              {editingDesign ? 'Update Design' : 'Create Design'}
            </Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default AdminDesigns;

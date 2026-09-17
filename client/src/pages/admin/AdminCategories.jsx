import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import ImageUpload from '../../components/common/ImageUpload';
import { categoriesApi } from '../../api';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoriesApi.getCategories({ all: 'true' });
      if (res.success) setCategories(res.data || []);
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    reset({
      name: '',
      description: '',
      image: '',
      featured: false,
      active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    reset({
      name: cat.name,
      description: cat.description,
      image: cat.image,
      featured: cat.featured,
      active: cat.active,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await categoriesApi.delete(id);
      if (res.success) {
        toast.success('Category deleted');
        fetchCategories();
      }
    } catch (err) {
      toast.error(err.message || 'Could not delete category');
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      if (editingCategory) {
        await categoriesApi.update(editingCategory._id, data);
        toast.success('Category updated');
      } else {
        await categoriesApi.create(data);
        toast.success('Category created');
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.message || 'Error saving category');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      header: 'Category',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.image}
            alt=""
            className="w-10 h-10 rounded-xl object-cover"
          />
          <div>
            <span className="font-serif font-semibold text-espresso-900 block">
              {row.name}
            </span>
            <span className="text-[10px] text-espresso-700">/{row.slug}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Designs Associated',
      render: (row) => (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-parchment-100 text-espresso-900">
          {row.designCount || 0} Designs
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
      title="Category Management"
      subtitle="Organize your portfolio into genres (Bridal, Arabic, Traditional, Mandala, etc.)."
    >
      <div className="flex justify-between items-center">
        <span className="text-xs text-espresso-700">
          Categories ({categories.length})
        </span>
        <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenAdd}>
          Add Category
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        searchField="name"
        loading={loading}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-espresso-800 mb-1">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Traditional Rajasthani"
              {...register('name', { required: 'Name is required' })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900"
            />
            {errors.name && (
              <span className="text-red-500 text-[11px] block mt-0.5">
                {errors.name.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-espresso-800 mb-1">
              Description
            </label>
            <textarea
              rows="3"
              placeholder="Describe this Mehndi genre..."
              {...register('description')}
              className="w-full px-3 py-2 text-xs rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900"
            />
          </div>

          <ImageUpload
            label="Category Cover Image"
            value={watch('image') || ''}
            onChange={(url) => setValue('image', url, { shouldValidate: true, shouldDirty: true })}
            folder="categories"
            placeholder="https://... or upload file"
            helpText="Upload a representative cover photo for this category"
          />

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-medium text-espresso-900 cursor-pointer">
              <input type="checkbox" {...register('featured')} className="rounded" />
              <span>Feature on Homepage</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-medium text-espresso-900 cursor-pointer">
              <input type="checkbox" {...register('active')} className="rounded" />
              <span>Active</span>
            </label>
          </div>

          <div className="pt-2 border-t border-parchment-200">
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={saving}
              className="w-full"
            >
              {editingCategory ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default AdminCategories;

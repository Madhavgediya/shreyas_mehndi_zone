import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import { usersApi } from '../../api';
import { Shield, User, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await usersApi.getAll();
      if (res.success) setUsers(res.data || []);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleRole = async (user) => {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    if (!window.confirm(`Change ${user.name}'s role to ${newRole}?`)) return;
    try {
      const res = await usersApi.updateRole(user._id, newRole);
      if (res.success) {
        toast.success(`Role updated to ${newRole}`);
        fetchUsers();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user account?')) return;
    try {
      const res = await usersApi.delete(id);
      if (res.success) {
        toast.success('User deleted');
        fetchUsers();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const columns = [
    {
      header: 'User',
      render: (row) => (
        <div>
          <span className="font-semibold text-espresso-900 block">{row.name}</span>
          <span className="text-[11px] text-espresso-700">{row.email}</span>
        </div>
      ),
    },
    {
      header: 'Phone',
      render: (row) => <span className="text-xs">{row.phone || '--'}</span>,
    },
    {
      header: 'Role',
      render: (row) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
            row.role === 'ADMIN'
              ? 'bg-henna-700 text-white'
              : 'bg-parchment-200 text-espresso-800'
          }`}
        >
          {row.role}
        </span>
      ),
    },
    {
      header: 'Joined',
      render: (row) => (
        <span className="text-[11px] text-espresso-700">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleToggleRole(row)}
            className="p-1.5 rounded-lg text-espresso-700 hover:text-henna-700 hover:bg-parchment-100"
            title="Toggle Admin Role"
          >
            <Shield className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
            title="Delete User"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="User Accounts"
      subtitle="Registered client profiles and administrative role assignments."
    >
      <div className="flex justify-between items-center">
        <span className="text-xs text-espresso-700">Registered Users ({users.length})</span>
      </div>

      <DataTable columns={columns} data={users} searchField="name" loading={loading} />
    </AdminLayout>
  );
};

export default AdminUsers;

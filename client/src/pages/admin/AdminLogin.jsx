import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import SEO from '../../components/common/SEO';
import { toast } from 'react-toastify';
import { Shield, Lock, Mail } from 'lucide-react';

export const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: 'admin@shreyasmehndizone.com',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await login(data.email, data.password);
      if (user.role === 'ADMIN') {
        toast.success('Welcome to Admin Portal');
        navigate('/admin/dashboard');
      } else {
        toast.error('Access denied. Administrator privileges required.');
      }
    } catch (err) {
      toast.error(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Admin Login" />
      <div className="min-h-screen bg-[#231A13] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-soft-lg space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-henna-700 text-white flex items-center justify-center mx-auto shadow-soft-md">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-espresso-900">
              Admin Portal
            </h1>
            <p className="text-xs text-espresso-700">
              Enter your artist administrator credentials to access the studio management console.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-espresso-800 mb-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-espresso-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900 text-sm focus:outline-none focus:border-henna-700"
                />
              </div>
              {errors.email && (
                <span className="text-red-500 text-[11px] mt-0.5 block">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-espresso-800 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-espresso-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register('password', { required: 'Password is required' })}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900 text-sm focus:outline-none focus:border-henna-700"
                />
              </div>
              {errors.password && (
                <span className="text-red-500 text-[11px] mt-0.5 block">
                  {errors.password.message}
                </span>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-2"
            >
              Sign In to Admin
            </Button>
          </form>

          <div className="pt-4 border-t border-parchment-200 text-center text-xs text-espresso-700">
            <Link to="/" className="text-henna-700 hover:underline">
              ← Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;

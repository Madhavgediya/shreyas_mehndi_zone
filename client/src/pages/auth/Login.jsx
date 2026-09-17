import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import SEO from '../../components/common/SEO';
import { toast } from 'react-toastify';
import { Lock, Mail, Sparkles } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await login(data.email, data.password);
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      toast.error(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Log In" description="Log in to your Shreya's Mehndi Zone account." />

      <div className="min-h-[80vh] bg-parchment-50 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-parchment-200 shadow-soft-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-henna-100 text-henna-700 flex items-center justify-center mx-auto shadow-soft-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-espresso-900">
              Welcome Back
            </h1>
            <p className="text-xs text-espresso-700">
              Log in to manage your appointments, shortlist favorites, and view bookings.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-espresso-800 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-espresso-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="name@example.com"
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
              Sign In
            </Button>
          </form>

          <div className="pt-4 border-t border-parchment-200 text-center text-xs text-espresso-700">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-henna-700 hover:underline">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

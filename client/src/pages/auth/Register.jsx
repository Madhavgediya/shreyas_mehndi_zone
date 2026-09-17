import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import SEO from '../../components/common/SEO';
import { toast } from 'react-toastify';
import { Lock, Mail, User, Phone, Sparkles } from 'lucide-react';

export const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser(data);
      toast.success('Registration successful! Welcome to Shreya\'s Mehndi Zone.');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Create an Account" description="Join Shreya's Mehndi Zone to manage bookings and saved favorites." />

      <div className="min-h-[80vh] bg-parchment-50 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-parchment-200 shadow-soft-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-henna-100 text-henna-700 flex items-center justify-center mx-auto shadow-soft-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-espresso-900">
              Create an Account
            </h1>
            <p className="text-xs text-espresso-700">
              Save your favorite Mehndi designs and track your appointment bookings.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-espresso-800 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-espresso-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Pooja Patel"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900 text-sm focus:outline-none focus:border-henna-700"
                />
              </div>
              {errors.name && (
                <span className="text-red-500 text-[11px] mt-0.5 block">
                  {errors.name.message}
                </span>
              )}
            </div>

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
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-espresso-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  {...register('phone')}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900 text-sm focus:outline-none focus:border-henna-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-espresso-800 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-espresso-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
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
              Create Account
            </Button>
          </form>

          <div className="pt-4 border-t border-parchment-200 text-center text-xs text-espresso-700">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-henna-700 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;

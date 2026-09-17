import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Common Layout Elements
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import WhatsAppFloatingButton from '../components/common/WhatsAppFloatingButton';

// Public Pages
import Home from '../pages/Home';
import Gallery from '../pages/Gallery';
import DesignDetails from '../pages/DesignDetails';
import Categories from '../pages/Categories';
import Services from '../pages/Services';
import Pricing from '../pages/Pricing';
import TryOn from '../pages/TryOn';
import Booking from '../pages/Booking';
import About from '../pages/About';
import Testimonials from '../pages/Testimonials';
import Contact from '../pages/Contact';
import Favorites from '../pages/Favorites';
import FAQ from '../pages/FAQ';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsConditions from '../pages/TermsConditions';
import NotFound from '../pages/NotFound';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Profile from '../pages/user/Profile';

// Admin Pages
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminDesigns from '../pages/admin/AdminDesigns';
import AdminCategories from '../pages/admin/AdminCategories';
import AdminServices from '../pages/admin/AdminServices';
import AdminPricing from '../pages/admin/AdminPricing';
import AdminBookings from '../pages/admin/AdminBookings';
import AdminTestimonials from '../pages/admin/AdminTestimonials';
import AdminInquiries from '../pages/admin/AdminInquiries';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminAnalytics from '../pages/admin/AdminAnalytics';
import AdminSettings from '../pages/admin/AdminSettings';

// Protected Route for Logged in user
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-parchment-50">
        <div className="w-8 h-8 border-4 border-henna-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Admin Route for Admin Role
const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#231A13]">
        <div className="w-8 h-8 border-4 border-accent-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

// Layout for Public Pages
const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-parchment-50 text-espresso-900">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
      <Route path="/designs/:slug" element={<PublicLayout><DesignDetails /></PublicLayout>} />
      <Route path="/categories" element={<PublicLayout><Categories /></PublicLayout>} />
      <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
      <Route path="/pricing" element={<PublicLayout><Pricing /></PublicLayout>} />
      <Route path="/try-on" element={<PublicLayout><TryOn /></PublicLayout>} />
      <Route path="/book" element={<PublicLayout><Booking /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/testimonials" element={<PublicLayout><Testimonials /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/favorites" element={<PublicLayout><Favorites /></PublicLayout>} />
      <Route path="/faq" element={<PublicLayout><FAQ /></PublicLayout>} />
      <Route path="/privacy-policy" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
      <Route path="/terms-conditions" element={<PublicLayout><TermsConditions /></PublicLayout>} />

      {/* Customer Auth */}
      <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
      <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <PublicLayout>
              <Profile />
            </PublicLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Auth */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={<Navigate to="/admin/dashboard" replace />}
      />
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/designs"
        element={
          <AdminRoute>
            <AdminDesigns />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <AdminRoute>
            <AdminCategories />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/services"
        element={
          <AdminRoute>
            <AdminServices />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/pricing"
        element={
          <AdminRoute>
            <AdminPricing />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <AdminRoute>
            <AdminBookings />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/testimonials"
        element={
          <AdminRoute>
            <AdminTestimonials />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/inquiries"
        element={
          <AdminRoute>
            <AdminInquiries />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <AdminRoute>
            <AdminAnalytics />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <AdminRoute>
            <AdminSettings />
          </AdminRoute>
        }
      />

      {/* 404 Fallback */}
      <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
    </Routes>
  );
};

export default AppRoutes;

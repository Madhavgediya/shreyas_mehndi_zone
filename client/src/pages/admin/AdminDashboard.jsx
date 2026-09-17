import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import StatCard from '../../components/admin/StatCard';
import { analyticsApi } from '../../api';
import {
  Image as ImageIcon,
  FolderTree,
  CalendarCheck,
  Clock,
  Mail,
  Heart,
  Share2,
  Users,
  Eye,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await analyticsApi.getDashboard();
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.warn('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const kpis = data?.kpis || {};

  return (
    <AdminLayout
      title="Studio Dashboard"
      subtitle="Overview of your Mehndi business metrics, bookings, and audience engagement."
    >
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Bookings"
          value={kpis.totalBookings ?? '--'}
          subtitle={`${kpis.pendingBookings ?? 0} Pending Confirmation`}
          icon={CalendarCheck}
        />
        <StatCard
          title="Active Designs"
          value={kpis.totalDesigns ?? '--'}
          subtitle={`${kpis.totalCategories ?? 0} Categories`}
          icon={ImageIcon}
        />
        <StatCard
          title="Client Inquiries"
          value={kpis.totalInquiries ?? '--'}
          subtitle="Messages received via contact form"
          icon={Mail}
        />
        <StatCard
          title="Design Favorites"
          value={kpis.totalFavorites ?? '--'}
          subtitle={`${kpis.totalShares ?? 0} Total Shares Recorded`}
          icon={Heart}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Booking Trends Graph (Col 7) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-parchment-200 shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-base font-bold text-espresso-900">
                Bookings Trend (Current Year)
              </h3>
              <p className="text-[11px] text-espresso-700">
                Monthly appointment submissions across all events
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-henna-100 text-henna-800">
              {new Date().getFullYear()}
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.monthlyBookings || []}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5E3C" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8B5E3C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#FAF7F2" />
                <XAxis dataKey="month" stroke="#A67C52" fontSize={11} />
                <YAxis stroke="#A67C52" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFDF8',
                    borderColor: '#D4A373',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="#6B3E26"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorBookings)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Designs by Likes (Col 5) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-parchment-200 shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-espresso-900">
              Most Liked Designs
            </h3>
            <Link
              to="/admin/designs"
              className="text-xs font-semibold text-henna-700 hover:underline"
            >
              Manage →
            </Link>
          </div>

          <div className="space-y-3">
            {data?.popularDesigns?.slice(0, 4).map((d) => (
              <div
                key={d._id}
                className="flex items-center gap-3 p-2.5 rounded-2xl bg-parchment-50 border border-parchment-200/80"
              >
                <img
                  src={d.images?.[0]}
                  alt={d.title}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-xs font-semibold text-espresso-900 truncate">
                    {d.title}
                  </h4>
                  <div className="flex items-center gap-3 text-[11px] text-espresso-700 mt-1">
                    <span className="flex items-center gap-1 text-red-600">
                      <Heart className="w-3 h-3 fill-red-600" /> {d.likesCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-accent-600" /> {d.viewsCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 className="w-3 h-3 text-emerald-600" /> {d.sharesCount}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings Overview */}
      <div className="bg-white rounded-3xl p-6 border border-parchment-200 shadow-soft-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-espresso-900">
              Recent Appointment Requests
            </h3>
            <p className="text-xs text-espresso-700">
              Latest clients requesting Mehndi appointments
            </p>
          </div>
          <Link
            to="/admin/bookings"
            className="text-xs font-semibold text-henna-700 hover:underline"
          >
            View All Bookings →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-parchment-200 text-espresso-700 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Booking ID</th>
                <th className="py-2.5 px-3">Client Name</th>
                <th className="py-2.5 px-3">Event Type</th>
                <th className="py-2.5 px-3">Event Date</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-parchment-100">
              {data?.recentBookings?.map((b) => (
                <tr key={b._id} className="hover:bg-parchment-50">
                  <td className="py-3 px-3 font-mono font-bold text-henna-800">
                    {b.bookingId}
                  </td>
                  <td className="py-3 px-3 font-medium text-espresso-900">
                    {b.name}
                  </td>
                  <td className="py-3 px-3 text-espresso-700">{b.eventType}</td>
                  <td className="py-3 px-3 text-espresso-700">
                    {new Date(b.eventDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        b.status === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'Completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

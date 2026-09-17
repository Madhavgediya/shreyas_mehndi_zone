import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { analyticsApi } from '../../api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Share2, Heart, Eye, TrendingUp } from 'lucide-react';

const COLORS = ['#6B3E26', '#8B5E3C', '#D4A373', '#C8A27A', '#522E1A'];

export const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await analyticsApi.getDashboard();
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.warn('Analytics error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const shareData =
    data?.sharesByPlatform?.map((item) => ({
      name: item._id,
      value: item.count,
    })) || [];

  return (
    <AdminLayout
      title="Analytics & Performance"
      subtitle="Insights into customer engagement, shares, favorites, and popular designs."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Most Viewed & Liked Designs (Col 7) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-parchment-200 shadow-soft-sm space-y-4">
          <div>
            <h3 className="font-serif text-base font-bold text-espresso-900">
              Top 6 Designs by Views & Likes
            </h3>
            <p className="text-xs text-espresso-700">
              Comparing customer reach and heart reactions
            </p>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.popularDesigns || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#FAF7F2" />
                <XAxis dataKey="title" stroke="#A67C52" fontSize={10} tickFormatter={(t) => t.slice(0, 10) + '...'} />
                <YAxis stroke="#A67C52" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFDF8',
                    borderColor: '#D4A373',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="viewsCount" name="Views" fill="#D4A373" radius={[6, 6, 0, 0]} />
                <Bar dataKey="likesCount" name="Likes" fill="#6B3E26" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Social Share Breakdown (Col 5) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-parchment-200 shadow-soft-sm space-y-4">
          <div>
            <h3 className="font-serif text-base font-bold text-espresso-900">
              Shares by Channel
            </h3>
            <p className="text-xs text-espresso-700">
              Where users share your Mehndi links (WhatsApp, Facebook, Copy)
            </p>
          </div>

          <div className="h-72 w-full pt-2">
            {shareData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-espresso-700">
                No share data recorded yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={shareData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {shareData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;

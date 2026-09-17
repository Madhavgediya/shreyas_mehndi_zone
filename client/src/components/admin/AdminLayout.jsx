import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { Menu, Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout = ({ children, title, subtitle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-parchment-100/70 flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-parchment-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-soft-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-espresso-800 hover:bg-parchment-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-serif text-lg sm:text-xl font-bold text-espresso-900 leading-tight">
                {title || 'Admin Dashboard'}
              </h1>
              {subtitle && (
                <p className="text-[11px] text-espresso-700 hidden sm:block">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 p-1 sm:px-3 sm:py-1.5 rounded-xl bg-parchment-50 border border-parchment-200">
              <div className="w-7 h-7 rounded-full bg-henna-700 text-white text-xs flex items-center justify-center font-bold">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-semibold text-espresso-900 block leading-none">
                  {user?.name || 'Shreya Admin'}
                </span>
                <span className="text-[10px] text-accent-600 font-medium">
                  Administrator
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Children */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

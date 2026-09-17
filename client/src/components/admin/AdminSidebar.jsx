import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Image as ImageIcon,
  FolderTree,
  Sparkles,
  DollarSign,
  CalendarCheck,
  MessageSquare,
  Mail,
  Users,
  BarChart3,
  Settings,
  ExternalLink,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

const menuItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Designs', path: '/admin/designs', icon: ImageIcon },
  { name: 'Categories', path: '/admin/categories', icon: FolderTree },
  { name: 'Services', path: '/admin/services', icon: Sparkles },
  { name: 'Pricing', path: '/admin/pricing', icon: DollarSign },
  { name: 'Bookings', path: '/admin/bookings', icon: CalendarCheck },
  { name: 'Testimonials', path: '/admin/testimonials', icon: MessageSquare },
  { name: 'Inquiries', path: '/admin/inquiries', icon: Mail },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

export const AdminSidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const { settings } = useSettings();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#231A13] text-parchment-100 flex flex-col justify-between transition-transform duration-300 border-r border-[#3D2F24] lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="flex items-center justify-between p-5 border-b border-[#3D2F24]">
            <Link to="/admin/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-accent-500 text-espresso-900 font-serif font-bold flex items-center justify-center text-base">
                S
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-sm font-bold text-parchment-50 leading-none">
                  {settings.businessName || "Shreya's Mehndi Zone"}
                </span>
                <span className="text-[10px] text-accent-400 uppercase tracking-widest mt-1">
                  Admin Studio
                </span>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-parchment-200 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-170px)]">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-henna-700 text-white shadow-soft-sm font-semibold'
                      : 'text-parchment-200/80 hover:bg-[#34271D] hover:text-white'
                  }`
                }
              >
                <item.icon className="w-4 h-4 text-accent-400" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#3D2F24] space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs text-parchment-200/70 hover:text-white hover:bg-[#34271D] transition-colors"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={logout}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;

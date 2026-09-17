import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  Heart,
  Menu,
  X,
  Sparkles,
  Calendar,
  User,
  Shield,
  LogOut,
  Phone,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useSettings } from '../../context/SettingsContext';
import SearchModal from './SearchModal';
import Button from './Button';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const { favoriteCount } = useFavorites();
  const { settings, getWhatsAppLink } = useSettings();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Categories', path: '/categories' },
    { name: 'Services', path: '/services' },
    { name: 'Pricing', path: '/pricing' },
    {
      name: 'Virtual Try-On',
      path: '/try-on',
      highlight: true,
    },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-parchment-50/95 backdrop-blur-md shadow-soft-sm py-3 border-b border-parchment-200/80'
            : 'bg-parchment-50 py-4.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-full bg-henna-700 flex items-center justify-center text-parchment-50 shadow-soft-sm group-hover:scale-105 transition-transform">
              <span className="font-serif text-lg font-bold">S</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-espresso-900 group-hover:text-henna-700 transition-colors">
                {settings.businessName || "Shreya's Mehndi Zone"}
              </span>
              <span className="text-[10px] tracking-widest uppercase text-accent-600 -mt-1 font-medium">
                Bridal & Designer Henna
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2.5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 py-1.5 rounded-xl text-xs xl:text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-henna-800 font-semibold bg-henna-100/70'
                    : 'text-espresso-800 hover:text-henna-700 hover:bg-parchment-200/50'
                }`}
              >
                <span className="flex items-center gap-1">
                  {link.highlight && <Sparkles className="w-3.5 h-3.5 text-accent-500 fill-accent-400" />}
                  {link.name}
                </span>
              </Link>
            ))}
          </nav>

          {/* Right Action Icons & CTA */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 sm:p-2.5 rounded-full text-espresso-800 hover:text-henna-700 hover:bg-parchment-200/70 transition-colors"
              aria-label="Search designs"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Favorites Icon with Badge */}
            <Link
              to="/favorites"
              className="p-2 sm:p-2.5 rounded-full text-espresso-800 hover:text-henna-700 hover:bg-parchment-200/70 transition-colors relative"
              aria-label="Favorites"
            >
              <Heart className={`w-5 h-5 ${favoriteCount > 0 ? 'text-red-500 fill-red-500' : ''}`} />
              {favoriteCount > 0 && (
                <span className="absolute 0 top-1 right-1 w-4 h-4 bg-henna-700 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {favoriteCount}
                </span>
              )}
            </Link>

            {/* Book Appointment CTA */}
            <Link to="/book" className="hidden sm:inline-flex">
              <Button size="sm" variant="primary" icon={Calendar}>
                Book Appointment
              </Button>
            </Link>

            {/* User Profile / Admin Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-parchment-200/70 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-henna-600 text-white text-xs flex items-center justify-center font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline text-xs font-medium text-espresso-800 max-w-[90px] truncate">
                    {user.name}
                  </span>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-soft-lg border border-parchment-200 py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-parchment-200">
                      <p className="text-xs font-semibold text-espresso-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-espresso-700 truncate">
                        {user.email}
                      </p>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-henna-700 hover:bg-parchment-100"
                      >
                        <Shield className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-espresso-800 hover:bg-parchment-100"
                    >
                      <User className="w-4 h-4" />
                      <span>My Profile & Bookings</span>
                    </Link>

                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:inline-flex text-xs font-medium text-espresso-800 hover:text-henna-700 px-2.5 py-1.5 rounded-xl hover:bg-parchment-200/50"
              >
                Log In
              </Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-espresso-800 hover:bg-parchment-200/70"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-in Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-parchment-200 bg-parchment-50 px-5 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium ${
                  isActive(link.path)
                    ? 'bg-henna-700 text-white font-semibold'
                    : 'text-espresso-900 hover:bg-parchment-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  {link.highlight && <Sparkles className="w-4 h-4 text-accent-500" />}
                  {link.name}
                </span>
              </Link>
            ))}

            <div className="pt-3 border-t border-parchment-200/80 space-y-2.5">
              <Link to="/book" className="block w-full">
                <Button className="w-full" size="md">
                  Book Appointment
                </Button>
              </Link>

              {user ? (
                <div className="flex items-center justify-between px-2 pt-1">
                  <Link
                    to="/profile"
                    className="text-xs font-medium text-henna-700 underline"
                  >
                    View Account & Bookings
                  </Link>
                  <button
                    onClick={logout}
                    className="text-xs text-red-600 font-medium"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 pt-1">
                  <Link to="/login" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/register" className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navbar;

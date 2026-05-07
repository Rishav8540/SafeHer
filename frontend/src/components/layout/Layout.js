import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Shield, Home, Users, AlertTriangle, User, 
  LogOut, Moon, Sun, Menu, X, Settings, Bell, MessageCircle
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/emergency', icon: AlertTriangle, label: 'Emergency' },
  { path: '/contacts', icon: Users, label: 'Contacts' },
  { path: '/whatsapp', icon: MessageCircle, label: 'WhatsApp Network' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <span className="font-display font-bold text-lg text-white">SafeHer</span>
            <p className="text-white/40 text-xs">One Click Protection</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                active
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={20} className={active ? 'text-primary-400' : 'text-white/50 group-hover:text-white'} />
              <span className="font-medium text-sm">{label}</span>
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400" />}
            </Link>
          );
        })}

        {user?.isAdmin && (
          <Link
            to="/admin"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              location.pathname === '/admin'
                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings size={20} />
            <span className="font-medium text-sm">Admin Panel</span>
          </Link>
        )}
      </nav>

      {/* User info + actions */}
      <div className="p-4 border-t border-white/10">
        <div className="glass-card p-3 mb-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.profileImage 
              ? <img src={user.profileImage} alt="" className="w-full h-full rounded-full object-cover" />
              : user?.name?.charAt(0).toUpperCase()
            }
          </div>
          <div className="overflow-hidden">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-white/40 text-xs truncate">{user?.email}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={toggle}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all text-sm"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
            {dark ? 'Light' : 'Dark'}
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-primary-400 hover:text-white hover:bg-primary-500/20 transition-all text-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`flex min-h-screen ${dark ? 'gradient-bg' : 'gradient-bg-light'}`}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 glass border-r border-white/10 fixed h-full z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 h-full glass border-r border-white/10 flex flex-col">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white"
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar (mobile) */}
        <header className="lg:hidden glass border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="text-white/70 hover:text-white">
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-primary-400" />
            <span className="font-display font-bold text-white">SafeHer</span>
          </div>
          <button onClick={toggle} className="text-white/70 hover:text-white">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Emergency from './pages/Emergency';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import WhatsAppCommunity from './pages/WhatsAppCommunity';

// Layout
import Layout from './components/layout/Layout';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen gradient-bg">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full border-4 border-primary-500 border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-white/60 font-body">Loading SafeHer...</p>
      </div>
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  return user?.isAdmin ? children : <Navigate to="/dashboard" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>
      } />
      <Route path="/contacts" element={
        <ProtectedRoute><Layout><Contacts /></Layout></ProtectedRoute>
      } />
      <Route path="/emergency" element={
        <ProtectedRoute><Layout><Emergency /></Layout></ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>
      } />
      <Route path="/whatsapp" element={
        <ProtectedRoute><Layout><WhatsAppCommunity /></Layout></ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute><AdminRoute><Layout><Admin /></Layout></AdminRoute></ProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(26,26,46,0.95)',
                color: '#fff',
                border: '1px solid rgba(244,63,94,0.3)',
                borderRadius: '12px',
                backdropFilter: 'blur(20px)',
                fontFamily: 'DM Sans, sans-serif',
              },
              success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
              error: { iconTheme: { primary: '#f43f5e', secondary: '#fff' } },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

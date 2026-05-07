import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, User, Phone, Eye, EyeOff, ArrowLeft, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all required fields');
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      toast.success('Account created! Welcome to SafeHer 💖');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'name', label: 'Full Name', type: 'text', icon: User, placeholder: 'Your full name', required: true },
    { key: 'email', label: 'Email Address', type: 'email', icon: Mail, placeholder: 'your@email.com', required: true },
    { key: 'phone', label: 'Phone Number', type: 'tel', icon: Phone, placeholder: '+91 XXXXX XXXXX', required: false },
  ];

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-8">
      <div className="fixed top-0 right-0 w-96 h-96 rounded-full bg-primary-600/20 blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-96 h-96 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 text-white/50 hover:text-white transition mb-8 text-sm">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-primary-500/40">
              <Heart size={28} className="text-white" />
            </div>
            <h1 className="font-display text-3xl font-bold text-white">Join SafeHer</h1>
            <p className="text-white/50 mt-1 text-sm">Create your safety account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ key, label, type, icon: Icon, placeholder, required }) => (
              <div key={key}>
                <label className="text-white/70 text-sm font-medium mb-2 block">
                  {label} {required && <span className="text-primary-400">*</span>}
                </label>
                <div className="relative">
                  <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type={type}
                    value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className="input-glass pl-11 text-white"
                    placeholder={placeholder}
                    required={required}
                  />
                </div>
              </div>
            ))}

            <div>
              <label className="text-white/70 text-sm font-medium mb-2 block">Password <span className="text-primary-400">*</span></label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="input-glass pl-11 pr-11 text-white"
                  placeholder="Min. 6 characters"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-white/70 text-sm font-medium mb-2 block">Confirm Password <span className="text-primary-400">*</span></label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="password"
                  value={form.confirm}
                  onChange={e => setForm({ ...form, confirm: e.target.value })}
                  className="input-glass pl-11 text-white"
                  placeholder="Repeat your password"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 disabled:opacity-50 text-white py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating Account...</>
                ) : (
                  <><Shield size={16} /> Create My Safe Account</>
                )}
              </button>
            </div>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            Already protected?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

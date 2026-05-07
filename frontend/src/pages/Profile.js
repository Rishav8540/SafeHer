import React, { useState, useRef } from 'react';
import { User, Mail, Phone, MapPin, Edit2, Save, Camera, Shield, Heart, Droplets, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../utils/api';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    bloodGroup: user?.bloodGroup || '',
    medicalInfo: user?.medicalInfo || '',
  });
  const fileRef = useRef(null);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data } = await usersAPI.updateProfile(form);
      updateUser(data.user);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Failed to update profile');
    }
    setLoading(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error('Image too large. Max 5MB.');

    const formData = new FormData();
    formData.append('image', file);
    try {
      const { data } = await usersAPI.uploadImage(formData);
      updateUser(data.user);
      toast.success('Profile photo updated!');
    } catch {
      toast.error('Failed to upload image');
    }
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  const fields = [
    { key: 'name', label: 'Full Name', icon: User, type: 'text', placeholder: 'Your full name' },
    { key: 'phone', label: 'Phone Number', icon: Phone, type: 'tel', placeholder: '+91 XXXXX XXXXX' },
    { key: 'address', label: 'Address', icon: MapPin, type: 'text', placeholder: 'Your home address' },
    { key: 'bloodGroup', label: 'Blood Group', icon: Droplets, type: 'text', placeholder: 'e.g. O+, A-, B+' },
  ];

  return (
    <div className="space-y-6 animate-slide-up max-w-2xl">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">My Profile</h1>
        <p className="text-white/40 mt-1">Your personal information and safety details</p>
      </div>

      {/* Profile Card */}
      <div className="glass-card p-8">
        {/* Avatar */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-display font-bold text-3xl shadow-2xl shadow-primary-500/40 overflow-hidden">
              {user?.profileImage 
                ? <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                : initials
              }
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center text-white shadow-lg hover:scale-110 transition"
            >
              <Camera size={14} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>

          <div className="text-center sm:text-left">
            <h2 className="font-display text-2xl font-bold text-white">{user?.name}</h2>
            <p className="text-white/50 flex items-center justify-center sm:justify-start gap-1.5 mt-1">
              <Mail size={13} className="text-primary-400" /> {user?.email}
            </p>
            {user?.phone && (
              <p className="text-white/50 flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                <Phone size={13} className="text-emerald-400" /> {user.phone}
              </p>
            )}
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
              <div className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-full">
                <Shield size={12} className="text-primary-400" />
                <span className="text-white/70 text-xs">Protected Member</span>
              </div>
              {user?.isAdmin && (
                <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-full">
                  <span className="text-amber-400 text-xs font-medium">Admin</span>
                </div>
              )}
            </div>
          </div>

          <div className="sm:ml-auto">
            <button
              onClick={() => editing ? handleSave() : setEditing(true)}
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:from-primary-500 hover:to-primary-400 transition shadow-lg shadow-primary-500/30 disabled:opacity-50"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : editing ? <><Save size={14} /> Save Changes</> : <><Edit2 size={14} /> Edit Profile</>}
            </button>
          </div>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {fields.map(({ key, label, icon: Icon, type, placeholder }) => (
            <div key={key}>
              <label className="text-white/50 text-xs font-medium mb-2 flex items-center gap-1.5">
                <Icon size={12} className="text-primary-400" /> {label}
              </label>
              {editing ? (
                <input
                  type={type}
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  className="input-glass text-white text-sm"
                  placeholder={placeholder}
                />
              ) : (
                <div className="input-glass text-white/80 text-sm">
                  {user?.[key] || <span className="text-white/25">Not set</span>}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Medical Info */}
        <div className="mt-5">
          <label className="text-white/50 text-xs font-medium mb-2 flex items-center gap-1.5">
            <FileText size={12} className="text-primary-400" /> Medical Information
            <span className="text-white/20 text-xs">(shown to emergency responders)</span>
          </label>
          {editing ? (
            <textarea
              value={form.medicalInfo}
              onChange={e => setForm({ ...form, medicalInfo: e.target.value })}
              className="input-glass text-white text-sm min-h-[80px] resize-none"
              placeholder="Allergies, medications, conditions... (helps emergency responders)"
            />
          ) : (
            <div className="input-glass text-white/80 text-sm min-h-[60px]">
              {user?.medicalInfo || <span className="text-white/25">No medical info added</span>}
            </div>
          )}
        </div>

        {editing && (
          <div className="mt-4 flex gap-3">
            <button onClick={handleSave} disabled={loading}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold hover:from-primary-500 transition disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
              Save Changes
            </button>
            <button onClick={() => { setEditing(false); setForm({ name: user?.name||'', phone: user?.phone||'', address: user?.address||'', bloodGroup: user?.bloodGroup||'', medicalInfo: user?.medicalInfo||'' }); }}
              className="px-5 py-3 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 transition">
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Safety tip */}
      <div className="glass-card p-4 flex gap-3 border border-primary-500/20">
        <Heart size={18} className="text-primary-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-white text-sm font-medium">Keep Your Info Updated</p>
          <p className="text-white/50 text-xs mt-0.5">
            An accurate phone number and address help emergency responders reach you faster. Your blood group can be life-saving information.
          </p>
        </div>
      </div>
    </div>
  );
}

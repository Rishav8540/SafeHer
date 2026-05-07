import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, Phone, Mail, User, Heart, Save, X, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { contactsAPI } from '../utils/api';

const relations = ['Brother', 'Sister', 'Mother', 'Father', 'Husband', 'Friend', 'Colleague', 'Neighbor', 'Other'];

const relationColors = {
  'Brother': 'from-blue-500 to-indigo-600',
  'Sister': 'from-pink-500 to-rose-600',
  'Mother': 'from-violet-500 to-purple-600',
  'Father': 'from-emerald-500 to-teal-600',
  'Husband': 'from-amber-500 to-orange-600',
  'Friend': 'from-cyan-500 to-sky-600',
  'default': 'from-primary-500 to-rose-600',
};

function ContactCard({ contact, onEdit, onDelete }) {
  const color = relationColors[contact.relation] || relationColors.default;
  return (
    <div className="glass-card p-5 flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg`}>
        {contact.name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-white font-semibold">{contact.name}</h3>
            <span className="text-xs text-white/40 bg-white/10 px-2 py-0.5 rounded-full">{contact.relation}</span>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <button onClick={() => onEdit(contact)} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition">
              <Edit2 size={14} />
            </button>
            <button onClick={() => onDelete(contact._id)} className="p-2 rounded-lg text-white/40 hover:text-primary-400 hover:bg-primary-500/10 transition">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        <div className="mt-2 space-y-1">
          <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition">
            <Phone size={12} className="text-emerald-400 flex-shrink-0" />
            <span className="truncate">{contact.phone}</span>
          </a>
          {contact.email && (
            <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition">
              <Mail size={12} className="text-blue-400 flex-shrink-0" />
              <span className="truncate">{contact.email}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function ContactForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || { name: '', relation: 'Friend', phone: '', email: '', priority: 2 });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return toast.error('Name and phone are required');
    setLoading(true);
    try {
      await onSave(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 border border-primary-500/20">
      <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
        <Heart size={16} className="text-primary-400" />
        {initial ? 'Edit Contact' : 'Add Trusted Contact'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-white/60 text-xs mb-1 block">Full Name *</label>
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="input-glass pl-9 text-white text-sm" placeholder="Contact's name" required />
            </div>
          </div>
          <div>
            <label className="text-white/60 text-xs mb-1 block">Relation</label>
            <select value={form.relation} onChange={e => setForm({...form, relation: e.target.value})}
              className="input-glass text-white text-sm bg-transparent cursor-pointer">
              {relations.map(r => <option key={r} value={r} className="bg-gray-900">{r}</option>)}
            </select>
          </div>
          <div>
            <label className="text-white/60 text-xs mb-1 block">Phone Number *</label>
            <div className="relative">
              <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                className="input-glass pl-9 text-white text-sm" placeholder="+91 XXXXX XXXXX" type="tel" required />
            </div>
          </div>
          <div>
            <label className="text-white/60 text-xs mb-1 block">Email (for alerts)</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="input-glass pl-9 text-white text-sm" placeholder="email@example.com" type="email" />
            </div>
          </div>
        </div>
        <div>
          <label className="text-white/60 text-xs mb-2 block">Priority</label>
          <div className="flex gap-2">
            {[{v:1, l:'High'}, {v:2, l:'Medium'}, {v:3, l:'Low'}].map(({v, l}) => (
              <button key={v} type="button" onClick={() => setForm({...form, priority: v})}
                className={`flex-1 py-2 rounded-xl text-xs font-medium transition ${
                  form.priority === v 
                    ? v === 1 ? 'bg-red-500/30 text-red-400 border border-red-500/40' 
                      : v === 2 ? 'bg-amber-500/30 text-amber-400 border border-amber-500/40'
                      : 'bg-blue-500/30 text-blue-400 border border-blue-500/40'
                    : 'bg-white/5 text-white/40 hover:bg-white/10'
                }`}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:from-primary-500 hover:to-primary-400 transition disabled:opacity-50">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
            {initial ? 'Update Contact' : 'Add Contact'}
          </button>
          <button type="button" onClick={onCancel}
            className="px-4 py-2.5 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 transition text-sm flex items-center gap-1">
            <X size={14} /> Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => { fetchContacts(); }, []);

  const fetchContacts = async () => {
    try {
      const { data } = await contactsAPI.getAll();
      setContacts(data.contacts || []);
    } catch { toast.error('Failed to load contacts'); }
    setLoading(false);
  };

  const handleSave = async (form) => {
    try {
      if (editing) {
        await contactsAPI.update(editing._id, form);
        toast.success('Contact updated!');
      } else {
        await contactsAPI.add(form);
        toast.success('Contact added to your safety circle!');
      }
      setShowForm(false);
      setEditing(null);
      fetchContacts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this contact from your safety circle?')) return;
    try {
      await contactsAPI.delete(id);
      toast.success('Contact removed');
      fetchContacts();
    } catch { toast.error('Failed to remove'); }
  };

  const handleEdit = (contact) => {
    setEditing(contact);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Trusted Contacts</h1>
          <p className="text-white/40 mt-1">Your safety circle — people who will come to your rescue</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditing(null); }}
          className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:from-primary-500 hover:to-primary-400 transition shadow-lg shadow-primary-500/30"
        >
          <Plus size={16} />
          Add Contact
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Contacts', value: contacts.length, color: 'text-primary-400' },
          { label: 'With Email Alert', value: contacts.filter(c => c.email).length, color: 'text-blue-400' },
          { label: 'High Priority', value: contacts.filter(c => c.priority === 1).length, color: 'text-emerald-400' },
        ].map(({label, value, color}) => (
          <div key={label} className="glass-card p-4 text-center">
            <div className={`text-2xl font-bold font-display ${color}`}>{value}</div>
            <div className="text-white/40 text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <ContactForm
          initial={editing}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      {/* Contact List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : contacts.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Users size={48} className="text-white/20 mx-auto mb-4" />
          <h3 className="text-white font-semibold text-lg mb-2">No contacts yet</h3>
          <p className="text-white/40 text-sm mb-6">Add your trusted people — the ones who will come when you call.</p>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-3 rounded-xl font-medium mx-auto hover:from-primary-500 transition">
            <Plus size={16} /> Add Your First Contact
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.map(c => (
            <ContactCard key={c._id} contact={c} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Tip */}
      <div className="glass-card p-4 flex gap-3 border border-blue-500/20 bg-blue-500/5">
        <Shield size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-white text-sm font-medium">Pro Safety Tip</p>
          <p className="text-white/50 text-xs mt-0.5">
            Add at least 3-5 contacts with their email addresses. During an SOS, all contacts with email will receive your live location immediately. Add your brother, parents, and a trusted friend.
          </p>
        </div>
      </div>
    </div>
  );
}

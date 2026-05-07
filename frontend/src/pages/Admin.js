import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle, Shield, BarChart2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminAPI } from '../utils/api';

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [s, u, a] = await Promise.all([
        adminAPI.getStats(), adminAPI.getUsers(), adminAPI.getAlerts()
      ]);
      setStats(s.data);
      setUsers(u.data.users || []);
      setAlerts(a.data.alerts || []);
    } catch { toast.error('Failed to load admin data'); }
    setLoading(false);
  };

  const toggleUser = async (id) => {
    try {
      const { data } = await adminAPI.toggleUser(id);
      setUsers(prev => prev.map(u => u._id === id ? data.user : u));
      toast.success(data.message);
    } catch { toast.error('Failed to update user'); }
  };

  const statCards = stats ? [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'from-violet-500 to-purple-600', glow: 'shadow-violet-500/30' },
    { label: 'Total Alerts', value: stats.totalAlerts, icon: AlertTriangle, color: 'from-primary-500 to-rose-600', glow: 'shadow-primary-500/30' },
    { label: 'Active Emergencies', value: stats.activeAlerts, icon: Shield, color: 'from-red-500 to-red-700', glow: 'shadow-red-500/30' },
    { label: 'Trusted Contacts', value: stats.totalContacts, icon: BarChart2, color: 'from-emerald-500 to-teal-600', glow: 'shadow-emerald-500/30' },
  ] : [];

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Admin Panel</h1>
          <p className="text-white/40 mt-1">SafeHer management dashboard</p>
        </div>
        <button onClick={fetchAll} className="flex items-center gap-2 glass px-4 py-2.5 rounded-xl text-white/60 hover:text-white transition text-sm">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, glow }) => (
          <div key={label} className={`glass-card p-5 shadow-lg ${glow}`}>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
              <Icon size={18} className="text-white" />
            </div>
            <div className="text-2xl font-bold font-display text-white">{value}</div>
            <div className="text-white/40 text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {['overview', 'users', 'alerts'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition capitalize ${
              tab === t ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : tab === 'users' ? (
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-white font-semibold">All Users ({users.length})</h3>
          </div>
          <div className="divide-y divide-white/5">
            {users.map(u => (
              <div key={u._id} className="p-4 flex items-center gap-4 hover:bg-white/5 transition">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-rose-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {u.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium flex items-center gap-2">
                    {u.name} {u.isAdmin && <span className="text-xs bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">Admin</span>}
                  </p>
                  <p className="text-white/40 text-xs">{u.email} • Joined {new Date(u.createdAt).toLocaleDateString()}</p>
                </div>
                <button onClick={() => toggleUser(u._id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                    u.isActive ? 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20' : 'text-red-400 bg-red-500/10 hover:bg-red-500/20'
                  }`}>
                  {u.isActive ? <><CheckCircle size={12} /> Active</> : <><XCircle size={12} /> Inactive</>}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : tab === 'alerts' ? (
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-white font-semibold">Emergency Alerts ({alerts.length})</h3>
          </div>
          <div className="divide-y divide-white/5">
            {alerts.map(a => (
              <div key={a._id} className="p-4 flex items-center gap-4 hover:bg-white/5 transition">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${a.status === 'ACTIVE' ? 'bg-red-500/20' : 'bg-emerald-500/20'}`}>
                  <AlertTriangle size={18} className={a.status === 'ACTIVE' ? 'text-red-400' : 'text-emerald-400'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{a.type} — {a.userId?.name || 'Unknown'}</p>
                  <p className="text-white/40 text-xs">{a.userId?.email} • {new Date(a.createdAt).toLocaleString()}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${a.status === 'ACTIVE' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {a.status}
                </span>
              </div>
            ))}
            {alerts.length === 0 && <div className="p-8 text-center text-white/40 text-sm">No emergency alerts yet</div>}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {alerts.slice(0, 5).map(a => (
                <div key={a._id} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${a.status === 'ACTIVE' ? 'bg-red-400' : 'bg-emerald-400'}`} />
                  <p className="text-white/60 text-sm flex-1">{a.type} by {a.userId?.name || 'User'}</p>
                  <p className="text-white/30 text-xs">{new Date(a.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
              {alerts.length === 0 && <p className="text-white/30 text-sm">No recent activity</p>}
            </div>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-white font-semibold mb-4">System Status</h3>
            <div className="space-y-3">
              {[
                { label: 'API Server', ok: true },
                { label: 'Database', ok: true },
                { label: 'Email Service', ok: !!process.env.REACT_APP_API_URL },
                { label: 'SMS Service', ok: false },
              ].map(({ label, ok }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">{label}</span>
                  <span className={`flex items-center gap-1 text-xs ${ok ? 'text-emerald-400' : 'text-amber-400'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${ok ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    {ok ? 'Online' : 'Configure'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

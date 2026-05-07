import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, Users, Phone, MapPin, Clock, Mic, Video, Star, ChevronRight, CheckCircle, XCircle, Bell, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { alertsAPI } from '../utils/api';

const safetyCards = [
  { icon: AlertTriangle, title: 'Emergency Center', desc: 'SOS, Police & Quick alerts', path: '/emergency', color: 'from-red-500 to-rose-600', glow: 'shadow-red-500/30' },
  { icon: Users, title: 'Trusted Contacts', desc: 'Manage your safety circle', path: '/contacts', color: 'from-violet-500 to-purple-600', glow: 'shadow-violet-500/30' },
  { icon: MapPin, title: 'Live Location', desc: 'Share location in real-time', path: '/emergency', color: 'from-emerald-500 to-teal-600', glow: 'shadow-emerald-500/30' },
  { icon: Star, title: 'Fake Call', desc: 'Escape uncomfortable situations', path: '/emergency', color: 'from-amber-500 to-orange-600', glow: 'shadow-amber-500/30' },
  { icon: Mic, title: 'Voice Trigger', desc: '"Help me" = instant SOS', path: '/emergency', color: 'from-cyan-500 to-sky-600', glow: 'shadow-cyan-500/30' },
  { icon: Video, title: 'Evidence Guard', desc: 'Auto-record during emergency', path: '/emergency', color: 'from-pink-500 to-rose-600', glow: 'shadow-pink-500/30' },
  { icon: Clock, title: 'Safety Timer', desc: 'Auto-alert if check-in missed', path: '/emergency', color: 'from-lime-500 to-green-600', glow: 'shadow-lime-500/30' },
  { icon: Phone, title: 'Helpline Numbers', desc: 'National emergency contacts', path: '/emergency', color: 'from-blue-500 to-indigo-600', glow: 'shadow-blue-500/30' },
];

function QuickSOSButton({ onTrigger }) {
  const [pressed, setPressed] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const handlePress = () => {
    setPressed(true);
    let count = 3;
    setCountdown(count);
    const timer = setInterval(() => {
      count--;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(timer);
        setCountdown(null);
        onTrigger();
        setTimeout(() => setPressed(false), 2000);
      }
    }, 1000);
  };

  const handleCancel = () => {
    setPressed(false);
    setCountdown(null);
  };

  return (
    <div className="text-center">
      <div className="relative inline-block">
        {/* Pulse rings */}
        {pressed && (
          <>
            <div className="absolute inset-0 rounded-full bg-primary-500/30 animate-ping scale-125" />
            <div className="absolute inset-0 rounded-full bg-primary-500/20 animate-ping scale-150" style={{ animationDelay: '0.3s' }} />
          </>
        )}
        <button
          onClick={pressed ? handleCancel : handlePress}
          className={`sos-btn w-40 h-40 rounded-full text-white font-display font-bold text-2xl relative z-10 transition-all duration-300 ${pressed ? 'scale-95' : 'hover:scale-105'}`}
        >
          {countdown !== null ? (
            <div>
              <div className="text-5xl font-bold">{countdown}</div>
              <div className="text-xs mt-1 text-white/70">Tap to cancel</div>
            </div>
          ) : (
            <div>
              <div className="text-4xl font-bold">SOS</div>
              <div className="text-xs mt-1 text-white/70">Hold to activate</div>
            </div>
          )}
        </button>
      </div>
      <p className="text-white/40 text-xs mt-4">
        {pressed ? '🔴 Sending in seconds — tap button to cancel' : 'Press the SOS button in an emergency'}
      </p>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    fetchAlerts();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      );
    }
  }, []);

  const fetchAlerts = async () => {
    try {
      const { data } = await alertsAPI.getHistory();
      setAlerts(data.alerts || []);
    } catch (err) {}
    setLoading(false);
  };

  const triggerSOS = async () => {
    try {
      const res = await alertsAPI.triggerSOS({
        lat: location?.lat,
        lng: location?.lng,
        address: 'Live location',
        type: 'SOS'
      });
      toast.success(`🚨 SOS Activated! ${res.data.contactsNotified} contacts notified`);
      fetchAlerts();
      // Alarm sound
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.value = 0.3;
      osc.start();
      setTimeout(() => osc.stop(), 2000);
    } catch {
      toast.error('Failed to send SOS. Check your network connection.');
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-white/50 text-sm font-medium">{getGreeting()},</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mt-1">
            {user?.name?.split(' ')[0]} <span className="text-primary-400">✨</span>
          </h1>
          <p className="text-white/40 text-sm mt-1">You're protected. SafeHer is watching over you.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass-card px-4 py-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-sm font-medium">Protected</span>
          </div>
          {location && (
            <div className="glass-card px-4 py-3 flex items-center gap-2">
              <MapPin size={14} className="text-blue-400" />
              <span className="text-white/60 text-sm">Location Active</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick SOS Banner */}
      <div className="glass-card p-6 md:p-8 border border-primary-500/20 bg-gradient-to-r from-primary-900/40 to-rose-900/20">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
              <span className="text-primary-400 text-sm font-medium uppercase tracking-wide">Emergency Ready</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
              Your Safety Button is <span className="text-primary-400">Always On</span>
            </h2>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              In an emergency, press SOS. Your location + alert will immediately reach all your trusted contacts. Stay strong — help is always a click away.
            </p>
            <Link to="/emergency" className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition text-sm font-medium">
              Go to Emergency Center <ChevronRight size={14} />
            </Link>
          </div>
          <QuickSOSButton onTrigger={triggerSOS} />
        </div>
      </div>

      {/* Safety Tools Grid */}
      <div>
        <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
          <Shield size={20} className="text-primary-400" />
          Your Safety Tools
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {safetyCards.map(({ icon: Icon, title, desc, path, color, glow }) => (
            <Link key={title} to={path} className={`glass-card p-5 block shadow-lg ${glow} group`}>
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon size={20} className="text-white" />
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
              <p className="text-white/40 text-xs leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* WhatsApp Community Banner */}
      <div className="glass-card p-5 border border-green-500/30 bg-gradient-to-r from-green-900/20 to-emerald-900/10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-2xl flex-shrink-0 shadow-lg shadow-green-500/30">
            💬
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm">Join SafeHer WhatsApp Safety Network</h3>
            <p className="text-white/40 text-xs mt-0.5">Connect with nearby volunteers who can help in emergencies</p>
          </div>
          <Link
            to="/whatsapp"
            className="flex items-center gap-1 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition flex-shrink-0"
          >
            <MessageCircle size={12} /> Join Now
          </Link>
        </div>
      </div>

      {/* Recent Alerts */}
      <div>
        <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
          <Bell size={20} className="text-primary-400" />
          Recent Alerts
        </h2>
        <div className="glass-card overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : alerts.length === 0 ? (
            <div className="p-10 text-center">
              <CheckCircle size={40} className="text-emerald-400 mx-auto mb-3" />
              <p className="text-white/60 font-medium">No emergency alerts</p>
              <p className="text-white/30 text-sm mt-1">You're safe. Stay protected!</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {alerts.slice(0, 5).map((alert) => (
                <div key={alert._id} className="p-4 flex items-center gap-4 hover:bg-white/5 transition">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    alert.status === 'ACTIVE' ? 'bg-red-500/20' : 'bg-emerald-500/20'
                  }`}>
                    {alert.status === 'ACTIVE' 
                      ? <AlertTriangle size={18} className="text-red-400" />
                      : <CheckCircle size={18} className="text-emerald-400" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">{alert.type} Alert</p>
                    <p className="text-white/40 text-xs truncate">
                      {alert.location?.address || 'Location recorded'} • {new Date(alert.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    alert.status === 'ACTIVE' 
                      ? 'bg-red-500/20 text-red-400' 
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {alert.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

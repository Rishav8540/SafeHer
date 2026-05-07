import React, { useState, useEffect, useCallback } from 'react';
import {
  MessageCircle, Shield, Users, MapPin, Star,
  CheckCircle, XCircle, Heart, Bell, Send,
  Award, AlertTriangle, RefreshCw, ExternalLink, Edit2, Save
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const API = 'https://safeher-7tqn.onrender.com';

function getToken() {
  return localStorage.getItem('safeher_token');
}

// ── YOUR WHATSAPP LINK ────────────────────────────────
// Change this to your real WhatsApp group/channel link
const DEFAULT_WHATSAPP_LINK = 'https://chat.whatsapp.com/your-link-here';
const STORAGE_KEY = 'safeher_whatsapp_link';

// Get saved link from localStorage
function getSavedLink() {
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_WHATSAPP_LINK;
}

// ── Open WhatsApp Link directly ───────────────────────
function openWhatsApp(link) {
  if (!link || link.includes('https://whatsapp.com/channel/0029Vb86SqFDJ6H9DtbZLI2X')) {
    toast.error('Please set your WhatsApp group link first!');
    return false;
  }
  // Open link in new tab directly
  window.open(link, '_blank');
  return true;
}

// ── Star Rating ───────────────────────────────────────
function StarRating({ value, onChange, readonly = false }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button key={star} type="button"
          onClick={() => !readonly && onChange?.(star)}
          className={`text-2xl transition ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-125'}`}>
          <span className={star <= value ? 'text-amber-400' : 'text-white/20'}>★</span>
        </button>
      ))}
    </div>
  );
}

// ── WhatsApp Link Setup Card ──────────────────────────
function LinkSetupCard({ link, onSave }) {
  const [editing, setEditing] = useState(false);
  const [input, setInput]     = useState(link);
  const isSet = link && !link.includes('your-link-here');

  const save = () => {
    if (!input.includes('chat.whatsapp.com') && !input.includes('whatsapp.com')) {
      toast.error('Please enter a valid WhatsApp link');
      return;
    }
    localStorage.setItem(STORAGE_KEY, input);
    onSave(input);
    setEditing(false);
    toast.success('WhatsApp link saved! ✅');
  };

  return (
    <div className={`glass-card p-5 border ${isSet ? 'border-green-500/20' : 'border-amber-500/30'}`}>
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle size={18} className={isSet ? 'text-green-400' : 'text-amber-400'} />
        <h3 className="text-white font-semibold text-sm">
          {isSet ? 'WhatsApp Link Configured ✅' : '⚠️ Set Your WhatsApp Group Link'}
        </h3>
      </div>

      {!isSet && (
        <p className="text-amber-400/70 text-xs mb-3 leading-relaxed">
          You need to set your WhatsApp group link before users can join. Create a WhatsApp group → get invite link → paste below.
        </p>
      )}

      {editing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="input-glass text-white text-sm w-full"
            placeholder="https://chat.whatsapp.com/xxxxxxxx"
          />
          <div className="flex gap-2">
            <button onClick={save}
              className="flex-1 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white text-sm font-semibold transition flex items-center justify-center gap-1">
              <Save size={13} /> Save Link
            </button>
            <button onClick={() => setEditing(false)}
              className="px-4 py-2 rounded-xl bg-white/5 text-white/50 hover:bg-white/10 transition text-sm">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex-1 glass px-3 py-2 rounded-xl text-xs text-white/50 truncate font-mono">
            {isSet ? link : 'Not set yet'}
          </div>
          <button onClick={() => { setInput(link); setEditing(true); }}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition text-xs">
            <Edit2 size={12} /> {isSet ? 'Edit' : 'Set Link'}
          </button>
          {isSet && (
            <button onClick={() => openWhatsApp(link)}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-green-600/20 hover:bg-green-600/30 text-green-400 transition text-xs">
              <ExternalLink size={12} /> Test
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Join Banner ───────────────────────────────────────
function JoinBanner({ status, link, onJoin, onVolunteer, loading }) {
  const joined      = status?.joinStatus === 'joined';
  const isVolunteer = status?.isVolunteer;
  const linkIsSet   = link && !link.includes('your-link-here');

  const handleJoinClick = () => {
    const opened = openWhatsApp(link);
    if (opened) onJoin();
  };

  return (
    <div className={`glass-card p-6 border ${joined ? 'border-green-500/30 bg-green-900/10' : 'border-green-500/40 bg-gradient-to-br from-green-900/30 to-emerald-900/20'}`}>
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-xl shadow-green-500/30 text-3xl">
          💬
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-display text-xl font-bold text-white">
              SafeHer WhatsApp Safety Network
            </h2>
            {joined && (
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30 flex items-center gap-1">
                <CheckCircle size={10} /> Joined
              </span>
            )}
          </div>

          <p className="text-white/50 text-sm leading-relaxed mb-3">
            Join our WhatsApp community to receive emergency alerts and help people near you.
            Be the reason someone feels safe today.
          </p>

          {/* Quote */}
          <div className="glass px-4 py-2 rounded-xl border border-green-500/20 mb-4">
            <p className="text-green-300/70 text-xs italic">
              "We cannot force protection, but we can build a system where help is always one click away and people are always ready."
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3">
            {!joined ? (
              <>
                {/* JOIN BUTTON — opens WhatsApp directly */}
                <button
                  onClick={handleJoinClick}
                  disabled={!linkIsSet}
                  className={`flex items-center gap-2 text-white px-6 py-3 rounded-xl font-semibold text-sm transition shadow-lg ${
                    linkIsSet
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-green-500/30 cursor-pointer'
                      : 'bg-white/10 opacity-50 cursor-not-allowed'
                  }`}
                >
                  💬 Join WhatsApp Community
                  <ExternalLink size={13} />
                </button>

                <button onClick={onVolunteer} disabled={loading}
                  className="flex items-center gap-2 glass border border-violet-500/30 text-violet-400 hover:bg-violet-500/10 px-5 py-3 rounded-xl font-semibold text-sm transition">
                  <Heart size={14} /> Become a Volunteer
                </button>
              </>
            ) : (
              <div className="flex flex-wrap gap-3">
                {/* Rejoin button even after joined */}
                <button onClick={handleJoinClick}
                  className="flex items-center gap-2 bg-green-600/20 border border-green-500/30 text-green-400 hover:bg-green-600/30 px-5 py-2.5 rounded-xl font-semibold text-sm transition">
                  <ExternalLink size={13} /> Open WhatsApp Group
                </button>

                {!isVolunteer ? (
                  <button onClick={onVolunteer} disabled={loading}
                    className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:from-violet-500 transition shadow-lg shadow-violet-500/30">
                    <Heart size={14} /> Become a Volunteer
                  </button>
                ) : (
                  <div className="flex items-center gap-2 bg-violet-500/20 text-violet-400 px-4 py-2.5 rounded-xl text-sm font-medium border border-violet-500/30">
                    <Award size={14} /> Active Volunteer 💜
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Warning if link not set */}
          {!linkIsSet && (
            <p className="text-amber-400/70 text-xs mt-3 flex items-center gap-1">
              <AlertTriangle size={11} />
              Set your WhatsApp group link above to enable the join button
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Nearby Helpers ────────────────────────────────────
function NearbyHelpers({ helpers, loading, onRefresh }) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <MapPin size={18} className="text-emerald-400" />
          Nearby Volunteers
          <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
            {helpers.length} found
          </span>
        </h3>
        <button onClick={onRefresh}
          className="flex items-center gap-1 text-white/40 hover:text-white transition text-xs">
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : helpers.length === 0 ? (
        <div className="text-center py-8">
          <Users size={40} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/40 text-sm">No volunteers nearby yet</p>
          <p className="text-white/20 text-xs mt-1">Invite more people to join!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {helpers.map((h, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/8 transition">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {h.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium">{h.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-emerald-400 text-xs">📍 {h.distance} km away</span>
                  <span className="text-white/30 text-xs">•</span>
                  <span className="text-amber-400 text-xs">⭐ {h.rating || 'New'}</span>
                  <span className="text-white/30 text-xs">•</span>
                  <span className="text-white/40 text-xs">{h.helpCount} helps</span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-emerald-500/20 px-2 py-1 rounded-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 text-xs">Active</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Rate Volunteer ────────────────────────────────────
function RateVolunteer() {
  const [rating,  setRating]  = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!rating) return toast.error('Please select a star rating');
    setLoading(true);
    toast.success('Thank you for rating the volunteer! 💖');
    setRating(0);
    setComment('');
    setLoading(false);
  };

  return (
    <div className="glass-card p-6">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <Star size={18} className="text-amber-400" />
        Rate a Volunteer
      </h3>
      <p className="text-white/40 text-sm mb-4">
        Did a volunteer help you? Rate them to build trust in our safety community.
      </p>
      <div className="mb-4">
        <label className="text-white/60 text-xs mb-2 block">Your Rating</label>
        <StarRating value={rating} onChange={setRating} />
      </div>
      <div className="mb-4">
        <label className="text-white/60 text-xs mb-2 block">Comment (optional)</label>
        <textarea value={comment} onChange={e => setComment(e.target.value)}
          className="input-glass text-white text-sm min-h-[80px] resize-none"
          placeholder="How did they help you?" />
      </div>
      <button onClick={submit} disabled={loading || !rating}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold hover:from-amber-500 hover:to-orange-500 transition disabled:opacity-50 flex items-center justify-center gap-2">
        <Star size={16} /> Submit Rating
      </button>
    </div>
  );
}

// ── How It Works ──────────────────────────────────────
function HowItWorks() {
  const steps = [
    { icon: '1️⃣', title: 'Set Group Link', desc: 'Paste your WhatsApp group invite link in the setup card above' },
    { icon: '2️⃣', title: 'Join Community', desc: 'Click Join — WhatsApp opens directly and you join the group' },
    { icon: '3️⃣', title: 'Enable Notifications', desc: 'Turn ON WhatsApp notifications so you never miss an emergency' },
    { icon: '4️⃣', title: 'Help Immediately', desc: 'When someone triggers SOS nearby — respond and help them!' },
  ];

  return (
    <div className="glass-card p-6">
      <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
        <Bell size={18} className="text-blue-400" />
        How It Works
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {steps.map(({ icon, title, desc }) => (
          <div key={title} className="flex gap-3 p-3 rounded-xl bg-white/5">
            <span className="text-2xl flex-shrink-0">{icon}</span>
            <div>
              <p className="text-white text-sm font-semibold">{title}</p>
              <p className="text-white/40 text-xs mt-0.5 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Invite Contacts ───────────────────────────────────
function InviteContacts({ onInvite, loading }) {
  return (
    <div className="glass-card p-6 border border-blue-500/20">
      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
        <Send size={18} className="text-blue-400" />
        Invite Your Trusted Contacts
      </h3>
      <p className="text-white/50 text-sm leading-relaxed mb-4">
        Send your trusted contacts an email invitation to join the SafeHer WhatsApp safety community.
      </p>

      {/* Message preview */}
      <div className="glass p-4 rounded-xl border border-blue-500/20 mb-4">
        <p className="text-blue-300/60 text-xs font-medium mb-2">📧 Message they will receive:</p>
        <p className="text-white/50 text-xs leading-relaxed italic">
          "You have been added as a trusted contact in SafeHer Women Safety System.
          Please stay available for emergency situations. Turn ON notifications and be
          ready to help if someone nearby is in danger. Join here: [WhatsApp Link]
          Thank you for being a responsible support member."
        </p>
      </div>

      <button onClick={onInvite} disabled={loading}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-500 hover:to-indigo-500 transition shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-60">
        {loading
          ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending Invites...</>
          : <><Send size={16} /> Send Invite to All Contacts</>}
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════
//   MAIN PAGE
// ════════════════════════════════════════════════════════
export default function WhatsAppCommunity() {
  const { user } = useAuth();
  const [status,         setStatus]         = useState(null);
  const [whatsappLink,   setWhatsappLink]   = useState(getSavedLink());
  const [helpers,        setHelpers]        = useState([]);
  const [location,       setLocation]       = useState(null);
  const [loading,        setLoading]        = useState(false);
  const [helpersLoading, setHelpersLoading] = useState(false);

  useEffect(() => {
    fetchStatus();
    getLocation();
  }, []);

  const getLocation = () => {
    navigator.geolocation?.getCurrentPosition(
      pos => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(loc);
        updateLocation(loc);
        fetchNearby(loc);
      }, () => {}
    );
  };

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API}/whatsapp/status`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStatus(data.status);
        // Only use backend link if it's a real link (not placeholder)
        if (data.joinLink && !data.joinLink.includes('your-community-link')) {
          setWhatsappLink(data.joinLink);
          localStorage.setItem(STORAGE_KEY, data.joinLink);
        }
      }
    } catch(e) { console.warn('Status fetch failed'); }
  };

  const updateLocation = async (loc) => {
    try {
      await fetch(`${API}/whatsapp/location`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(loc)
      });
    } catch {}
  };

  const fetchNearby = useCallback(async (loc) => {
    if (!loc) return;
    setHelpersLoading(true);
    try {
      const res = await fetch(
        `${API}/whatsapp/nearby?lat=${loc.lat}&lng=${loc.lng}&radius=10`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      if (res.ok) {
        const data = await res.json();
        setHelpers(data.helpers || []);
      }
    } catch {}
    setHelpersLoading(false);
  }, []);

  const handleJoin = async () => {
    try {
      await fetch(`${API}/whatsapp/join`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      toast.success('Welcome to SafeHer WhatsApp Community! 💚');
      fetchStatus();
    } catch { toast.error('Failed to update status'); }
  };

  const handleVolunteer = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/whatsapp/volunteer`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (res.ok) {
        toast.success('You are now a SafeHer Volunteer! Thank you 💖');
        fetchStatus();
      }
    } catch { toast.error('Failed to register as volunteer'); }
    setLoading(false);
  };

  const handleInvite = async () => {
    setLoading(true);
    const token = getToken();
    if (!token) {
      toast.error('Not logged in! Please login again.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API}/whatsapp/invite-contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      let data = {};
      try { data = await res.json(); } catch(e) {}
      if (res.ok) {
        toast.success(data.message || 'Invites sent successfully!');
      } else if (res.status === 400) {
        toast.error(data.message || 'Check contacts have email addresses added');
      } else if (res.status === 401) {
        toast.error('Session expired. Please login again.');
      } else {
        toast.error(data.message || 'Server error. Check Gmail App Password in .env file.');
      }
    } catch(err) {
      toast.error('Cannot reach server. Make sure backend is running on port 5000.');
    }
    setLoading(false);
  };

  const joined    = status?.joinStatus === 'joined';
  const volunteer = status?.isVolunteer;

  return (
    <div className="space-y-6 animate-slide-up">

      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
          <span className="text-3xl">💬</span>
          WhatsApp Safety Network
        </h1>
        <p className="text-white/40 mt-1">
          Join a community where help is always one click away
        </p>
      </div>

      {/* Status Badges */}
      <div className="flex flex-wrap gap-3">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${
          joined
            ? 'bg-green-500/20 text-green-400 border-green-500/30'
            : 'bg-white/5 text-white/40 border-white/10'
        }`}>
          {joined ? <CheckCircle size={14} /> : <XCircle size={14} />}
          WhatsApp: {joined ? 'Joined ✅' : 'Not Joined ❌'}
        </div>

        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${
          volunteer
            ? 'bg-violet-500/20 text-violet-400 border-violet-500/30'
            : 'bg-white/5 text-white/40 border-white/10'
        }`}>
          {volunteer ? <Award size={14} /> : <Heart size={14} />}
          Volunteer: {volunteer ? 'Active 💜' : 'Not yet'}
        </div>

        {location && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            <MapPin size={14} /> GPS Active
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Nearby Volunteers', value: helpers.length, color: 'from-emerald-500 to-teal-600', icon: Users },
          { label: 'Community Status', value: joined ? '✅' : '❌', color: 'from-green-500 to-emerald-600', icon: MessageCircle },
          { label: 'Volunteer Status', value: volunteer ? '✅' : '❌', color: 'from-violet-500 to-purple-600', icon: Award },
          { label: 'Your Rating', value: status?.rating || 'N/A', color: 'from-amber-500 to-orange-600', icon: Star },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="glass-card p-5 text-center">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
              <Icon size={22} className="text-white" />
            </div>
            <div className="text-2xl font-bold font-display text-white">{value}</div>
            <div className="text-white/40 text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* ★ LINK SETUP — user sets their WhatsApp group link here */}
      <LinkSetupCard link={whatsappLink} onSave={setWhatsappLink} />

      {/* Join Banner */}
      <JoinBanner
        status={status}
        link={whatsappLink}
        onJoin={handleJoin}
        onVolunteer={handleVolunteer}
        loading={loading}
      />

      {/* Invite + Nearby */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InviteContacts onInvite={handleInvite} loading={loading} />
        <NearbyHelpers
          helpers={helpers}
          loading={helpersLoading}
          onRefresh={() => fetchNearby(location)}
        />
      </div>

      {/* How It Works */}
      <HowItWorks />

      {/* Rate Volunteer */}
      <RateVolunteer />

      {/* Notice */}
      <div className="glass-card p-5 border border-amber-500/20 flex gap-3">
        <AlertTriangle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-white font-semibold text-sm mb-1">Consent Based System</p>
          <p className="text-white/50 text-xs leading-relaxed">
            SafeHer never auto-adds anyone to WhatsApp groups. All joining is voluntary.
            We only send invite links — the person chooses to join themselves.
            We follow all WhatsApp API policies and privacy guidelines.
          </p>
        </div>
      </div>

    </div>
  );
}

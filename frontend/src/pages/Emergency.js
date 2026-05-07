import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Shield, Phone, AlertTriangle, MapPin, Mic, MicOff,
  Video, Clock, PhoneCall, Volume2, Navigation, CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

// ── India Emergency Helplines ─────────────────────────
const helplines = [
  { name: 'Police', number: '100', icon: '🚔', color: 'from-blue-600 to-blue-700' },
  { name: 'Women Helpline', number: '1091', icon: '👩', color: 'from-rose-600 to-pink-600' },
  { name: 'Ambulance', number: '102', icon: '🚑', color: 'from-emerald-600 to-teal-600' },
  { name: 'All Emergency', number: '112', icon: '🆘', color: 'from-violet-600 to-purple-600' },
  { name: 'Fire', number: '101', icon: '🔥', color: 'from-orange-600 to-red-600' },
  { name: 'Childline', number: '1098', icon: '🧒', color: 'from-pink-600 to-rose-600' },
  { name: 'Anti-Stalking', number: '1096', icon: '🛡️', color: 'from-indigo-600 to-blue-600' },
  { name: 'Domestic Violence', number: '181', icon: '💙', color: 'from-cyan-600 to-sky-600' },
];

// ── Play Alarm Sound ──────────────────────────────────
function playAlarm() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [880, 660, 880, 660, 880, 440].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      gain.gain.value = 0.3;
      osc.start(ctx.currentTime + i * 0.25);
      osc.stop(ctx.currentTime + i * 0.25 + 0.2);
    });
  } catch (e) {}
}

// ── Get token helper ──────────────────────────────────
function getToken() {
  return localStorage.getItem('safeher_token');
}

// ── API Base URL ──────────────────────────────────────
const API = 'https://safeher-7tqn.onrender.com';

// ── Fake Call Screen ──────────────────────────────────
function FakeCallScreen({ onEnd }) {
  const [ringing, setRinging] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setRinging(false), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'linear-gradient(180deg,#1a1a1a 0%,#2d2d2d 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'space-between',
      padding: '80px 40px 60px'
    }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 12 }}>
          {ringing ? 'Incoming Call...' : 'Connected'}
        </p>
        <div style={{
          width: 110, height: 110, borderRadius: '50%',
          background: 'linear-gradient(135deg,#f43f5e,#9f1239)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px', fontSize: 52,
          boxShadow: '0 0 40px rgba(244,63,94,0.5)'
        }}>👩</div>
        <h2 style={{ color: 'white', fontSize: 34, fontWeight: 'bold', margin: 0 }}>Mom</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
          {ringing ? 'Calling...' : '00:01'}
        </p>
      </div>
      <div style={{ display: 'flex', gap: 50, alignItems: 'center' }}>
        <button onClick={onEnd} style={{
          width: 72, height: 72, borderRadius: '50%', background: '#ef4444',
          border: 'none', cursor: 'pointer', fontSize: 28,
          boxShadow: '0 8px 24px rgba(239,68,68,0.5)'
        }}>📵</button>
        {!ringing && (
          <button onClick={onEnd} style={{
            width: 72, height: 72, borderRadius: '50%', background: '#22c55e',
            border: 'none', cursor: 'pointer', fontSize: 28,
            boxShadow: '0 8px 24px rgba(34,197,94,0.5)'
          }}>📞</button>
        )}
      </div>
    </div>
  );
}

// ── Safety Timer ──────────────────────────────────────
function SafetyTimer({ onMissed }) {
  const [duration, setDuration] = useState(15);
  const [active, setActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const intervalRef = useRef(null);

  const start = () => {
    setTimeLeft(duration * 60);
    setActive(true);
    toast.success(`⏱️ Safety timer started for ${duration} minutes!`);
  };

  useEffect(() => {
    if (active && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (active && timeLeft === 0) {
      clearInterval(intervalRef.current);
      setActive(false);
      toast.error('⚠️ Check-in missed! Sending emergency alert...');
      onMissed();
    }
    return () => clearInterval(intervalRef.current);
  }, [active, timeLeft, onMissed]);

  const cancel = () => {
    clearInterval(intervalRef.current);
    setActive(false);
    setTimeLeft(0);
    toast.success("✅ You're safe! Timer cancelled.");
  };

  const fmt = s =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="glass-card p-6">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <Clock size={18} className="text-amber-400" />
        Safety Check-in Timer
      </h3>
      {active ? (
        <div className="text-center">
          <div className="text-5xl font-mono font-bold text-amber-400 mb-3">{fmt(timeLeft)}</div>
          <p className="text-white/50 text-sm mb-4">Check in before timer runs out!</p>
          <div className="flex gap-3">
            <button onClick={cancel}
              className="flex-1 py-3 rounded-xl bg-emerald-500/20 text-emerald-400 font-semibold hover:bg-emerald-500/30 transition">
              ✅ I'm Safe
            </button>
            <button onClick={cancel}
              className="px-4 py-3 rounded-xl bg-white/5 text-white/50 hover:bg-white/10 transition text-sm">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-white/50 text-sm mb-4">
            If you miss the check-in, an emergency alert fires automatically to all your contacts.
          </p>
          <div className="flex gap-2 mb-4">
            {[15, 30, 60].map(d => (
              <button key={d} onClick={() => setDuration(d)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition ${
                  duration === d
                    ? 'bg-amber-500/30 text-amber-400 border border-amber-500/40'
                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}>
                {d} min
              </button>
            ))}
          </div>
          <button onClick={start}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold hover:from-amber-500 hover:to-orange-500 transition shadow-lg shadow-amber-500/30">
            Start Safety Timer
          </button>
        </div>
      )}
    </div>
  );
}

// ── Voice Trigger ─────────────────────────────────────
function VoiceTrigger({ onTriggered }) {
  const [listening, setListening] = useState(false);
  const recRef = useRef(null);

  const toggle = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      toast.error('Voice not supported. Please use Google Chrome.');
      return;
    }
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      toast('🎙️ Voice trigger stopped');
      return;
    }
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-IN';
    rec.onresult = e => {
      const text = Array.from(e.results).map(r => r[0].transcript).join(' ').toLowerCase();
      if (text.includes('help') || text.includes('bachao') || text.includes('help me')) {
        rec.stop();
        setListening(false);
        toast.error('🚨 Voice SOS triggered!');
        onTriggered();
      }
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    rec.start();
    recRef.current = rec;
    setListening(true);
    toast.success('🎙️ Listening... Say "Help me" to trigger SOS');
  };

  return (
    <div className="glass-card p-6">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <Mic size={18} className="text-cyan-400" />
        Voice Trigger
      </h3>
      <p className="text-white/50 text-sm mb-4">
        Say <span className="text-primary-300 font-semibold">"Help me"</span> or{' '}
        <span className="text-primary-300 font-semibold">"Bachao"</span> to activate SOS hands-free.
      </p>
      <button onClick={toggle}
        className={`w-full py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
          listening
            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 animate-pulse'
            : 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white hover:from-cyan-500 hover:to-sky-500 shadow-lg shadow-cyan-500/30'
        }`}>
        {listening
          ? <><MicOff size={16} /> Stop Listening</>
          : <><Mic size={16} /> Activate Voice Trigger</>}
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════
//  MAIN EMERGENCY PAGE
// ════════════════════════════════════════════════════════
export default function Emergency() {
  const [sosLoading, setSosLoading]   = useState(false);
  const [sosDone,    setSosDone]      = useState(false);
  const [location,   setLocation]     = useState(null);
  const [contacts,   setContacts]     = useState([]);
  const [history,    setHistory]      = useState([]);
  const [showFakeCall, setShowFakeCall] = useState(false);
  const [recording,  setRecording]    = useState(false);
  const mediaRef = useRef(null);

  // ── On mount: get GPS + load data ───────────────────
  useEffect(() => {
    loadContacts();
    loadHistory();

    // FIX 3 — LIVE location tracking (updates every 10 seconds)
    let watchId = null;
    if (navigator.geolocation) {
      // Get initial position immediately
      navigator.geolocation.getCurrentPosition(
        pos => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        ()  => setLocation(null),
        { timeout: 8000, enableHighAccuracy: true }
      );

      // Then watch for live updates every 10 seconds
      watchId = navigator.geolocation.watchPosition(
        pos => {
          const newLoc = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            updatedAt: new Date().toLocaleTimeString()
          };
          setLocation(newLoc);
          // Also update backend with latest location
          const token = getToken();
          if (token) {
            fetch(`${API}/users/location`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({ lat: newLoc.lat, lng: newLoc.lng })
            }).catch(() => {});
          }
        },
        () => {},
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
      );
    }

    // Cleanup — stop watching when leaving page
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  // ── Load contacts from backend ───────────────────────
  const loadContacts = async () => {
    try {
      const res = await fetch(`${API}/contacts`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (res.ok) {
        const d = await res.json();
        setContacts(d.contacts || []);
      }
    } catch (e) {
      console.warn('Contacts load failed:', e.message);
    }
  };

  // ── Load alert history ───────────────────────────────
  const loadHistory = async () => {
    try {
      const res = await fetch(`${API}/alerts/history`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (res.ok) {
        const d = await res.json();
        setHistory((d.alerts || []).slice(0, 5));
      }
    } catch (e) {
      console.warn('History load failed:', e.message);
    }
  };

  // ── CORE SOS TRIGGER ────────────────────────────────
  const triggerSOS = useCallback(async (type = 'SOS') => {
    if (sosLoading) return;
    setSosLoading(true);
    setSosDone(false);

    // Step 1 — play alarm immediately
    playAlarm();

    // Step 2 — get location
    let lat = location?.lat || null;
    let lng = location?.lng || null;

    if (!lat && navigator.geolocation) {
      try {
        const pos = await new Promise((res, rej) =>
          navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 })
        );
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
        setLocation({ lat, lng });
      } catch {}
    }

    // Step 3 — check token
    const token = getToken();
    if (!token) {
      toast.error('You are not logged in. Please login again.');
      setSosLoading(false);
      return;
    }

    // Step 4 — send to backend
    try {
      const res = await fetch(`${API}/alerts/sos`, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          lat:     lat  || 0,
          lng:     lng  || 0,
          address: lat
            ? `Live Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`
            : 'Location not available',
          type
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSosDone(true);
        toast.error(
          `🚨 ${type} SENT! ${data.contactsNotified || 0} contacts notified!`,
          { duration: 6000 }
        );
        loadHistory();
        setTimeout(() => setSosDone(false), 5000);
      } else {
        toast.error(data.message || 'Alert failed. Please try again.');
      }

    } catch (err) {
      console.error('SOS network error:', err);
      toast.error(
        'Cannot reach server!\n\nMake sure your backend is running:\ncd backend → npm run dev',
        { duration: 8000 }
      );
    }

    setSosLoading(false);
  }, [sosLoading, location]);

  // ── Call helpline ────────────────────────────────────
  const callNumber = num => {
    window.location.href = `tel:${num}`;
    toast.success(`📞 Calling ${num}...`);
  };

  // ── Share GPS location ───────────────────────────────
  const shareLocation = () => {
    if (!location) {
      toast.error('GPS not available. Click "Enable GPS" first.');
      return;
    }
    const link = `https://maps.google.com/?q=${location.lat},${location.lng}`;
    if (navigator.share) {
      navigator.share({ title: '🚨 My Location', text: 'I need help! Track me:', url: link });
    } else {
      navigator.clipboard.writeText(link);
      toast.success('📍 Location link copied! Paste it to share.');
    }
  };

  // ── Evidence recording ───────────────────────────────
  const toggleRecording = async () => {
    if (recording) {
      mediaRef.current?.stop();
      setRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr     = new MediaRecorder(stream);
      const chunks = [];
      mr.ondataavailable = e => chunks.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = `safeher-evidence-${Date.now()}.webm`;
        a.click();
        toast.success('💾 Evidence saved to your device!');
      };
      mr.start();
      mediaRef.current = mr;
      setRecording(true);
      toast.success('🔴 Recording started');
    } catch {
      toast.error('Microphone access denied. Allow it in browser settings.');
    }
  };

  // ════════════════════════════════════════════════════
  //  RENDER
  // ════════════════════════════════════════════════════
  return (
    <div className="space-y-6 animate-slide-up">

      {/* Fake Call Overlay */}
      {showFakeCall && <FakeCallScreen onEnd={() => setShowFakeCall(false)} />}

      {/* Page Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Emergency Center</h1>
        <p className="text-white/40 mt-1">All your safety tools — one click away</p>
      </div>

      {/* ══ BIG SOS CARD ══════════════════════════════ */}
      <div className="glass-card p-6 md:p-8 border border-red-500/30 bg-gradient-to-br from-red-900/30 to-rose-900/10">
        <div className="flex flex-col lg:flex-row items-center gap-8">

          {/* Left — info */}
          <div className="flex-1 w-full">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <span className="text-red-400 text-xs font-bold uppercase tracking-widest">
                Emergency Ready
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold text-white mb-2">
              One Click SOS Alert
            </h2>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              Press SOS → plays alarm sound → shares your GPS location →
              instantly notifies all your trusted contacts.
            </p>

            {/* Contact status */}
            <div className={`flex items-center gap-2 p-3 rounded-xl ${
              contacts.length > 0 ? 'bg-emerald-500/10' : 'bg-amber-500/10'
            }`}>
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                contacts.length > 0 ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
              }`} />
              <p className={`text-sm font-medium ${
                contacts.length > 0 ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {contacts.length > 0
                  ? `✅ ${contacts.length} trusted contact${contacts.length > 1 ? 's' : ''} will be notified`
                  : '⚠️ No contacts added yet — add contacts for alerts to work!'}
              </p>
            </div>

            {contacts.length === 0 && (
              <a href="/contacts"
                className="inline-flex items-center gap-1 mt-3 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 text-sm hover:bg-amber-500/30 transition font-medium">
                + Add Trusted Contacts →
              </a>
            )}
          </div>

          {/* Right — SOS Button */}
          <div className="flex flex-col items-center gap-4 flex-shrink-0">
            <div className="relative">
              {/* Pulse rings when active */}
              {(sosLoading || sosDone) && (
                <>
                  <div className="absolute inset-0 rounded-full bg-red-500/40 animate-ping"
                    style={{ transform: 'scale(1.3)' }} />
                  <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping"
                    style={{ transform: 'scale(1.6)', animationDelay: '0.4s' }} />
                </>
              )}

              <button
                onClick={() => triggerSOS('SOS')}
                disabled={sosLoading}
                className="sos-btn relative z-10 w-44 h-44 rounded-full text-white font-display font-bold transition-all duration-300 hover:scale-105 active:scale-95 disabled:cursor-not-allowed"
              >
                {sosLoading ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="text-sm font-medium">Sending Alert...</span>
                  </div>
                ) : sosDone ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle size={44} />
                    <span className="text-base font-bold">Alert Sent!</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center leading-tight">
                    <span className="text-6xl font-black tracking-tight">SOS</span>
                    <span className="text-xs mt-2 text-white/70 font-normal">Press to activate</span>
                  </div>
                )}
              </button>
            </div>

            {sosDone && (
              <p className="text-emerald-400 text-sm font-semibold animate-pulse">
                ✅ Contacts notified!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ══ QUICK ACTION GRID ═════════════════════════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {/* Police Alert */}
        <button
          onClick={() => triggerSOS('POLICE')}
          disabled={sosLoading}
          className="glass-card p-5 flex flex-col items-center gap-3 border border-transparent hover:border-blue-500/30 hover:bg-blue-500/10 transition group disabled:opacity-60"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-3xl shadow-lg shadow-blue-500/30 group-hover:scale-110 transition">
            🚔
          </div>
          <div className="text-center">
            <p className="text-white font-semibold text-sm">Police Alert</p>
            <p className="text-white/40 text-xs">Alert + Call 100</p>
          </div>
        </button>

        {/* Share Location */}
        <button
          onClick={shareLocation}
          className="glass-card p-5 flex flex-col items-center gap-3 border border-transparent hover:border-emerald-500/30 hover:bg-emerald-500/10 transition group"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition">
            <MapPin size={26} className="text-white" />
          </div>
          <div className="text-center">
            <p className="text-white font-semibold text-sm">Share Location</p>
            <p className={`text-xs ${location ? 'text-emerald-400' : 'text-white/40'}`}>
              {location ? '📍 GPS Active' : 'Enable GPS'}
            </p>
          </div>
        </button>

        {/* Fake Call */}
        <button
          onClick={() => setShowFakeCall(true)}
          className="glass-card p-5 flex flex-col items-center gap-3 border border-transparent hover:border-amber-500/30 hover:bg-amber-500/10 transition group"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition">
            <PhoneCall size={26} className="text-white" />
          </div>
          <div className="text-center">
            <p className="text-white font-semibold text-sm">Fake Call</p>
            <p className="text-white/40 text-xs">Escape safely</p>
          </div>
        </button>

        {/* Evidence Recording */}
        <button
          onClick={toggleRecording}
          className={`glass-card p-5 flex flex-col items-center gap-3 border transition group ${
            recording
              ? 'border-red-500/40 bg-red-500/10'
              : 'border-transparent hover:border-pink-500/30 hover:bg-pink-500/10'
          }`}
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition ${
            recording
              ? 'bg-red-600 shadow-red-500/50 animate-pulse'
              : 'bg-gradient-to-br from-pink-600 to-rose-600 shadow-pink-500/30'
          }`}>
            <Video size={26} className="text-white" />
          </div>
          <div className="text-center">
            <p className="text-white font-semibold text-sm">
              {recording ? 'Stop Recording' : 'Record Evidence'}
            </p>
            <p className={`text-xs ${recording ? 'text-red-400' : 'text-white/40'}`}>
              {recording ? '🔴 Recording...' : 'Audio capture'}
            </p>
          </div>
        </button>
      </div>

      {/* ══ VOICE TRIGGER + SAFETY TIMER ══════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VoiceTrigger onTriggered={() => triggerSOS('VOICE_TRIGGER')} />
        <SafetyTimer  onMissed={()   => triggerSOS('CHECKIN_MISSED')} />
      </div>

      {/* ══ TRUSTED CONTACTS QUICK ALERT ══════════════ */}
      {contacts.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Shield size={18} className="text-violet-400" />
            Alert Your Safety Circle
          </h3>

          {/* Contact bubbles */}
          <div className="flex flex-wrap gap-3 mb-5">
            {contacts.map(c => (
              <div key={c._id} className="flex items-center gap-2 glass px-3 py-2 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white text-xs font-semibold">{c.name}</p>
                  <p className="text-white/40 text-xs">{c.relation}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => triggerSOS('TRUSTED_CONTACTS')}
            disabled={sosLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold hover:from-violet-500 hover:to-purple-500 transition shadow-lg shadow-violet-500/30 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Shield size={16} />
            Alert All {contacts.length} Trusted Contacts Now
          </button>
        </div>
      )}

      {/* ══ EMERGENCY HELPLINES ═══════════════════════ */}
      <div>
        <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
          <Phone size={18} className="text-primary-400" />
          Emergency Helplines — One Tap to Call
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {helplines.map(({ name, number, icon, color }) => (
            <button
              key={number}
              onClick={() => callNumber(number)}
              className="glass-card p-4 text-center hover:scale-105 transition group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-2 text-2xl shadow-lg group-hover:scale-110 transition`}>
                {icon}
              </div>
              <p className="text-white font-bold text-xl">{number}</p>
              <p className="text-white/60 text-xs font-medium mt-0.5">{name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ══ LIVE LOCATION PANEL ═══════════════════════ */}
      <div className="glass-card p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Navigation size={18} className="text-emerald-400" />
          🔴 Live Location Tracking
          {location && (
            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-1 ml-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              Live
            </span>
          )}
        </h3>
        {location ? (
          <div>
            <div className="flex flex-col gap-2 mb-4 p-3 rounded-xl bg-emerald-500/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-emerald-400 text-sm font-semibold">GPS Active — Tracking Live</p>
              </div>
              <p className="text-white/50 text-xs font-mono">
                Lat: {location.lat.toFixed(6)} | Lng: {location.lng.toFixed(6)}
              </p>
              {location.accuracy && (
                <p className="text-white/30 text-xs">
                  Accuracy: ±{Math.round(location.accuracy)}m
                </p>
              )}
              {location.updatedAt && (
                <p className="text-white/30 text-xs">
                  Last updated: {location.updatedAt}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => window.open(`https://maps.google.com/?q=${location.lat},${location.lng}`, '_blank')}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition text-sm font-medium flex items-center justify-center gap-2"
              >
                <MapPin size={14} /> Open in Maps
              </button>
              <button
                onClick={shareLocation}
                className="flex-1 py-2.5 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition text-sm font-medium flex items-center justify-center gap-2"
              >
                <Navigation size={14} /> Share Location
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <MapPin size={40} className="text-white/20 mx-auto mb-3" />
            <p className="text-white/40 text-sm mb-4">GPS location not available</p>
            <button
              onClick={() => {
                navigator.geolocation?.getCurrentPosition(
                  pos => {
                    setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                    toast.success('📍 GPS location enabled!');
                  },
                  () => toast.error('GPS denied. Please allow location in browser settings.')
                );
              }}
              className="px-6 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 text-sm hover:bg-emerald-500/30 transition font-medium"
            >
              Enable GPS Location
            </button>
          </div>
        )}
      </div>

      {/* ══ ALERT HISTORY ═════════════════════════════ */}
      {history.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-primary-400" />
            Recent Emergency Alerts
          </h3>
          <div className="space-y-2">
            {history.map(alert => (
              <div key={alert._id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/8 transition">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  alert.status === 'ACTIVE' ? 'bg-red-400 animate-pulse' : 'bg-emerald-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{alert.type} Alert</p>
                  <p className="text-white/40 text-xs truncate">
                    {new Date(alert.createdAt).toLocaleString()} •{' '}
                    {alert.notifiedContacts?.length || 0} contacts notified
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
                  alert.status === 'ACTIVE'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {alert.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

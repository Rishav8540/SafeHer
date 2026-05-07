import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Phone, Users, MapPin, Mic, Video, Clock, Star, ChevronRight, Heart } from 'lucide-react';

const features = [
  { icon: Shield, title: 'One-Click SOS', desc: 'Instantly alert all your trusted contacts with your live location', color: 'from-red-500 to-rose-600' },
  { icon: Phone, title: 'Police Connect', desc: 'Direct call to nearest police station or women helpline', color: 'from-blue-500 to-indigo-600' },
  { icon: Users, title: 'Trusted Network', desc: 'Build your safety circle — family, friends, anyone you trust', color: 'from-violet-500 to-purple-600' },
  { icon: MapPin, title: 'Live Location', desc: 'Real-time location sharing with your trusted contacts', color: 'from-emerald-500 to-teal-600' },
  { icon: Mic, title: 'Voice Trigger', desc: 'Say "Help me" — SafeHer activates SOS automatically', color: 'from-amber-500 to-orange-600' },
  { icon: Video, title: 'Evidence Guard', desc: 'Auto-records audio/video during emergencies as proof', color: 'from-pink-500 to-rose-600' },
  { icon: Clock, title: 'Safety Timer', desc: 'Check-in timer — missed check-in auto-sends alert', color: 'from-cyan-500 to-sky-600' },
  { icon: Star, title: 'Fake Call', desc: 'Generate a fake incoming call to escape unsafe situations', color: 'from-lime-500 to-green-600' },
];

const stats = [
  { value: '10K+', label: 'Protected Women' },
  { value: '50K+', label: 'Alerts Handled' },
  { value: '99.9%', label: 'Uptime' },
  { value: '< 3s', label: 'Alert Speed' },
];

function FloatingOrb({ style }) {
  return <div className="absolute rounded-full blur-3xl opacity-20 pointer-events-none" style={style} />;
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen gradient-bg text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass border-b border-white/10' : ''}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/40">
              <Shield size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl">SafeHer</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-white/70">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#about" className="hover:text-white transition">About</a>
            <a href="#stats" className="hover:text-white transition">Impact</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-white/70 hover:text-white transition px-4 py-2 rounded-xl hover:bg-white/5">
              Sign In
            </Link>
            <Link to="/register" className="text-sm bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white px-5 py-2 rounded-xl font-medium transition-all shadow-lg shadow-primary-500/30">
              Get Protected
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        {/* Background orbs */}
        <FloatingOrb style={{ width: 500, height: 500, background: '#f43f5e', top: '10%', left: '-10%' }} />
        <FloatingOrb style={{ width: 400, height: 400, background: '#6366f1', bottom: '10%', right: '-5%' }} />
        <FloatingOrb style={{ width: 300, height: 300, background: '#8b5cf6', top: '50%', left: '50%' }} />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-primary-300 border border-primary-500/30 mb-8 animate-slide-up">
            <Heart size={14} className="text-primary-400" />
            <span>Your Digital Safety Guardian</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
            <span className="block">Because You</span>
            <span className="block bg-gradient-to-r from-primary-400 via-rose-300 to-primary-500 bg-clip-text text-transparent">
              Deserve Safety
            </span>
            <span className="block text-4xl md:text-5xl mt-2 text-white/80">Every Single Moment</span>
          </h1>

          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            SafeHer gives every woman the power to call for help, share location, and trigger emergency alerts — all in a single click, even when loved ones can't be there.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="group flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all shadow-2xl shadow-primary-500/40 hover:shadow-primary-500/60 hover:-translate-y-1">
              Start Protecting Now
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="flex items-center justify-center gap-2 glass border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all">
              Already a member? Sign in
            </Link>
          </div>

          {/* Shield illustration */}
          <div className="mt-16 shield-float">
            <div className="relative inline-block">
              <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary-500/30 to-primary-700/30 border border-primary-500/40 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-2xl shadow-primary-500/60">
                  <Shield size={40} className="text-white" />
                </div>
              </div>
              {/* Orbiting dots */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-3 h-3 rounded-full bg-primary-400" />
              </div>
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }}>
                <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-blue-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(({ value, label }) => (
              <div key={label} className="glass-card p-6 text-center">
                <div className="font-display text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-400 to-rose-300 bg-clip-text text-transparent mb-2">
                  {value}
                </div>
                <div className="text-white/50 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to <span className="text-primary-400">Stay Safe</span>
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              A comprehensive safety suite designed with love — because every woman deserves a guardian angel in their pocket.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="glass-card p-6 group cursor-default">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-12">
            <Shield size={48} className="text-primary-400 mx-auto mb-6" />
            <h2 className="font-display text-4xl font-bold mb-6">Built With Love, For Safety</h2>
            <p className="text-white/60 text-lg leading-relaxed mb-8">
              SafeHer was born from a simple but powerful idea — a brother who couldn't always be there to protect his sister. So he built something that could. This platform is for every woman who deserves to feel safe, every family that wants peace of mind, and every community that believes women's safety is non-negotiable.
            </p>
            <Link to="/register" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl hover:shadow-primary-500/40 transition-all hover:-translate-y-1">
              <Heart size={18} />
              Join SafeHer Today
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-white/10 text-center text-white/40 text-sm">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Shield size={16} className="text-primary-400" />
          <span className="font-display font-bold text-white">SafeHer</span>
        </div>
        <p>One Click Protection — Built for every woman who deserves to feel safe.</p>
        <p className="mt-2">© {new Date().getFullYear()} SafeHer. Made with ❤️</p>
      </footer>
    </div>
  );
}

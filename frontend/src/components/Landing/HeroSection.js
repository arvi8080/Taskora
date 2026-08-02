import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bot, 
  Mic, 
  AlertTriangle, 
  Sparkles, 
  MapPin, 
  Clock, 
  Star,
  ShieldCheck
} from 'lucide-react';

const HeroSection = ({ onAIChat, onVoiceSearch, onEmergency }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/experts?search=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/experts');
    }
  };

  return (
    <section id="home" className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
      
      {/* Background Soft Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-blue-400/15 dark:bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-cyan-400/15 dark:bg-cyan-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column - Copy & CTA */}
          <motion.div 
            className="lg:col-span-7 space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Small Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-semibold shadow-xs"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>#1 AI Powered Home Service Platform</span>
            </motion.div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                Expert Help, <br />
                <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                  AI Fast
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl">
                Get verified professionals for plumbing, electrician, AC repair, cleaning, painting, carpentry, appliance repair and more. AI-powered matching helps customers find the best expert instantly.
              </p>
            </div>

            {/* Large Search Box */}
            <motion.form 
              onSubmit={handleSearch}
              className="relative max-w-2xl bg-white dark:bg-slate-800 p-2.5 rounded-2xl shadow-xl shadow-slate-200/60 dark:shadow-none border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row gap-2 transition-all focus-within:ring-2 focus-within:ring-blue-500/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex-1 flex items-center pl-3 pr-2 py-2 gap-3">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search services... Example: Plumber, Electrician, AC Repair..."
                  className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-sm sm:text-base font-normal"
                />
              </div>
              <button
                type="submit"
                className="px-7 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-600/30 transition-all shrink-0 flex items-center justify-center gap-2"
              >
                <span>Search</span>
                <Search className="w-4 h-4" />
              </button>
            </motion.form>

            {/* Quick Action Outline Buttons */}
            <motion.div 
              className="flex flex-wrap gap-3 pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <button
                onClick={onAIChat}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-xs hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer"
              >
                <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>🤖 AI Assistant</span>
              </button>

              <button
                onClick={onVoiceSearch}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-xs hover:border-cyan-300 dark:hover:border-cyan-700 transition-all cursor-pointer"
              >
                <Mic className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>🎤 Voice Search</span>
              </button>

              <button
                onClick={onEmergency}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/30 hover:bg-red-100/50 dark:hover:bg-red-900/40 text-red-700 dark:text-red-300 text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 animate-pulse" />
                <span>🚨 Emergency Help</span>
              </button>
            </motion.div>

          </motion.div>

          {/* Right Column - Technician Photo & Floating Cards */}
          <motion.div 
            className="lg:col-span-5 relative flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
          >
            {/* Main Visual Frame */}
            <div className="relative w-full max-w-md aspect-square rounded-2xl p-3 bg-gradient-to-tr from-blue-600/20 via-cyan-500/20 to-emerald-400/20 shadow-2xl shadow-blue-500/10">
              <div className="w-full h-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                <img 
                  src="/assets/hero_technician.jpg" 
                  alt="Verified Expert Technician" 
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Floating Glassmorphism Card 1 - Top Left */}
            <motion.div 
              className="absolute -top-4 -left-4 sm:left-0 bg-white/85 dark:bg-slate-800/85 backdrop-blur-md p-3.5 rounded-2xl border border-white/40 dark:border-slate-700/60 shadow-xl shadow-slate-900/5 flex items-center gap-3 z-10"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">AI Matched</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Perfect expert selected</p>
              </div>
            </motion.div>

            {/* Floating Glassmorphism Card 2 - Top Right */}
            <motion.div 
              className="absolute top-10 -right-4 sm:right-0 bg-white/85 dark:bg-slate-800/85 backdrop-blur-md p-3.5 rounded-2xl border border-white/40 dark:border-slate-700/60 shadow-xl shadow-slate-900/5 flex items-center gap-3 z-10"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Verified Experts</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Background verified</p>
              </div>
            </motion.div>

            {/* Floating Glassmorphism Card 3 - Bottom Left */}
            <motion.div 
              className="absolute -bottom-4 -left-4 sm:left-2 bg-white/85 dark:bg-slate-800/85 backdrop-blur-md p-3.5 rounded-2xl border border-white/40 dark:border-slate-700/60 shadow-xl shadow-slate-900/5 flex items-center gap-3 z-10"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Real-Time Tracking</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Track technician live</p>
              </div>
            </motion.div>

            {/* Floating Glassmorphism Card 4 - Bottom Right */}
            <motion.div 
              className="absolute bottom-6 -right-4 sm:right-2 bg-white/85 dark:bg-slate-800/85 backdrop-blur-md p-3.5 rounded-2xl border border-white/40 dark:border-slate-700/60 shadow-xl shadow-slate-900/5 flex items-center gap-3 z-10"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Instant Booking</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Book in under 2 mins</p>
              </div>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;

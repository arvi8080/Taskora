import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const Hero = ({ onEmergency, onVoiceSearch, onAIChat }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/experts?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/experts');
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, #ffffff20 0%, transparent 50%), radial-gradient(circle at 75% 75%, #ffffff20 0%, transparent 50%)',
        }}></div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Top Badge */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-blue-200 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-ping"></span>
            #1 AI-Powered Expert Service Platform in India
          </span>
        </motion.div>

        {/* Hero Text */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent leading-tight">
            Expert Help, 
            <br />
            <span className="bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">AI Fast</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed font-light">
            Get verified experts for any home service. AI-powered matching, real-time tracking, 
            and instant booking. From plumbing to electrical — we've got you covered 24/7.
          </p>

          {/* Quick Search Bar */}
          <motion.form 
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="relative flex items-center bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl p-2 shadow-2xl focus-within:border-blue-400 transition-all">
              <svg className="w-6 h-6 text-blue-200 ml-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search service e.g. Plumber, Electrician, AC Repair..."
                className="w-full bg-transparent text-white placeholder-blue-200/70 px-2 py-3 focus:outline-none text-base sm:text-lg"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold text-base transition-colors shrink-0 shadow-md"
              >
                Search
              </button>
            </div>
          </motion.form>

          {/* Main CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <motion.button
              onClick={onAIChat}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              AI Assistant
            </motion.button>

            <motion.button
              onClick={onVoiceSearch}
              className="w-full sm:w-auto bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg border border-white/20 hover:border-white/40 transition-all duration-300 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              Voice Search
            </motion.button>
          </div>

          {/* Emergency Button in Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={onEmergency}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Emergency Help Now
            </button>
          </motion.div>
        </motion.div>

        {/* Service Categories Preview */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {[
            { icon: '🚰', label: 'Plumbing', path: '/plumbing-experts' },
            { icon: '⚡', label: 'Electrical', path: '/electrical-experts' },
            { icon: '🔨', label: 'Carpentry', path: '/carpentry-experts' },
            { icon: '🎨', label: 'Painting', path: '/painting-experts' },
          ].map((service, index) => (
            <motion.div
              key={service.label}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={service.path}
                className="block text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
              >
                <div className="text-3xl mb-2">{service.icon}</div>
                <p className="font-medium text-white">{service.label}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Services Button */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Link
            to="/experts"
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold border border-white/20 hover:border-white/40 transition-all duration-300"
          >
            View All Services
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          className="mt-16 flex justify-around bg-white/10 backdrop-blur-sm rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-300">10K+</div>
            <div className="text-blue-100">Experts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-300">50K+</div>
            <div className="text-blue-100">Services</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-300">24/7</div>
            <div className="text-blue-100">Available</div>
          </div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-purple-500/20 rounded-full blur-xl pointer-events-none"></div>
    </section>
  );
};

export default Hero;

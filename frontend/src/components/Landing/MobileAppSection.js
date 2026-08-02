import React from 'react';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  CheckCircle2, 
  MapPin, 
  Star
} from 'lucide-react';

const MobileAppSection = () => {
  const highlights = [
    'Real-time GPS tracking of technician en route',
    'AI voice booking in 8 Indian regional languages',
    'Instant emergency SOS dispatch with 1-tap',
    'Secure in-app payments & digital invoices'
  ];

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-tr from-slate-900 via-blue-950 to-slate-900 text-white relative overflow-hidden">
      
      {/* Background Soft Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Side: Headlines & Download Buttons */}
          <motion.div 
            className="lg:col-span-7 space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span>Available On iOS & Android</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Get Expert Service At Your Fingertips
            </h2>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl font-light leading-relaxed">
              Download the ExpertService mobile application to experience 1-tap emergency booking, live technician tracking, instant AI voice requests, and exclusive app-only discounts.
            </p>

            {/* Bullet Highlights */}
            <div className="space-y-3 pt-2">
              {highlights.map((point, index) => (
                <div key={index} className="flex items-center gap-3 text-sm text-slate-200">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>{point}</span>
                </div>
              ))}
            </div>

            {/* Download Buttons */}
            <div className="pt-6 flex flex-wrap gap-4 items-center">
              {/* Google Play Store */}
              <button 
                onClick={() => alert('App Store redirect')}
                className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500 text-white transition-all shadow-xl group cursor-pointer"
              >
                <div className="text-2xl">🤖</div>
                <div className="text-left">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">GET IT ON</div>
                  <div className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">Google Play</div>
                </div>
              </button>

              {/* Apple App Store */}
              <button 
                onClick={() => alert('App Store redirect')}
                className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500 text-white transition-all shadow-xl group cursor-pointer"
              >
                <div className="text-2xl">🍎</div>
                <div className="text-left">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">DOWNLOAD ON THE</div>
                  <div className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">App Store</div>
                </div>
              </button>
            </div>
          </motion.div>

          {/* Right Side: Phone Mockup Frame */}
          <motion.div 
            className="lg:col-span-5 flex justify-center items-center relative"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Phone Outer Shell */}
            <div className="relative w-72 sm:w-80 h-[560px] bg-slate-950 rounded-[44px] p-4 border-[8px] border-slate-800 shadow-2xl shadow-blue-500/20 flex flex-col justify-between overflow-hidden">
              
              {/* Top Speaker Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-800 rounded-b-2xl z-20 flex justify-center items-center">
                <div className="w-10 h-1 bg-slate-900 rounded-full" />
              </div>

              {/* Screen Content Mockup */}
              <div className="w-full h-full bg-slate-900 rounded-[32px] pt-7 px-4 pb-4 text-white overflow-hidden flex flex-col justify-between relative">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold">ES</div>
                    <span className="text-xs font-bold text-white">ExpertService</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">Live GPS</span>
                </div>

                {/* Tracking Simulation Card */}
                <div className="bg-slate-800/90 rounded-2xl p-3.5 border border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-400">Technician En Route</span>
                    <span className="text-[10px] text-slate-400">ETA: 6 mins</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">RK</div>
                    <div>
                      <div className="text-xs font-bold text-white">Rajesh Kumar</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        4.9 (142 jobs)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map Grid Animation Frame */}
                <div className="w-full h-44 rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
                  
                  {/* Map Pin Pulse */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center animate-ping absolute" />
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg relative z-10">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] bg-slate-900 text-slate-200 px-2 py-0.5 rounded-full mt-1 border border-slate-700">500m away</span>
                  </div>
                </div>

                {/* Bottom Action Mockup */}
                <button className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md">
                  Call Technician Now
                </button>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default MobileAppSection;

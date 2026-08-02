import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  CreditCard, 
  Headphones
} from 'lucide-react';

const WhyChooseUsSection = () => {
  const features = [
    {
      id: 'ai-recommendation',
      title: 'AI Recommendation',
      description: 'Intelligent AI algorithm analyzes customer job requirements, technician skills, ratings, and real-time location to match the ideal professional.',
      icon: Bot,
      color: 'from-blue-600 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
    },
    {
      id: 'verified-professionals',
      title: 'Verified Professionals',
      description: 'Every expert undergoes stringent criminal background checks, identity verification, skill assessments, and continuous quality audits.',
      icon: ShieldCheck,
      color: 'from-cyan-500 to-emerald-500',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400'
    },
    {
      id: 'live-tracking',
      title: 'Live Tracking',
      description: 'Track your assigned technician’s GPS movement live on the map en route to your home with accurate estimated time of arrival (ETA).',
      icon: MapPin,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
    },
    {
      id: 'instant-booking',
      title: 'Instant Booking',
      description: 'Book on-demand emergency service within 2 minutes or schedule convenient appointments that match your busy routine effortlessly.',
      icon: Clock,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400'
    },
    {
      id: 'secure-payments',
      title: 'Secure Payments',
      description: '100% transparent pricing upfront with zero hidden fees. Pay safely via Cards, UPI, Net Banking, or Wallet after job completion.',
      icon: CreditCard,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
    },
    {
      id: '247-support',
      title: '24/7 Support',
      description: 'Round-the-clock customer support team and priority emergency response for critical home service breakdowns 365 days a year.',
      icon: Headphones,
      color: 'from-rose-500 to-pink-500',
      bgColor: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
    }
  ];

  return (
    <section id="why-us" className="py-20 lg:py-28 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 text-xs font-semibold">
            <span>Built For Modern Homeowners</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Why Choose ExpertService
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            We combine cutting-edge AI technology with rigorous quality standards to deliver an unmatched home service experience.
          </p>
        </motion.div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComp = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-slate-50/70 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 group"
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <IconComp className="w-6 h-6" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUsSection;

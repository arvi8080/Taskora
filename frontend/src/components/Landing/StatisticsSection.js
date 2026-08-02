import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  ShieldCheck, 
  ThumbsUp, 
  Headphones
} from 'lucide-react';

const StatisticsSection = () => {
  const stats = [
    {
      value: '50K+',
      label: 'Happy Customers',
      description: 'Satisfied households across 15+ major cities',
      icon: Users,
      color: 'from-blue-600 to-cyan-500',
      bgColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
    },
    {
      value: '10K+',
      label: 'Verified Experts',
      description: 'Background checked, certified professionals',
      icon: ShieldCheck,
      color: 'from-cyan-500 to-emerald-500',
      bgColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
    },
    {
      value: '98%',
      label: 'Customer Satisfaction',
      description: 'Consistently rated 5-stars for service quality',
      icon: ThumbsUp,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
    },
    {
      value: '24/7',
      label: 'Dedicated Support',
      description: 'Round-the-clock emergency assistance',
      icon: Headphones,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-blue-50/30 dark:from-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Colorful Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComp = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-200/40 dark:shadow-none text-center relative overflow-hidden group"
              >
                {/* Background Glow */}
                <div className={`absolute -top-12 -right-12 w-28 h-28 rounded-full opacity-15 blur-2xl bg-gradient-to-tr ${stat.color}`} />
                
                {/* Icon */}
                <div className={`w-14 h-14 mx-auto mb-5 rounded-2xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <IconComp className="w-7 h-7" />
                </div>

                {/* Big Metric Value */}
                <div className={`text-4xl sm:text-5xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 tracking-tight`}>
                  {stat.value}
                </div>

                {/* Label */}
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  {stat.label}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {stat.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default StatisticsSection;

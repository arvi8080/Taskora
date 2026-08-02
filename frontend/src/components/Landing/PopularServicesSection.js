import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Droplets, 
  Zap, 
  Snowflake, 
  Sparkles, 
  Hammer, 
  Wrench, 
  Paintbrush, 
  Plus, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const PopularServicesSection = () => {
  const services = [
    {
      id: 'plumbing',
      name: 'Plumbing',
      icon: Droplets,
      emoji: '🚰',
      route: '/plumbing-experts',
      tag: 'Leaks & Pipes',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50/70 dark:bg-blue-950/40',
      borderColor: 'border-blue-100 dark:border-blue-900/50',
      description: 'Leak detection, pipe repairs, drain unblocking & bathroom fitting.'
    },
    {
      id: 'electrical',
      name: 'Electrical',
      icon: Zap,
      emoji: '⚡',
      route: '/electrical-experts',
      tag: 'Wiring & Outlets',
      color: 'from-amber-500 to-yellow-500',
      bgColor: 'bg-amber-50/70 dark:bg-amber-950/40',
      borderColor: 'border-amber-100 dark:border-amber-900/50',
      description: 'Short circuit fix, heavy wiring, MCB replacement & light fittings.'
    },
    {
      id: 'ac-repair',
      name: 'AC Repair',
      icon: Snowflake,
      emoji: '❄️',
      route: '/technician-experts',
      tag: 'Cooling & Gas',
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'bg-cyan-50/70 dark:bg-cyan-950/40',
      borderColor: 'border-cyan-100 dark:border-cyan-900/50',
      description: 'AC deep jet servicing, gas refill, compressor & PCB repair.'
    },
    {
      id: 'cleaning',
      name: 'Cleaning',
      icon: Sparkles,
      emoji: '🧹',
      route: '/cleaning-experts',
      tag: 'Deep Home Clean',
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50/70 dark:bg-emerald-950/40',
      borderColor: 'border-emerald-100 dark:border-emerald-900/50',
      description: 'Full home deep cleaning, sofa sanitization & kitchen degreasing.'
    },
    {
      id: 'carpentry',
      name: 'Carpentry',
      icon: Hammer,
      emoji: '🔨',
      route: '/carpentry-experts',
      tag: 'Furniture Fix',
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-orange-50/70 dark:bg-orange-950/40',
      borderColor: 'border-orange-100 dark:border-orange-900/50',
      description: 'Custom furniture repair, lock replacement, door & window setup.'
    },
    {
      id: 'appliance-repair',
      name: 'Appliance Repair',
      icon: Wrench,
      emoji: '🧺',
      route: '/technician-experts',
      tag: 'Washing & Fridge',
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50/70 dark:bg-purple-950/40',
      borderColor: 'border-purple-100 dark:border-purple-900/50',
      description: 'Washing machine, refrigerator, microwave & chimney repair.'
    },
    {
      id: 'painting',
      name: 'Painting',
      icon: Paintbrush,
      emoji: '🎨',
      route: '/painting-experts',
      tag: 'Interior & Exterior',
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50/70 dark:bg-pink-950/40',
      borderColor: 'border-pink-100 dark:border-pink-900/50',
      description: 'Wall waterproof coating, texture design & full house painting.'
    },
    {
      id: 'more',
      name: 'More Services',
      icon: Plus,
      emoji: '➕',
      route: '/experts',
      tag: '50+ Categories',
      color: 'from-slate-700 to-slate-900',
      bgColor: 'bg-slate-50 dark:bg-slate-800/80',
      borderColor: 'border-slate-200 dark:border-slate-700',
      description: 'Pest control, CCTV installation, home cooking, mechanics & more.'
    }
  ];

  return (
    <section id="services" className="py-20 lg:py-28 bg-white dark:bg-slate-900">
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
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Popular Service Categories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Expert Help For Every Home Need
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Book top-rated, background-verified experts near you. Transparent pricing & 30-day service warranty guaranteed.
          </p>
        </motion.div>

        {/* Services Grid (7 Cards + More Services) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -6 }}
                className="group"
              >
                <Link
                  to={item.route}
                  className={`block h-full p-6 rounded-2xl ${item.bgColor} border ${item.borderColor} transition-all duration-300 group-hover:shadow-xl group-hover:shadow-blue-500/5 relative overflow-hidden flex flex-col justify-between`}
                >
                  <div>
                    {/* Top Row: Icon/Emoji & Tag */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{item.emoji}</span>
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                        {item.tag}
                      </span>
                    </div>

                    {/* Name */}
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                      {item.description}
                    </p>
                  </div>

                  {/* Bottom Action Link */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-700/50 text-xs font-semibold text-blue-600 dark:text-blue-400">
                    <span>Find Experts</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default PopularServicesSection;

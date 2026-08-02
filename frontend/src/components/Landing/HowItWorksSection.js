import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Sparkles, 
  CalendarCheck, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      step: '01',
      title: 'Search Service',
      description: 'Search your home issue or describe it to our AI assistant in natural language or voice.',
      icon: Search,
      color: 'from-blue-600 to-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40'
    },
    {
      step: '02',
      title: 'AI Matches Expert',
      description: 'Our AI algorithm instantly evaluates skill, rating, location & ETA to match the best expert.',
      icon: Sparkles,
      color: 'from-cyan-500 to-teal-500',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950/40'
    },
    {
      step: '03',
      title: 'Book Appointment',
      description: 'Choose instant dispatch or schedule a convenient slot. Confirm with transparent pricing.',
      icon: CalendarCheck,
      color: 'from-purple-600 to-indigo-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/40'
    },
    {
      step: '04',
      title: 'Get Job Done',
      description: 'Track expert live en route. Job completed with 30-day service warranty & safe online payment.',
      icon: CheckCircle2,
      color: 'from-emerald-600 to-green-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-slate-50/60 dark:bg-slate-950 border-y border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/60 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold">
            <span>Seamless 4-Step Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How ExpertService Works
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Booking professional home help takes less than 2 minutes. Fast, transparent, and completely reliable.
          </p>
        </motion.div>

        {/* 4 Horizontal Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, index) => {
            const IconComp = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative bg-white dark:bg-slate-900 p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col justify-between"
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-md`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-slate-300 dark:text-slate-700 tracking-wider">
                      {item.step}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Desktop Connection Arrow Indicator */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-blue-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default HowItWorksSection;

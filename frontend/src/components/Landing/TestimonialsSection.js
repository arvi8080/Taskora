import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      role: 'Homeowner, Mumbai',
      service: 'Plumbing & Water Leak Repair',
      avatar: '👩',
      avatarBg: 'bg-blue-100 dark:bg-blue-900/50',
      rating: 5,
      review: 'The AI matching was incredible! I needed an emergency pipe leak fix late at night. The system assigned a top-rated plumber within seconds who arrived in 20 minutes and solved it cleanly.',
      date: 'Verified Booking • 2 days ago'
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      role: 'Software Engineer, Bangalore',
      service: 'AC Jet Servicing & Gas Refill',
      avatar: '👨‍💼',
      avatarBg: 'bg-cyan-100 dark:bg-cyan-900/50',
      rating: 5,
      review: 'Live tracking on the map gave me complete peace of mind. Transparent upfront pricing meant no negotiation hassles. The technician was extremely polite and professional.',
      date: 'Verified Booking • 1 week ago'
    },
    {
      id: 3,
      name: 'Anita Patel',
      role: 'Interior Designer, Delhi',
      service: 'Electrical Rewiring & Fixtures',
      avatar: '👩‍🎨',
      avatarBg: 'bg-purple-100 dark:bg-purple-900/50',
      rating: 5,
      review: 'ExpertService has transformed how I manage home maintenance. The 30-day warranty and instant AI voice search make booking services completely effortless.',
      date: 'Verified Booking • 2 weeks ago'
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-slate-50/60 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
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
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Real Customer Reviews</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Loved By Thousands of Families
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            See how our AI-powered service marketplace is delivering fast, trustworthy home service across the country.
          </p>
        </motion.div>

        {/* 3 Modern Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -6 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none relative flex flex-col justify-between"
            >
              <div>
                {/* Rating Stars & Quote Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-blue-100 dark:text-slate-800" />
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal mb-8">
                  "{item.review}"
                </p>
              </div>

              {/* Customer Footer Info */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full ${item.avatarBg} flex items-center justify-center text-xl shrink-0`}>
                    {item.avatar}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.role}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/50 dark:border-emerald-900/50">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;

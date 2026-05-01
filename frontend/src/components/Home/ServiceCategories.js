import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ServiceCategories = () => {
  const categoryRoutes = {
    plumber: '/plumbing-experts',
    electrician: '/electrical-experts',
    carpenter: '/carpentry-experts',
    painter: '/painting-experts',
    cleaner: '/cleaning-experts',
    mechanic: '/mechanic-experts',
    technician: '/technician-experts',
    cook: '/cooking-experts',
  };

  const categories = [
    {
      id: 'plumber',
      name: 'Plumbing',
      icon: '🚰',
      description: 'Leak repairs, pipe installation, drain cleaning',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'electrician',
      name: 'Electrical',
      icon: '⚡',
      description: 'Wiring, outlets, circuit breaker repairs',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      id: 'carpenter',
      name: 'Carpentry',
      icon: '🔨',
      description: 'Furniture repair, custom woodwork, installations',
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      id: 'painter',
      name: 'Painting',
      icon: '🎨',
      description: 'Interior/exterior painting, color consultation',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      id: 'cleaner',
      name: 'Cleaning',
      icon: '🧹',
      description: 'Deep cleaning, regular maintenance, sanitization',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: 'mechanic',
      name: 'Mechanic',
      icon: '🔧',
      description: 'Auto repair, maintenance, diagnostics',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
    },
    {
      id: 'technician',
      name: 'Technician',
      icon: '💻',
      description: 'Appliance repair, tech support, installations',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      id: 'cook',
      name: 'Cooking',
      icon: '👨‍🍳',
      description: 'Personal chef, meal prep, cooking classes',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Expert Services for Every Need
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From emergency repairs to routine maintenance, our verified experts 
            are ready to help with professional, reliable service.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Link
                to={categoryRoutes[category.id]}
                className="block"
              >
                <div className={`${category.bgColor} rounded-2xl p-6 h-full transition-all duration-300 group-hover:shadow-lg border border-gray-100 group-hover:border-gray-200`}>
                  {/* Icon */}
                  <div className="text-4xl mb-4">{category.icon}</div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {category.description}
                  </p>
                  
                  {/* Arrow */}
                  <div className="mt-4 flex items-center text-primary-600 group-hover:translate-x-1 transition-transform">
                    <span className="text-sm font-medium">Find Experts</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Link
            to="/experts"
            className="btn-primary btn-lg px-8 inline-flex items-center gap-2"
          >
            View All Services
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceCategories;




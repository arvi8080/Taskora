import React from 'react';
import { motion } from 'framer-motion';

const Stats = () => {
  const stats = [
    {
      number: '10,000+',
      label: 'Happy Customers',
      icon: '😊',
      color: 'from-blue-500 to-blue-600',
    },
    {
      number: '500+',
      label: 'Verified Experts',
      icon: '👨‍🔧',
      color: 'from-green-500 to-green-600',
    },
    {
      number: '50+',
      label: 'Service Categories',
      icon: '🛠️',
      color: 'from-purple-500 to-purple-600',
    },
    {
      number: '4.9★',
      label: 'Average Rating',
      icon: '⭐',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      number: '24/7',
      label: 'Emergency Support',
      icon: '🚨',
      color: 'from-red-500 to-red-600',
    },
    {
      number: '30 Days',
      label: 'Service Warranty',
      icon: '🛡️',
      color: 'from-indigo-500 to-indigo-600',
    },
  ];

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join thousands of satisfied customers who trust us for their expert service needs. 
            Our platform continues to grow with verified experts and happy customers.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="bg-gray-800 rounded-2xl p-8 hover:bg-gray-700 transition-colors">
                {/* Icon */}
                <div className="text-4xl mb-4">{stat.icon}</div>
                
                {/* Number */}
                <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                  {stat.number}
                </div>
                
                {/* Label */}
                <div className="text-gray-300 font-medium">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="bg-gray-800 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">
              Why Choose ExpertService?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div>
                <h4 className="font-semibold text-white mb-2">AI-Powered Matching</h4>
                <p className="text-gray-300 text-sm">
                  Our advanced AI finds the perfect expert for your specific needs in seconds.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Real-Time Tracking</h4>
                <p className="text-gray-300 text-sm">
                  Track your expert's location and get live updates on arrival time.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Service Warranty</h4>
                <p className="text-gray-300 text-sm">
                  All services come with a 30-day warranty for your peace of mind.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;




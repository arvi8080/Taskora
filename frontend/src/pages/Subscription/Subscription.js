import React from 'react';
import { motion } from 'framer-motion';

const Subscription = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Subscription Plans
          </h1>
          
          <div className="bg-white rounded-2xl p-8 shadow-soft">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Subscription Management Coming Soon
            </h2>
            <p className="text-gray-600">
              Manage your subscription, view billing history, 
              and upgrade your plan for more benefits.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Subscription;




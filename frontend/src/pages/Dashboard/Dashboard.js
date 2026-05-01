import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Welcome back, {user?.name}!
          </h1>
          
          <div className="bg-white rounded-2xl p-8 shadow-soft">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Dashboard Coming Soon
            </h2>
            <p className="text-gray-600">
              Your personalized dashboard with booking history, favorite experts, 
              and service recommendations will be available soon.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;




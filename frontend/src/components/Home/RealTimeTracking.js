import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const RealTimeTracking = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTracking, setIsTracking] = useState(false);

  const trackingSteps = [
    {
      status: 'Expert Assigned',
      time: '2:30 PM',
      description: 'Rajesh Kumar has been assigned to your booking',
      icon: '👨‍🔧',
      color: 'bg-blue-500',
    },
    {
      status: 'On the Way',
      time: '2:45 PM',
      description: 'Expert is on the way to your location',
      icon: '🚗',
      color: 'bg-yellow-500',
    },
    {
      status: 'Nearby',
      time: '3:00 PM',
      description: 'Expert is 5 minutes away from your location',
      icon: '📍',
      color: 'bg-orange-500',
    },
    {
      status: 'Arrived',
      time: '3:05 PM',
      description: 'Expert has arrived at your location',
      icon: '✅',
      color: 'bg-green-500',
    },
  ];

  useEffect(() => {
    if (isTracking) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < trackingSteps.length - 1) {
            return prev + 1;
          } else {
            setIsTracking(false);
            return prev;
          }
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isTracking, trackingSteps.length]);

  const startTracking = () => {
    setCurrentStep(0);
    setIsTracking(true);
  };

  return (
    <section className="py-20 bg-gray-50">
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
            Real-Time Expert Tracking
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track your expert's location in real-time, just like Uber. 
            Know exactly when they'll arrive and get live updates on their progress.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Demo Interface */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Live Tracking Demo
              </h3>
              <p className="text-gray-600">
                Click the button below to see real-time tracking in action
              </p>
            </div>

            {/* Tracking Status */}
            <div className="space-y-4 mb-6">
              {trackingSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-500 ${
                    index <= currentStep
                      ? 'bg-gray-50 border-l-4 border-primary-500'
                      : 'bg-gray-25'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: index <= currentStep ? 1 : 0.5,
                    x: 0 
                  }}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg ${
                    index <= currentStep ? step.color : 'bg-gray-300'
                  }`}>
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium ${
                        index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.status}
                      </h4>
                      <span className={`text-sm ${
                        index <= currentStep ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {step.time}
                      </span>
                    </div>
                    <p className={`text-sm ${
                      index <= currentStep ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Demo Button */}
            <button
              onClick={startTracking}
              disabled={isTracking}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                isTracking
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {isTracking ? 'Tracking in Progress...' : 'Start Demo Tracking'}
            </button>
          </motion.div>

          {/* Features List */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Why Real-Time Tracking Matters
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Peace of Mind</h4>
                    <p className="text-gray-600">Know exactly when your expert will arrive, so you can plan your day accordingly.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Accurate ETA</h4>
                    <p className="text-gray-600">Get precise arrival times based on real traffic conditions and expert location.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Live Communication</h4>
                    <p className="text-gray-600">Chat with your expert in real-time and get updates on any delays or changes.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Safety & Security</h4>
                    <p className="text-gray-600">Track verified experts with complete transparency and safety measures in place.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-primary-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-2">Ready to Experience It?</h4>
              <p className="text-gray-600 mb-4">
                Book your first service and see real-time tracking in action.
              </p>
              <button className="btn-primary btn-sm">
                Book Service Now
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RealTimeTracking;




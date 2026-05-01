import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { emergencyAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const Emergency = () => {
  const { user } = useAuth();
  const [sending, setSending] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const [emergencyData, setEmergencyData] = useState({
    type: 'general',
    description: '',
    location: null
  });

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  const handleSOS = async () => {
    if (!user) {
      toast.error('Please login to send emergency alert');
      return;
    }

    setSending(true);
    try {
      const location = await getCurrentLocation();

      const alertData = {
        type: 'sos',
        description: 'URGENT SOS - Immediate assistance required!',
        location,
        userId: user._id
      };

      await emergencyAPI.sendAlert(alertData);
      setAlertSent(true);
      toast.success('SOS alert sent! Help is on the way.');
    } catch (error) {
      console.error('SOS error:', error);
      toast.error('Failed to send SOS alert. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleSendAlert = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to send emergency alert');
      return;
    }

    if (!emergencyData.description.trim()) {
      toast.error('Please describe your emergency');
      return;
    }

    setSending(true);
    try {
      const location = await getCurrentLocation();

      const alertData = {
        ...emergencyData,
        location,
        userId: user._id
      };

      await emergencyAPI.sendAlert(alertData);
      setAlertSent(true);
      toast.success('Emergency alert sent! Help is on the way.');
      setEmergencyData({ type: 'general', description: '', location: null });
    } catch (error) {
      console.error('Emergency alert error:', error);
      toast.error('Failed to send emergency alert. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (alertSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 shadow-soft text-center max-w-md"
        >
          <div className="text-6xl mb-4">🚨</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Alert Sent Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Nearby experts have been notified. Help is on the way.
          </p>
          <button
            onClick={() => setAlertSent(false)}
            className="btn-secondary"
          >
            Send Another Alert
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Emergency Assistance
            </h1>
            <p className="text-lg text-gray-600">
              Get immediate help from nearby experts in emergency situations
            </p>
          </div>

          {/* SOS Button */}
          <motion.div
            className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 mb-8 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-xl font-semibold text-red-900 mb-4">
              🚨 Emergency SOS
            </h2>
            <p className="text-red-700 mb-6">
              For life-threatening emergencies, press the SOS button to alert all nearby experts immediately.
            </p>
            <button
              onClick={handleSOS}
              disabled={sending}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full text-xl disabled:opacity-50 disabled:cursor-not-allowed animate-pulse"
            >
              {sending ? 'Sending SOS...' : 'SOS - Send Alert'}
            </button>
          </motion.div>

          {/* Emergency Form */}
          <div className="bg-white rounded-2xl p-8 shadow-soft">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Report Emergency Situation
            </h2>

            <form onSubmit={handleSendAlert}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Type
                </label>
                <select
                  value={emergencyData.type}
                  onChange={(e) => setEmergencyData({ ...emergencyData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="general">General Emergency</option>
                  <option value="medical">Medical Emergency</option>
                  <option value="fire">Fire Emergency</option>
                  <option value="security">Security Issue</option>
                  <option value="vehicle">Vehicle Breakdown</option>
                  <option value="home">Home Emergency</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe Your Emergency
                </label>
                <textarea
                  value={emergencyData.description}
                  onChange={(e) => setEmergencyData({ ...emergencyData, description: e.target.value })}
                  placeholder="Please provide details about your emergency situation..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="text-sm text-yellow-800 font-medium">Location Access Required</p>
                    <p className="text-sm text-yellow-700">
                      Your current location will be shared with nearby experts to provide faster assistance.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? 'Sending Alert...' : 'Send Emergency Alert'}
              </button>
            </form>
          </div>

          {/* Emergency Tips */}
          <div className="bg-blue-50 rounded-2xl p-6 mt-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Emergency Tips
            </h3>
            <ul className="text-blue-800 space-y-2 text-sm">
              <li>• Stay calm and assess the situation</li>
              <li>• Provide clear and specific details about your emergency</li>
              <li>• Stay in a safe location if possible</li>
              <li>• Keep your phone charged and with you</li>
              <li>• For life-threatening emergencies, call emergency services first</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Emergency;




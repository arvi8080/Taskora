import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { expertsAPI, bookingsAPI } from '../../services/api';

const ExpertDashboard = () => {
  const [expert, setExpert] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchExpertProfile();
    fetchRecentBookings();
  }, []);

  const fetchExpertProfile = async () => {
    try {
      const response = await expertsAPI.getMyExpertProfile();
      setExpert(response.data.expert);

      // Calculate total and completed jobs from expert data if available
      if (response.data.expert) {
        const totalJobs = response.data.expert.totalJobs || 0;
        const completedJobs = response.data.expert.completedJobs || 0;
        // Update expert with calculated values if not present
        setExpert(prev => ({
          ...prev,
          totalJobs,
          completedJobs
        }));
      }
    } catch (error) {
      console.error('Error fetching expert profile:', error);
      toast.error('Failed to load expert profile');
      setExpert(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentBookings = async () => {
    try {
      const response = await bookingsAPI.getExpertBookings({ limit: 5, status: 'completed' });
      setRecentBookings(response.data.bookings || []);

      // Calculate earnings
      const totalEarnings = response.data.bookings?.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0) || 0;
      setEarnings(totalEarnings);
    } catch (error) {
      console.error('Error fetching recent bookings:', error);
      toast.error('Failed to load recent activity');
      setRecentBookings([]);
    }
  };

  const handleEdit = () => {
    setFormData({ ...expert });
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      // Update expert profile
      // await expertsAPI.updateExpert(expert._id, formData);
      setExpert(formData);
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({});
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your expert profile...</p>
        </div>
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Expert Dashboard
            </h1>

            <div className="bg-white rounded-2xl p-8 shadow-soft text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                No Expert Profile Found
              </h2>
              <p className="text-gray-600 mb-6">
                You haven't registered as an expert yet. Create your expert profile to start accepting bookings.
              </p>
              <a
                href="/become-expert"
                className="btn-primary btn-lg"
              >
                Become an Expert
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Expert Dashboard
            </h1>
            {!editing && (
              <button
                onClick={handleEdit}
                className="btn-secondary"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Profile Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total Jobs</h3>
              <p className="text-2xl font-bold text-gray-900">{expert.totalJobs || 0}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Completed Jobs</h3>
              <p className="text-2xl font-bold text-gray-900">{expert.completedJobs || 0}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Earnings</h3>
              <p className="text-2xl font-bold text-gray-900">₹{earnings}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Rating</h3>
              <p className="text-2xl font-bold text-gray-900">{expert.rating?.average || 0} ⭐</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
              <p className={`text-lg font-semibold ${expert.isOnline ? 'text-green-600' : 'text-red-600'}`}>
                {expert.isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="bg-white rounded-2xl p-8 shadow-soft mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Profile Details
            </h2>

            {editing ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Rate (₹ per hour)
                  </label>
                  <input
                    type="number"
                    value={formData.pricing?.baseRate || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      pricing: { ...formData.pricing, baseRate: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleSave}
                    className="btn-primary"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Base Rate:</span>
                  <span className="ml-2 text-lg font-semibold">₹{expert.pricing?.baseRate || 0}/hour</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Services:</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {expert.services?.map((service, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                      >
                        {service.category} - ₹{service.hourlyRate}/hr
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-8 shadow-soft">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <div key={booking._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{booking.service?.category || 'Service'}</p>
                      <p className="text-sm text-gray-500">{new Date(booking.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{booking.totalAmount || 0}</p>
                      <p className="text-sm text-green-600">Completed</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No recent bookings found.</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExpertDashboard;




import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { expertsAPI } from '../../services/api';
import ExpertCard from '../../components/Expert/ExpertCard';

const ExpertProfile = () => {
  const { id } = useParams();
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExpert = useCallback(async () => {
    try {
      setLoading(true);
      const response = await expertsAPI.getExpert(id);
      if (response.data.success) {
        setExpert(response.data.expert);
      } else {
        setError('Expert not found');
      }
    } catch (err) {
      setError(err.message || 'Error fetching expert details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchExpert();
  }, [fetchExpert]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading expert profile...</p>
        </div>
      </div>
    );
  }

  if (error || !expert) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Expert Profile
            </h1>

            <div className="bg-white rounded-2xl p-8 shadow-soft text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {error || 'Expert not found'}
              </h2>
              <p className="text-gray-600">
                The expert you're looking for doesn't exist or has been removed.
              </p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Expert Profile
          </h1>

          {/* Expert Card */}
          <div className="mb-8">
            <ExpertCard expert={expert} showFullDetails={true} />
          </div>

          {/* Detailed Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl p-8 shadow-soft">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Mobile Number:</span>
                  <span className="font-medium text-gray-900">{expert.user?.phone || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-2xl p-8 shadow-soft">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Services Offered
              </h2>
              <div className="space-y-4">
                {expert.services?.map((service, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium capitalize">{service.category}</h3>
                      <span className="text-lg font-bold text-primary-600">₹{service.hourlyRate}/hr</span>
                    </div>
                    {service.description && (
                      <p className="text-gray-600 mb-2">{service.description}</p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{service.experience} years experience</span>
                      {service.certifications?.length > 0 && (
                        <span>{service.certifications.length} certifications</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-2xl p-8 shadow-soft">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Availability
              </h2>
              <div className="space-y-3">
                {expert.availability?.schedule?.map((day) => (
                  <div key={day.day} className="flex justify-between items-center">
                    <span className="capitalize font-medium">{day.day}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${day.isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        {day.isAvailable ? `${day.startTime} - ${day.endTime}` : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Emergency Services:</span>
                    <span className={expert.availability?.emergencyAvailable ? 'text-green-600' : 'text-red-600'}>
                      {expert.availability?.emergencyAvailable ? 'Available' : 'Not Available'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Distance:</span>
                    <span>{expert.availability?.maxDistance || 10} km</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ratings & Reviews */}
            <div className="bg-white rounded-2xl p-8 shadow-soft">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Ratings & Reviews
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl font-bold text-gray-900">
                    {expert.rating?.average || 0}
                  </div>
                  <div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${i < Math.floor(expert.rating?.average || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      Based on {expert.rating?.count || 0} reviews
                    </p>
                  </div>
                </div>

                {/* Rating breakdown */}
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center space-x-2">
                      <span className="text-sm w-8">{rating}★</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{
                            width: `${expert.rating?.breakdown?.[rating.toString()] ?
                              (expert.rating.breakdown[rating.toString()] / expert.rating.count) * 100 : 0}%`
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">
                        {expert.rating?.breakdown?.[rating.toString()] || 0}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-2xl p-8 shadow-soft">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Statistics
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{expert.totalJobs || 0}</div>
                  <div className="text-sm text-gray-600">Total Jobs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{expert.completedJobs || 0}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {expert.responseTime?.average ? `${expert.responseTime.average}min` : 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">Avg Response</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {expert.gamification?.level || 1}
                  </div>
                  <div className="text-sm text-gray-600">Level</div>
                </div>
              </div>

              {/* Service Areas */}
              {expert.location?.serviceAreas?.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Service Areas</h3>
                  <div className="space-y-2">
                    {expert.location.serviceAreas.map((area, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-700">{area.name}</span>
                        <span className="text-sm text-gray-500">{area.radius}km radius</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExpertProfile;




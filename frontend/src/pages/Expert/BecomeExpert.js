import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { expertsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const BecomeExpert = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    services: [{
      category: '',
      subcategories: [],
      description: '',
      hourlyRate: 0,
      experience: 0
    }],
    availability: {
      schedule: [
        { day: 'monday', startTime: '09:00', endTime: '17:00', isAvailable: true },
        { day: 'tuesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
        { day: 'wednesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
        { day: 'thursday', startTime: '09:00', endTime: '17:00', isAvailable: true },
        { day: 'friday', startTime: '09:00', endTime: '17:00', isAvailable: true },
        { day: 'saturday', startTime: '09:00', endTime: '17:00', isAvailable: false },
        { day: 'sunday', startTime: '09:00', endTime: '17:00', isAvailable: false }
      ],
      emergencyAvailable: false,
      maxDistance: 10
    },
    location: {
      serviceAreas: [{
        name: '',
        coordinates: { lat: 0, lng: 0 },
        radius: 5
      }]
    },
    pricing: {
      baseRate: 0
    }
  });

  const serviceCategories = [
    'plumber', 'electrician', 'carpenter', 'painter', 'cleaner',
    'mechanic', 'technician', 'cook', 'gardener', 'other'
  ];

  const handleServiceChange = (index, field, value) => {
    const newServices = [...formData.services];
    newServices[index][field] = value;
    setFormData({ ...formData, services: newServices });
  };

  const addService = () => {
    setFormData({
      ...formData,
      services: [...formData.services, {
        category: '',
        subcategories: [],
        description: '',
        hourlyRate: 0,
        experience: 0
      }]
    });
  };

  const removeService = (index) => {
    const newServices = formData.services.filter((_, i) => i !== index);
    setFormData({ ...formData, services: newServices });
  };

  const handleScheduleChange = (dayIndex, field, value) => {
    const newSchedule = [...formData.availability.schedule];
    newSchedule[dayIndex][field] = value;
    setFormData({
      ...formData,
      availability: { ...formData.availability, schedule: newSchedule }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.services[0].category || !formData.services[0].hourlyRate || !formData.pricing.baseRate) {
        toast.error('Please fill in all required fields');
        return;
      }

      const expertData = {
        ...formData,
        services: formData.services.map(service => ({
          ...service,
          hourlyRate: parseFloat(service.hourlyRate),
          experience: parseInt(service.experience)
        })),
        pricing: {
          ...formData.pricing,
          baseRate: parseFloat(formData.pricing.baseRate)
        },
        availability: {
          ...formData.availability,
          maxDistance: parseInt(formData.availability.maxDistance)
        }
      };

      const response = await expertsAPI.registerExpert(expertData);

      if (response.data.success) {
        toast.success('Expert registration submitted successfully!');
        navigate('/experts');
      } else {
        toast.error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login First</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to become an expert.</p>
          <button
            onClick={() => navigate('/login')}
            className="btn-primary"
          >
            Go to Login
          </button>
        </div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Become an Expert
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Services Section */}
            <div className="bg-white rounded-2xl p-8 shadow-soft">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Services</h2>

              {formData.services.map((service, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Service {index + 1}</h3>
                    {formData.services.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeService(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        value={service.category}
                        onChange={(e) => handleServiceChange(index, 'category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select category</option>
                        {serviceCategories.map(cat => (
                          <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hourly Rate (₹) *
                      </label>
                      <input
                        type="number"
                        value={service.hourlyRate}
                        onChange={(e) => handleServiceChange(index, 'hourlyRate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experience (years) *
                      </label>
                      <input
                        type="number"
                        value={service.experience}
                        onChange={(e) => handleServiceChange(index, 'experience', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="5"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={service.description}
                        onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        rows="3"
                        placeholder="Describe your service expertise..."
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addService}
                className="btn-secondary"
              >
                Add Another Service
              </button>
            </div>

            {/* Pricing Section */}
            <div className="bg-white rounded-2xl p-8 shadow-soft">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Pricing</h2>

              <div className="max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Rate (₹ per hour) *
                </label>
                <input
                  type="number"
                  value={formData.pricing.baseRate}
                  onChange={(e) => setFormData({
                    ...formData,
                    pricing: { ...formData.pricing, baseRate: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="500"
                  required
                />
              </div>
            </div>

            {/* Availability Section */}
            <div className="bg-white rounded-2xl p-8 shadow-soft">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Availability</h2>

              <div className="space-y-4">
                {formData.availability.schedule.map((day, index) => (
                  <div key={day.day} className="flex items-center space-x-4">
                    <div className="w-24">
                      <span className="text-sm font-medium capitalize">{day.day}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={day.isAvailable}
                      onChange={(e) => handleScheduleChange(index, 'isAvailable', e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <input
                      type="time"
                      value={day.startTime}
                      onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                      disabled={!day.isAvailable}
                      className="px-2 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                    />
                    <span className="text-sm text-gray-500">to</span>
                    <input
                      type="time"
                      value={day.endTime}
                      onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                      disabled={!day.isAvailable}
                      className="px-2 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.availability.emergencyAvailable}
                    onChange={(e) => setFormData({
                      ...formData,
                      availability: {
                        ...formData.availability,
                        emergencyAvailable: e.target.checked
                      }
                    })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Available for emergency services</span>
                </div>

                <div className="max-w-md">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Service Distance (km)
                  </label>
                  <input
                    type="number"
                    value={formData.availability.maxDistance}
                    onChange={(e) => setFormData({
                      ...formData,
                      availability: {
                        ...formData.availability,
                        maxDistance: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="10"
                  />
                </div>
              </div>
            </div>

            {/* Service Areas Section */}
            <div className="bg-white rounded-2xl p-8 shadow-soft">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Service Areas</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area Name
                  </label>
                  <input
                    type="text"
                    value={formData.location.serviceAreas[0].name}
                    onChange={(e) => setFormData({
                      ...formData,
                      location: {
                        ...formData.location,
                        serviceAreas: [{
                          ...formData.location.serviceAreas[0],
                          name: e.target.value
                        }]
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Downtown Mumbai"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.location.serviceAreas[0].coordinates.lat}
                      onChange={(e) => setFormData({
                        ...formData,
                        location: {
                          ...formData.location,
                          serviceAreas: [{
                            ...formData.location.serviceAreas[0],
                            coordinates: {
                              ...formData.location.serviceAreas[0].coordinates,
                              lat: e.target.value
                            }
                          }]
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="19.0760"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.location.serviceAreas[0].coordinates.lng}
                      onChange={(e) => setFormData({
                        ...formData,
                        location: {
                          ...formData.location,
                          serviceAreas: [{
                            ...formData.location.serviceAreas[0],
                            coordinates: {
                              ...formData.location.serviceAreas[0].coordinates,
                              lng: e.target.value
                            }
                          }]
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="72.8777"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Radius (km)
                    </label>
                    <input
                      type="number"
                      value={formData.location.serviceAreas[0].radius}
                      onChange={(e) => setFormData({
                        ...formData,
                        location: {
                          ...formData.location,
                          serviceAreas: [{
                            ...formData.location.serviceAreas[0],
                            radius: parseInt(e.target.value)
                          }]
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="5"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary btn-lg px-12 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Become an Expert'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default BecomeExpert;

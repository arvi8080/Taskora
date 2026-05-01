import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { StarIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/solid';

const ExpertCard = ({ expert }) => {
  const { user, services, rating, location, isOnline, availability } = expert;

  // Get primary service
  const primaryService = services?.[0];
  const categoryIcons = {
    plumber: '🚰',
    electrician: '⚡',
    carpenter: '🔨',
    painter: '🎨',
    cleaner: '🧹',
    mechanic: '🔧',
    technician: '💻',
    cook: '👨‍🍳',
    gardener: '🌱',
    other: '🛠️'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={user?.avatar || '/default-avatar.png'}
                alt={user?.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              {isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{user?.name}</h3>
              <div className="flex items-center space-x-1">
                <StarIcon className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-600">
                  {rating?.average?.toFixed(1) || '0.0'} ({rating?.count || 0})
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-primary-600">
              ₹{primaryService?.hourlyRate || 'N/A'}
            </div>
            <div className="text-xs text-gray-500">per hour</div>
          </div>
        </div>

        {/* Service */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">{categoryIcons[primaryService?.category] || '🛠️'}</span>
            <span className="font-medium text-gray-900 capitalize">
              {primaryService?.category}
            </span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {primaryService?.description || 'Professional service provider'}
          </p>
        </div>

        {/* Experience */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <ClockIcon className="w-4 h-4" />
            <span>{primaryService?.experience || 0} years exp.</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <MapPinIcon className="w-4 h-4" />
            <span>{location?.current?.address ? 'Nearby' : 'Location N/A'}</span>
          </div>
        </div>

        {/* Availability */}
        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-1">Available Today</div>
          <div className="flex flex-wrap gap-1">
            {availability?.schedule?.slice(0, 3).map((slot, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full"
              >
                {slot.day.slice(0, 3)} {slot.startTime}-{slot.endTime}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Link
            to={`/expert/${expert._id}`}
            className="flex-1 btn-secondary btn-sm text-center"
          >
            View Profile
          </Link>
          <Link
            to={`/book-service?expert=${expert._id}`}
            className="flex-1 btn-primary btn-sm text-center"
          >
            Book Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ExpertCard;

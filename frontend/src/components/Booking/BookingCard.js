import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CalendarDaysIcon, MapPinIcon, UserIcon, TruckIcon } from '@heroicons/react/24/outline';

const BookingCard = ({ booking }) => {
  const { service, location, scheduling, expert, status, pricing } = booking;

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-orange-100 text-orange-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    disputed: 'bg-gray-100 text-gray-800'
  };

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
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{categoryIcons[service.category] || '🛠️'}</span>
            <div>
              <h3 className="font-semibold text-gray-900 capitalize">
                {service.category}
              </h3>
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>
                {status.replace('_', ' ')}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-primary-600">
              ₹{pricing.finalPrice}
            </div>
          </div>
        </div>

        {/* Service Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {service.description}
        </p>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <CalendarDaysIcon className="w-4 h-4 mr-2" />
            <span>{new Date(scheduling.preferredDate).toLocaleDateString()}</span>
            {scheduling.preferredTime.start && (
              <span className="ml-2">
                {scheduling.preferredTime.start} - {scheduling.preferredTime.end}
              </span>
            )}
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <MapPinIcon className="w-4 h-4 mr-2" />
            <span className="line-clamp-1">{location.address}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <UserIcon className="w-4 h-4 mr-2" />
            <span>{expert?.user?.name || 'Expert not assigned'}</span>
          </div>
        </div>

        {/* Tracking Indicator for Active Bookings */}
        {(status === 'accepted' || status === 'in_progress') && (
          <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2">
              <TruckIcon className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                {status === 'accepted' ? 'Expert on the way' : 'Service in progress'}
              </span>
            </div>
            <Link
              to={`/booking/${booking._id}`}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Track →
            </Link>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          <Link
            to={`/booking/${booking._id}`}
            className="flex-1 btn-secondary btn-sm text-center"
          >
            View Details
          </Link>
          {status === 'pending' && (
            <button className="btn-outline btn-sm text-red-600 border-red-300 hover:bg-red-50">
              Cancel
            </button>
          )}
          {status === 'in_progress' && (
            <Link
              to={`/chat/${booking._id}`}
              className="btn-primary btn-sm"
            >
              Chat
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BookingCard;

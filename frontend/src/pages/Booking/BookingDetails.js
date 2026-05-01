import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { bookingsAPI, trackingAPI } from '../../services/api';
import { useSocket } from '../../contexts/SocketContext';
import TrackingMap from '../../components/Booking/TrackingMap';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { socket } = useSocket();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expertLocation, setExpertLocation] = useState(null);
  const [eta, setEta] = useState(null);
  const [trackingHistory, setTrackingHistory] = useState([]);
  const [chatMessage, setChatMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

const fetchBookingDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await bookingsAPI.getBooking(id);
      if (response.data.success) {
        setBooking(response.data.booking);
        // If booking is active, fetch tracking data
        if (['accepted', 'in_progress'].includes(response.data.booking.status)) {
          // fetchTrackingHistory will be called in useEffect
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load booking details');
      toast.error('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchTrackingHistory = useCallback(async () => {
    try {
      const response = await trackingAPI.getTrackingHistory(id);
      if (response.data.success) {
        const history = response.data.tracking.history || [];
        setTrackingHistory(history);
        if (history.length > 0) {
          setExpertLocation(history[history.length - 1]);
        }
        setEta(response.data.tracking.estimatedArrival);
      }
    } catch (error) {
      console.error('Failed to fetch tracking history:', error);
    }
  }, [id]);

useEffect(() => {
    fetchBookingDetails();
  }, [fetchBookingDetails]);

useEffect(() => {
    if (booking && ['accepted', 'in_progress'].includes(booking.status)) {
      fetchTrackingHistory();
    }
  }, [booking, fetchTrackingHistory]);

  useEffect(() => {
    if (socket && booking) {
      // Listen for real-time tracking updates
      socket.on('expert-location-update', (data) => {
        if (data.bookingId === booking._id) {
          setExpertLocation(data.expertLocation);
          setEta(data.estimatedArrival);
        }
      });

      socket.on('expert-arrived', (data) => {
        if (data.bookingId === booking._id) {
          toast.success('Expert has arrived!');
          fetchBookingDetails(); // Refresh booking status
        }
      });

      socket.on('tracking-started', (data) => {
        if (data.bookingId === booking._id) {
          toast.success('Tracking has started!');
          fetchTrackingHistory();
        }
      });

      return () => {
        socket.off('expert-location-update');
        socket.off('expert-arrived');
        socket.off('tracking-started');
      };
    }
  }, [socket, booking, fetchBookingDetails, fetchTrackingHistory]);

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;

    try {
      setSendingMessage(true);
      await bookingsAPI.addMessage(id, { message: chatMessage, type: 'text' });
      setChatMessage('');
      toast.success('Message sent!');
      fetchBookingDetails(); // Refresh to show new message
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      disputed: 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 shadow-soft">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
              <p className="text-gray-600">{error}</p>
              <button
                onClick={() => navigate('/bookings')}
                className="mt-4 btn-primary"
              >
                Back to Bookings
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) return null;

  const isActiveBooking = ['accepted', 'in_progress'].includes(booking.status);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Booking Details
            </h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
              {booking.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Booking Information */}
            <div className="space-y-6">
              {/* Service Details */}
              <div className="bg-white rounded-2xl p-6 shadow-soft">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Details</h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Category:</span>
                    <span className="ml-2 text-gray-900 capitalize">{booking.service.category}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Description:</span>
                    <p className="ml-2 text-gray-900">{booking.service.description}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Urgency:</span>
                    <span className="ml-2 text-gray-900 capitalize">{booking.service.urgency}</span>
                  </div>
                  {booking.service.estimatedDuration && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Estimated Duration:</span>
                      <span className="ml-2 text-gray-900">{booking.service.estimatedDuration} hours</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Scheduling */}
              <div className="bg-white rounded-2xl p-6 shadow-soft">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Scheduling</h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Preferred Date:</span>
                    <span className="ml-2 text-gray-900">
                      {format(new Date(booking.scheduling.preferredDate), 'PPP')}
                    </span>
                  </div>
                  {booking.scheduling.preferredTime.start && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Time:</span>
                      <span className="ml-2 text-gray-900">
                        {booking.scheduling.preferredTime.start} - {booking.scheduling.preferredTime.end}
                      </span>
                    </div>
                  )}
                  {booking.scheduling.actualStartTime && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Started At:</span>
                      <span className="ml-2 text-gray-900">
                        {format(new Date(booking.scheduling.actualStartTime), 'PPp')}
                      </span>
                    </div>
                  )}
                  {booking.scheduling.actualEndTime && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Completed At:</span>
                      <span className="ml-2 text-gray-900">
                        {format(new Date(booking.scheduling.actualEndTime), 'PPp')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="bg-white rounded-2xl p-6 shadow-soft">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Address:</span>
                    <p className="ml-2 text-gray-900">{booking.location.address}</p>
                  </div>
                  {booking.location.landmark && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Landmark:</span>
                      <span className="ml-2 text-gray-900">{booking.location.landmark}</span>
                    </div>
                  )}
                  {booking.location.accessInstructions && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Access Instructions:</span>
                      <p className="ml-2 text-gray-900">{booking.location.accessInstructions}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-white rounded-2xl p-6 shadow-soft">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing</h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Base Price:</span>
                    <span className="ml-2 text-gray-900">₹{booking.pricing.basePrice}</span>
                  </div>
                  {booking.pricing.materialsCost > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Materials Cost:</span>
                      <span className="ml-2 text-gray-900">₹{booking.pricing.materialsCost}</span>
                    </div>
                  )}
                  {booking.pricing.discount > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Discount:</span>
                      <span className="ml-2 text-gray-900">-₹{booking.pricing.discount}</span>
                    </div>
                  )}
                  <div className="border-t pt-3">
                    <span className="text-sm font-medium text-gray-500">Total:</span>
                    <span className="ml-2 text-lg font-semibold text-gray-900">₹{booking.pricing.finalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Expert Info */}
              <div className="bg-white rounded-2xl p-6 shadow-soft">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Expert</h2>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {booking.expert.user.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{booking.expert.user.name}</h3>
                    <p className="text-sm text-gray-600">{booking.expert.user.phone}</p>
                  </div>
                </div>
              </div>

              {/* Chat Section */}
              {isActiveBooking && (
                <div className="bg-white rounded-2xl p-6 shadow-soft">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Chat with Expert</h2>
                  <div className="space-y-4">
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {booking.communication.chatMessages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs px-3 py-2 rounded-lg ${
                            msg.sender === 'user'
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="text-sm">{msg.message}</p>
                            <p className="text-xs opacity-75 mt-1">
                              {format(new Date(msg.timestamp), 'HH:mm')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={sendingMessage || !chatMessage.trim()}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                      >
                        {sendingMessage ? 'Sending...' : 'Send'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tracking Section */}
            <div className="space-y-6">
              {isActiveBooking ? (
                <>
                  <div className="bg-white rounded-2xl p-6 shadow-soft">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Live Tracking</h2>
                    <TrackingMap
                      expertLocation={expertLocation}
                      userLocation={booking.location.coordinates}
                      trackingHistory={trackingHistory}
                      eta={eta ? format(new Date(eta), 'HH:mm') : null}
                      status={booking.tracking?.expertLocation?.[booking.tracking.expertLocation.length - 1]?.status || 'en_route'}
                    />
                  </div>

                  {/* Tracking History */}
                  {trackingHistory.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow-soft">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Tracking History</h2>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {trackingHistory.slice(-10).reverse().map((location, index) => (
                          <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                            <div>
                              <p className="text-sm font-medium text-gray-900 capitalize">
                                {location.status.replace('_', ' ')}
                              </p>
                              <p className="text-xs text-gray-500">
                                {format(new Date(location.timestamp), 'PPp')}
                              </p>
                            </div>
                            <div className="text-xs text-gray-500">
                              {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white rounded-2xl p-6 shadow-soft">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Tracking</h2>
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <p className="text-gray-600">
                      {booking.status === 'completed'
                        ? 'Service completed successfully'
                        : booking.status === 'pending'
                        ? 'Tracking will be available once the expert accepts your booking'
                        : 'Tracking is not available for this booking status'
                      }
                    </p>
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

export default BookingDetails;

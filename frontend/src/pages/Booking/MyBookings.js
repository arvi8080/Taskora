import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { bookingsAPI } from '../../services/api';
import BookingCard from '../../components/Booking/BookingCard';
import { FunnelIcon } from '@heroicons/react/24/outline';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { status: statusFilter, page, limit: 10 };
      const response = await bookingsAPI.getMyBookings(params);
      if (response.data.success) {
        setBookings(response.data.bookings);
        setTotalPages(response.data.pagination.pages);
      } else {
        setError('Failed to load bookings');
      }
    } catch (err) {
      setError(err.message || 'Error fetching bookings');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const statusOptions = [
    { value: '', label: 'All Bookings' },
    { value: 'pending', label: 'Pending' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            My Bookings
          </h1>

          {/* Filter */}
          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <FunnelIcon className="w-5 h-5 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading && <p>Loading bookings...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && bookings.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No bookings found
              </h3>
              <p className="text-gray-600 mb-6">
                {statusFilter ? `No ${statusFilter} bookings found.` : 'You haven\'t booked any services yet.'}
              </p>
              <a href="/book-service" className="btn-primary btn-lg">
                Book a Service
              </a>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {bookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="btn btn-sm btn-secondary disabled:opacity-50"
              >
                Previous
              </button>
              <span className="btn btn-sm btn-disabled">{page}</span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="btn btn-sm btn-secondary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MyBookings;

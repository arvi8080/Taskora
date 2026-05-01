import React, { useState, useEffect, useCallback } from 'react';
import { expertsAPI } from '../../services/api';
import ExpertCard from '../../components/Expert/ExpertCard';
import { motion } from 'framer-motion';

const CookExperts = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchExperts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { category: 'cook', page, limit: 12 };
      const response = await expertsAPI.getExperts(params);
      if (response.data.success) {
        setExperts(response.data.experts);
        setTotalPages(response.data.pagination.pages);
      } else {
        setError('Failed to load experts');
      }
    } catch (err) {
      setError(err.message || 'Error fetching experts');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchExperts();
  }, [fetchExperts]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Cooking Experts
          </h1>

          {loading && <p>Loading experts...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && experts.length === 0 && (
            <p>No cooking experts found.</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {experts.map((expert) => (
              <ExpertCard key={expert._id} expert={expert} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
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

export default CookExperts;

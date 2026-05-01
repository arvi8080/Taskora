import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { expertsAPI } from '../../../services/api';
import ExpertCard from '../../../components/Expert/ExpertCard';
import toast from 'react-hot-toast';

const ExpertSelection = ({ category, location, selectedExpert, onSelect, onNext, onPrev }) => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(selectedExpert || null);

  const fetchExperts = useCallback(async () => {
    if (!category || !location?.coordinates?.lat || !location?.coordinates?.lng) {
      setExperts([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params = {
        category,
        location: `${location.coordinates.lat},${location.coordinates.lng}`,
        limit: 10,
        page: 1
      };
      const response = await expertsAPI.getExperts(params);
      if (response.data.success) {
        setExperts(response.data.experts);
      } else {
        setError('Failed to load experts');
      }
    } catch (err) {
      setError(err.message || 'Error fetching experts');
    } finally {
      setLoading(false);
    }
  }, [category, location]);

  useEffect(() => {
    fetchExperts();
  }, [fetchExperts]);

  const handleSelect = (expert) => {
    setSelected(expert);
    onSelect(expert);
  };

  const handleNext = () => {
    if (!selected) {
      toast.error('Please select an expert to continue');
      return;
    }
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-8 shadow-soft"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Choose an Expert
      </h2>

      {loading && <p>Loading experts...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && experts.length === 0 && (
        <p>No experts found for your location and service category.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {experts.map((expert) => (
          <div
            key={expert._id}
            onClick={() => handleSelect(expert)}
            className={`cursor-pointer border rounded-xl p-2 transition-shadow ${
              selected?._id === expert._id ? 'border-primary-600 shadow-lg' : 'border-gray-200 hover:shadow-md'
            }`}
          >
            <ExpertCard expert={expert} />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="btn-secondary btn-lg px-6"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="btn-primary btn-lg px-8"
        >
          Continue to Review
        </button>
      </div>
    </motion.div>
  );
};

export default ExpertSelection;

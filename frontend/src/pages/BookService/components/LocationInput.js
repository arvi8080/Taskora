import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPinIcon } from '@heroicons/react/24/outline';

const LocationInput = ({ data, onUpdate, onNext, onPrev }) => {
  const [address, setAddress] = useState(data.address || '');
  const [landmark, setLandmark] = useState(data.landmark || '');
  const [accessInstructions, setAccessInstructions] = useState(data.accessInstructions || '');
  const [coordinates, setCoordinates] = useState(data.coordinates || { lat: null, lng: null });

  // Mock geolocation - in real app, integrate with Google Maps or similar
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lng: longitude });
          // In real app, reverse geocode to get address
          setAddress(`Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enter address manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleNext = () => {
    if (!address.trim()) {
      alert('Please enter your service address');
      return;
    }

    onUpdate({
      address: address.trim(),
      coordinates,
      landmark: landmark.trim(),
      accessInstructions: accessInstructions.trim()
    });
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-8 shadow-soft"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Where do you need the service?
      </h2>

      {/* Current Location Button */}
      <div className="mb-6">
        <button
          onClick={getCurrentLocation}
          className="btn-secondary btn-sm flex items-center gap-2"
        >
          <MapPinIcon className="w-4 h-4" />
          Use Current Location
        </button>
      </div>

      {/* Address Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service Address *
        </label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter the complete address where service is needed"
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">
          Include house number, street, area, city, and pincode
        </p>
      </div>

      {/* Landmark */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nearby Landmark (Optional)
        </label>
        <input
          type="text"
          value={landmark}
          onChange={(e) => setLandmark(e.target.value)}
          placeholder="e.g., Near Central Mall, Opposite Police Station"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Access Instructions */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Access Instructions (Optional)
        </label>
        <textarea
          value={accessInstructions}
          onChange={(e) => setAccessInstructions(e.target.value)}
          placeholder="Any specific instructions for the expert (e.g., call before coming, use back entrance, parking instructions)"
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Map Placeholder */}
      <div className="mb-8">
        <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
          <div className="text-center">
            <MapPinIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Map integration coming soon</p>
            <p className="text-sm text-gray-400">Location will be shown here</p>
          </div>
        </div>
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
          Continue to Date & Time
        </button>
      </div>
    </motion.div>
  );
};

export default LocationInput;

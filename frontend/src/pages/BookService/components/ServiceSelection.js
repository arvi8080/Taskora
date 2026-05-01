import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ServiceSelection = ({ data, onUpdate, onNext }) => {
  const [selectedCategory, setSelectedCategory] = useState(data.category || '');
  const [subcategory, setSubcategory] = useState(data.subcategory || '');
  const [description, setDescription] = useState(data.description || '');
  const [urgency, setUrgency] = useState(data.urgency || 'medium');

  const categories = [
    { id: 'plumber', name: 'Plumbing', icon: '🚰' },
    { id: 'electrician', name: 'Electrical', icon: '⚡' },
    { id: 'carpenter', name: 'Carpentry', icon: '🔨' },
    { id: 'painter', name: 'Painting', icon: '🎨' },
    { id: 'cleaner', name: 'Cleaning', icon: '🧹' },
    { id: 'mechanic', name: 'Mechanic', icon: '🔧' },
    { id: 'technician', name: 'Technician', icon: '💻' },
    { id: 'cook', name: 'Cooking', icon: '👨‍🍳' },
    { id: 'gardener', name: 'Gardening', icon: '🌱' },
    { id: 'other', name: 'Other', icon: '🛠️' }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low Priority', description: 'Schedule at your convenience' },
    { value: 'medium', label: 'Medium Priority', description: 'Within a few days' },
    { value: 'high', label: 'High Priority', description: 'As soon as possible' },
    { value: 'emergency', label: 'Emergency', description: 'Immediate attention needed' }
  ];

  const handleNext = () => {
    if (!selectedCategory || !description.trim()) {
      alert('Please select a service category and provide a description');
      return;
    }

    onUpdate({
      category: selectedCategory,
      subcategory,
      description: description.trim(),
      urgency
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
        What service do you need?
      </h2>

      {/* Service Category */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Service Category *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedCategory === category.id
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <div className="text-sm font-medium">{category.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Subcategory */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subcategory (Optional)
        </label>
        <input
          type="text"
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          placeholder="e.g., Kitchen plumbing, AC repair"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Describe your service needs *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Please provide details about what you need help with..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Urgency */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          How urgent is this? *
        </label>
        <div className="space-y-2">
          {urgencyLevels.map((level) => (
            <label key={level.value} className="flex items-center">
              <input
                type="radio"
                name="urgency"
                value={level.value}
                checked={urgency === level.value}
                onChange={(e) => setUrgency(e.target.value)}
                className="text-primary-600 focus:ring-primary-500"
              />
              <div className="ml-3">
                <div className="font-medium text-gray-900">{level.label}</div>
                <div className="text-sm text-gray-500">{level.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="btn-primary btn-lg px-8"
        >
          Continue to Location
        </button>
      </div>
    </motion.div>
  );
};

export default ServiceSelection;

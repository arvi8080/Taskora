import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline';

const DateTimeSelection = ({ data, onUpdate, onNext, onPrev }) => {
  const [preferredDate, setPreferredDate] = useState(data.preferredDate || '');
  const [startTime, setStartTime] = useState(data.preferredTime?.start || '');
  const [endTime, setEndTime] = useState(data.preferredTime?.end || '');
  const [flexible, setFlexible] = useState(data.flexible || false);

  // Generate time slots
  const timeSlots = [];
  for (let hour = 6; hour <= 22; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(timeString);
    }
  }

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Get maximum date (30 days from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  const handleNext = () => {
    if (!preferredDate) {
      alert('Please select a preferred date');
      return;
    }

    if (!flexible && (!startTime || !endTime)) {
      alert('Please select preferred time slots');
      return;
    }

    onUpdate({
      preferredDate,
      preferredTime: { start: startTime, end: endTime },
      flexible
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
        When should we schedule the service?
      </h2>

      {/* Date Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Date *
        </label>
        <div className="relative">
          <CalendarDaysIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="date"
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
            min={getMinDate()}
            max={getMaxDate()}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Service can be scheduled from tomorrow onwards
        </p>
      </div>

      {/* Flexible Checkbox */}
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={flexible}
            onChange={(e) => setFlexible(e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-gray-700">
            I'm flexible with timing - expert can suggest best time
          </span>
        </label>
      </div>

      {/* Time Selection */}
      {!flexible && (
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Preferred Time Slot *
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Time */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">From</label>
              <div className="relative">
                <ClockIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                >
                  <option value="">Select start time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* End Time */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">To</label>
              <div className="relative">
                <ClockIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                >
                  <option value="">Select end time</option>
                  {timeSlots
                    .filter((time) => !startTime || time > startTime)
                    .map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Typical service duration: 1-3 hours. Expert will confirm exact timing.
          </p>
        </div>
      )}

      {/* Quick Time Suggestions */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Suggestions</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Morning (9-12)', start: '09:00', end: '12:00' },
            { label: 'Afternoon (12-3)', start: '12:00', end: '15:00' },
            { label: 'Evening (3-6)', start: '15:00', end: '18:00' },
            { label: 'Anytime Today', start: '', end: '', flexible: true }
          ].map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                setStartTime(suggestion.start);
                setEndTime(suggestion.end);
                setFlexible(suggestion.flexible || false);
              }}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              {suggestion.label}
            </button>
          ))}
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
          Continue to Expert Selection
        </button>
      </div>
    </motion.div>
  );
};

export default DateTimeSelection;

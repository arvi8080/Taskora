import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { bookingsAPI, expertsAPI } from '../../services/api';
import toast from 'react-hot-toast';

// Step Components
import ServiceSelection from './components/ServiceSelection';
import LocationInput from './components/LocationInput';
import DateTimeSelection from './components/DateTimeSelection';
import ExpertSelection from './components/ExpertSelection';
import BookingReview from './components/BookingReview';

const BookService = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    service: {
      category: '',
      subcategory: '',
      description: '',
      urgency: 'medium'
    },
    location: {
      address: '',
      coordinates: { lat: null, lng: null },
      landmark: '',
      accessInstructions: ''
    },
    scheduling: {
      preferredDate: null,
      preferredTime: { start: '', end: '' },
      flexible: false
    },
    expert: null,
    pricing: {
      basePrice: 0,
      materialsCost: 0,
      discount: 0
    }
  });

  const [loading, setLoading] = useState(false);

  // Pre-fill expert if provided in URL
  useEffect(() => {
    const expertId = searchParams.get('expert');
    if (expertId) {
      fetchExpertDetails(expertId);
    }
  }, [searchParams]);

  const fetchExpertDetails = async (expertId) => {
    try {
      const response = await expertsAPI.getExpert(expertId);
      if (response.data.success) {
        setBookingData(prev => ({
          ...prev,
          expert: response.data.expert,
          service: {
            ...prev.service,
            category: response.data.expert.services[0]?.category || ''
          }
        }));
        setCurrentStep(2); // Skip to location step
      }
    } catch (error) {
      toast.error('Failed to load expert details');
    }
  };

  const updateBookingData = (stepData) => {
    setBookingData(prev => ({
      ...prev,
      ...stepData
    }));
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBookingSubmit = async () => {
    setLoading(true);
    try {
      const bookingPayload = {
        service: bookingData.service,
        location: bookingData.location,
        scheduling: bookingData.scheduling,
        expert: bookingData.expert._id,
        pricing: {
          basePrice: bookingData.pricing.basePrice,
          materialsCost: bookingData.pricing.materialsCost,
          discount: bookingData.pricing.discount
        }
      };

      const response = await bookingsAPI.createBooking(bookingPayload);
      if (response.data.success) {
        toast.success('Booking created successfully!');
        navigate(`/booking/${response.data.booking._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, title: 'Service', description: 'Choose service type' },
    { id: 2, title: 'Location', description: 'Where do you need service?' },
    { id: 3, title: 'Date & Time', description: 'When should we come?' },
    { id: 4, title: 'Expert', description: 'Choose your expert' },
    { id: 5, title: 'Review', description: 'Confirm and pay' }
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ServiceSelection
            data={bookingData.service}
            onUpdate={(data) => updateBookingData({ service: data })}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <LocationInput
            data={bookingData.location}
            onUpdate={(data) => updateBookingData({ location: data })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <DateTimeSelection
            data={bookingData.scheduling}
            onUpdate={(data) => updateBookingData({ scheduling: data })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <ExpertSelection
            category={bookingData.service.category}
            location={bookingData.location}
            selectedExpert={bookingData.expert}
            onSelect={(expert) => updateBookingData({ expert })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 5:
        return (
          <BookingReview
            bookingData={bookingData}
            onSubmit={handleBookingSubmit}
            onPrev={prevStep}
            loading={loading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Book a Service
          </h1>
          <p className="text-gray-600">
            Get professional help for your home and lifestyle needs
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.id <= currentStep
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step.id}
                </div>
                <div className="ml-2 hidden sm:block">
                  <div className={`text-sm font-medium ${
                    step.id <= currentStep ? 'text-primary-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
                {step.id < steps.length && (
                  <div
                    className={`w-12 h-0.5 mx-4 ${
                      step.id < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BookService;

import React from 'react';
import { motion } from 'framer-motion';
import { paymentsAPI } from '../../../services/api';
import toast from 'react-hot-toast';

const BookingReview = ({ bookingData, onSubmit, onPrev, loading }) => {

  const handlePayment = async () => {
    try {
      // Create payment intent
      const amount = bookingData.pricing.finalPrice || bookingData.pricing.basePrice;
      const response = await paymentsAPI.createPaymentIntent({
        amount,
        bookingId: bookingData._id
      });

      if (response.data.success) {
        // Redirect to payment page or handle payment here
        toast.success('Payment intent created. Proceed to payment gateway.');
        onSubmit();
      } else {
        toast.error('Failed to initiate payment');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment initiation failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-8 shadow-soft"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Review Your Booking
      </h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Service Details</h3>
        <p><strong>Category:</strong> {bookingData.service.category}</p>
        {bookingData.service.subcategory && <p><strong>Subcategory:</strong> {bookingData.service.subcategory}</p>}
        <p><strong>Description:</strong> {bookingData.service.description}</p>
        <p><strong>Urgency:</strong> {bookingData.service.urgency}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Location</h3>
        <p>{bookingData.location.address}</p>
        {bookingData.location.landmark && <p><strong>Landmark:</strong> {bookingData.location.landmark}</p>}
        {bookingData.location.accessInstructions && <p><strong>Access Instructions:</strong> {bookingData.location.accessInstructions}</p>}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Schedule</h3>
        <p><strong>Date:</strong> {bookingData.scheduling.preferredDate}</p>
        <p><strong>Time:</strong> {bookingData.scheduling.preferredTime.start} - {bookingData.scheduling.preferredTime.end}</p>
        <p><strong>Flexible:</strong> {bookingData.scheduling.flexible ? 'Yes' : 'No'}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Expert</h3>
        <p>{bookingData.expert?.user?.name || 'Not selected'}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Pricing</h3>
        <p><strong>Base Price:</strong> ₹{bookingData.pricing.basePrice}</p>
        <p><strong>Materials Cost:</strong> ₹{bookingData.pricing.materialsCost}</p>
        <p><strong>Discount:</strong> ₹{bookingData.pricing.discount}</p>
        <p className="font-bold"><strong>Total:</strong> ₹{bookingData.pricing.finalPrice || bookingData.pricing.basePrice}</p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="btn-secondary btn-lg px-6"
          disabled={loading}
        >
          Back
        </button>
        <button
          onClick={handlePayment}
          className="btn-primary btn-lg px-8"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Confirm & Pay'}
        </button>
      </div>
    </motion.div>
  );
};

export default BookingReview;

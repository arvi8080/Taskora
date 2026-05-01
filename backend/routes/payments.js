const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');

// Initialize Stripe only if API key is available
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  const Stripe = require('stripe');
  stripe = Stripe(process.env.STRIPE_SECRET_KEY);
}

// Create payment intent with price validation
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return res.status(503).json({
        success: false,
        message: 'Payment service is not configured. Please contact support.'
      });
    }

    const { amount, currency = 'inr', bookingId } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment amount'
      });
    }

    // If bookingId is provided, validate the amount matches the booking price
    if (bookingId) {
      const booking = await Booking.findById(bookingId);
      if (booking) {
        const expectedAmount = booking.pricing.finalPrice;
        // Allow small difference due to rounding
        if (Math.abs(amount - expectedAmount) > 1) {
          return res.status(400).json({
            success: false,
            message: 'Payment amount does not match booking price',
            expected: expectedAmount,
            received: amount
          });
        }
      }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      metadata: {
        bookingId: bookingId || 'N/A',
        userId: req.user._id.toString()
      }
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      error: error.message
    });
  }
});

// Confirm payment
router.post('/confirm-payment', auth, async (req, res) => {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return res.status(503).json({
        success: false,
        message: 'Payment service is not configured. Please contact support.'
      });
    }

    const { paymentIntentId, bookingId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment intent ID is required'
      });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update booking payment status if bookingId is provided
      if (bookingId) {
        const booking = await Booking.findById(bookingId);
        
        if (booking) {
          booking.payment.status = 'paid';
          booking.payment.transactionId = paymentIntentId;
          booking.payment.paidAt = new Date();
          await booking.save();
        }
      }

      res.json({
        success: true,
        message: 'Payment confirmed successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not completed',
        status: paymentIntent.status
      });
    }
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm payment',
      error: error.message
    });
  }
});

// Stripe webhook handler
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (endpointSecret && stripe) {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } else {
      // If no webhook secret, just parse the event
      event = JSON.parse(req.body);
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      
      // Update booking if this is a booking payment
      const bookingId = paymentIntent.metadata.bookingId;
      if (bookingId && bookingId !== 'N/A') {
        try {
          const booking = await Booking.findById(bookingId);
          if (booking) {
            booking.payment.status = 'paid';
            booking.payment.transactionId = paymentIntent.id;
            booking.payment.paidAt = new Date();
            await booking.save();
            console.log('Booking payment updated:', bookingId);
          }
        } catch (err) {
          console.error('Error updating booking payment:', err);
        }
      }
      break;
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      break;
      
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = router;




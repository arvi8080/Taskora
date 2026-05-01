const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Initialize Stripe only if API key is available
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  const Stripe = require('stripe');
  stripe = Stripe(process.env.STRIPE_SECRET_KEY);
}

// Plan prices in INR (will be converted to paise)
const PLAN_PRICES = {
  'free': 0,
  'basic': 29900, // ₹299 in paise
  'premium': 59900, // ₹599 in paise
  'enterprise': 99900 // ₹999 in paise
};

// Get subscription plans
router.get('/plans', async (req, res) => {
  try {
    const plans = [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        features: [
          'Basic service booking',
          'Standard support',
          'Basic tracking'
        ]
      },
      {
        id: 'basic',
        name: 'Basic',
        price: 299,
        features: [
          'Unlimited bookings',
          'Priority support',
          '5% discount on all services',
          'Advanced tracking'
        ]
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 599,
        features: [
          'Unlimited bookings',
          'Premium support',
          '15% discount on all services',
          'Real-time tracking',
          'Video consultations',
          'Emergency priority'
        ]
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 999,
        features: [
          'Unlimited bookings',
          '24/7 dedicated support',
          '25% discount on all services',
          'All premium features',
          'Custom integrations',
          'Analytics dashboard'
        ]
      }
    ];

    res.json({
      success: true,
      plans
    });
  } catch (error) {
    console.error('Get subscription plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subscription plans',
      error: error.message
    });
  }
});

// Create subscription payment intent
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return res.status(503).json({
        success: false,
        message: 'Payment service is not configured. Please contact support.'
      });
    }

    const { planId } = req.body;

    // Validate plan
    const planPrice = PLAN_PRICES[planId];
    if (planPrice === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan selected'
      });
    }

    // Free plan doesn't need payment
    if (planPrice === 0) {
      return res.json({
        success: true,
        clientSecret: null,
        requiresPayment: false
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: planPrice,
      currency: 'inr',
      metadata: {
        planId,
        userId: req.user._id.toString(),
        type: 'subscription'
      }
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      requiresPayment: true
    });
  } catch (error) {
    console.error('Create subscription payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      error: error.message
    });
  }
});

// Subscribe to a plan (with payment confirmation)
router.post('/subscribe', auth, async (req, res) => {
  try {
    const { planId, paymentIntentId } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Validate plan
    const planPrice = PLAN_PRICES[planId];
    if (planPrice === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan selected'
      });
    }

    // For paid plans, verify payment
    if (planPrice > 0) {
      if (!paymentIntentId) {
        return res.status(400).json({
          success: false,
          message: 'Payment required for this plan'
        });
      }

      // Check if Stripe is configured
      if (!stripe) {
        return res.status(503).json({
          success: false,
          message: 'Payment service is not configured'
        });
      }

      // Verify payment intent
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({
          success: false,
          message: 'Payment not completed'
        });
      }
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription

    user.subscription = {
      plan: planId,
      startDate,
      endDate,
      autoRenew: true,
      paymentStatus: planPrice > 0 ? 'paid' : 'free',
      transactionId: paymentIntentId || null
    };

    await user.save();

    res.json({
      success: true,
      message: 'Subscription activated successfully',
      subscription: user.subscription
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe',
      error: error.message
    });
  }
});

// Get user's subscription
router.get('/my-subscription', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      subscription: user.subscription
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subscription',
      error: error.message
    });
  }
});

module.exports = router;




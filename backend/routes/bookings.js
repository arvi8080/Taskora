const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Expert = require('../models/Expert');
const TrackingService = require('../services/trackingService');
const auth = require('../middleware/auth');

// Create new booking
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const bookingData = {
      user: userId,
      ...req.body
    };

    const booking = new Booking(bookingData);
    await booking.save();

    // Populate expert and user data
    await booking.populate('expert', 'user services rating')
      .populate('user', 'name phone');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message
    });
  }
});

// Get user's bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { status, limit = 10, page = 1 } = req.query;

    let query = { user: userId };
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('expert', 'user services rating')
      .populate('user', 'name phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      bookings,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get bookings',
      error: error.message
    });
  }
});

// Get expert's bookings
router.get('/expert-bookings', auth, async (req, res) => {
  try {
    const expertId = req.user.expertId;
    const { status, limit = 10, page = 1 } = req.query;

    let query = { expert: expertId };
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name phone address')
      .populate('expert', 'user services')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      bookings,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get expert bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get expert bookings',
      error: error.message
    });
  }
});

// Get booking by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name phone address')
      .populate('expert', 'user services rating');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get booking',
      error: error.message
    });
  }
});

// Update booking status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check permissions
    const isUser = booking.user.toString() === req.user._id.toString();
    const isExpert = booking.expert.toString() === req.user.expertId;

    if (!isUser && !isExpert) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    booking.status = status;
    
    // Start tracking if accepted
    if (status === 'accepted') {
      await TrackingService.startTracking(booking._id);
    }
    
    // Update timestamps based on status
    if (status === 'in_progress') {
      booking.scheduling.actualStartTime = new Date();
    } else if (status === 'completed') {
      booking.scheduling.actualEndTime = new Date();
    }

    await booking.save();

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
      error: error.message
    });
  }
});

// Add chat message
router.post('/:id/messages', auth, async (req, res) => {
  try {
    const { message, type = 'text' } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Determine sender
    let sender = 'system';
    if (booking.user.toString() === req.user._id.toString()) {
      sender = 'user';
    } else if (booking.expert.toString() === req.user.expertId) {
      sender = 'expert';
    }

    await booking.addMessage(sender, message, type);

    res.json({
      success: true,
      message: 'Message added successfully'
    });
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add message',
      error: error.message
    });
  }
});

// Rate booking
router.post('/:id/rate', auth, async (req, res) => {
  try {
    const { rating, review, type } = req.body; // type: 'user' or 'expert'
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check permissions and update appropriate rating
    if (type === 'user' && booking.user.toString() === req.user._id.toString()) {
      booking.rating.userRating = {
        rating,
        review,
        ratedAt: new Date()
      };
    } else if (type === 'expert' && booking.expert.toString() === req.user.expertId) {
      booking.rating.expertRating = {
        rating,
        review,
        ratedAt: new Date()
      };
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await booking.save();

    // Update expert's overall rating if user rated
    if (type === 'user') {
      const expert = await Expert.findById(booking.expert);
      await expert.updateRating(rating);
    }

    res.json({
      success: true,
      message: 'Rating submitted successfully'
    });
  } catch (error) {
    console.error('Rate booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit rating',
      error: error.message
    });
  }
});

// Cancel booking
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if booking can be cancelled
    if (['completed', 'cancelled'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled'
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: error.message
    });
  }
});

module.exports = router;




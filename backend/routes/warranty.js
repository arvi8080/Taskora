const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

// Claim warranty for a booking
router.post('/claim/:bookingId', auth, async (req, res) => {
  try {
    const { description } = req.body;
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if warranty is eligible
    if (!booking.warranty.isEligible) {
      return res.status(400).json({
        success: false,
        message: 'This booking is not eligible for warranty'
      });
    }

    // Check if warranty is still valid
    if (booking.warranty.endDate && new Date() > booking.warranty.endDate) {
      return res.status(400).json({
        success: false,
        message: 'Warranty period has expired'
      });
    }

    // Add warranty claim
    booking.warranty.claims.push({
      description,
      status: 'pending',
      submittedAt: new Date()
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Warranty claim submitted successfully',
      claim: booking.warranty.claims[booking.warranty.claims.length - 1]
    });
  } catch (error) {
    console.error('Warranty claim error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit warranty claim',
      error: error.message
    });
  }
});

// Get warranty claims for a booking
router.get('/claims/:bookingId', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate('expert', 'user services rating')
      .populate('user', 'name phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking or is the expert
    const isUser = booking.user._id.toString() === req.user._id.toString();
    const isExpert = booking.expert && booking.expert._id.toString() === req.user.expertId;

    if (!isUser && !isExpert && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      warranty: {
        isEligible: booking.warranty.isEligible,
        duration: booking.warranty.duration,
        startDate: booking.warranty.startDate,
        endDate: booking.warranty.endDate,
        claims: booking.warranty.claims
      }
    });
  } catch (error) {
    console.error('Get warranty claims error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get warranty claims',
      error: error.message
    });
  }
});

// Update warranty claim status (approve/reject)
router.put('/claims/:claimId', auth, async (req, res) => {
  try {
    const { status, description } = req.body;
    const { claimId } = req.params;

    // Find booking containing this claim
    const booking = await Booking.findOne({
      'warranty.claims._id': claimId
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Warranty claim not found'
      });
    }

    // Check if user is the expert or admin
    const isExpert = booking.expert.toString() === req.user.expertId;
    if (!isExpert && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Find and update the claim
    const claim = booking.warranty.claims.id(claimId);
    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      });
    }

    if (status) {
      claim.status = status;
    }
    if (description) {
      claim.description = description;
    }
    if (status === 'approved' || status === 'rejected') {
      claim.resolvedAt = new Date();
    }

    await booking.save();

    res.json({
      success: true,
      message: 'Warranty claim updated successfully',
      claim
    });
  } catch (error) {
    console.error('Update warranty claim error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update warranty claim',
      error: error.message
    });
  }
});

module.exports = router;

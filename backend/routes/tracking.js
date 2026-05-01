const express = require('express');
const router = express.Router();
const TrackingService = require('../services/trackingService');
const auth = require('../middleware/auth');

// Update expert location
router.post('/update-location', auth, async (req, res) => {
  try {
    const { lat, lng, address } = req.body;
    const expertId = req.user.expertId;
    
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const result = await TrackingService.updateExpertLocation(expertId, {
      lat,
      lng,
      address
    });

    res.json(result);
  } catch (error) {
    console.error('Location update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update location',
      error: error.message
    });
  }
});

// Start tracking for a booking
router.post('/start-tracking/:bookingId', auth, async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const result = await TrackingService.startTracking(bookingId);
    res.json(result);
  } catch (error) {
    console.error('Start tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start tracking',
      error: error.message
    });
  }
});

// Get tracking history
router.get('/history/:bookingId', auth, async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const result = await TrackingService.getTrackingHistory(bookingId);
    res.json(result);
  } catch (error) {
    console.error('Get tracking history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get tracking history',
      error: error.message
    });
  }
});

// Emergency location sharing
router.post('/emergency-location', auth, async (req, res) => {
  try {
    const { lat, lng, address } = req.body;
    const userId = req.user.id;
    
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Location coordinates are required'
      });
    }

    const result = await TrackingService.shareEmergencyLocation(userId, {
      lat,
      lng,
      address
    });

    res.json(result);
  } catch (error) {
    console.error('Emergency location sharing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to share emergency location',
      error: error.message
    });
  }
});

// Share live location
router.post('/live-location/:bookingId', auth, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { lat, lng, address } = req.body;
    
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Location coordinates are required'
      });
    }

    const result = await TrackingService.shareLiveLocation(bookingId, {
      lat,
      lng,
      address
    });

    res.json(result);
  } catch (error) {
    console.error('Live location sharing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to share live location',
      error: error.message
    });
  }
});

// Check arrival
router.post('/check-arrival/:bookingId', auth, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { lat, lng } = req.body;
    
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Location coordinates are required'
      });
    }

    const result = await TrackingService.checkArrival(bookingId, { lat, lng });
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Check arrival error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check arrival',
      error: error.message
    });
  }
});

module.exports = router;




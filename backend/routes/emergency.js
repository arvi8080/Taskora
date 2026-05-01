const express = require('express');
const router = express.Router();
const Expert = require('../models/Expert');
const auth = require('../middleware/auth');

// Send emergency alert
router.post('/alert', auth, async (req, res) => {
  try {
    const { location, emergencyType, description } = req.body;
    const userId = req.user._id;

    // Find nearby emergency experts
    const nearbyExperts = await Expert.find({
      'location.current': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [location.lng, location.lat]
          },
          $maxDistance: 5000 // 5km radius
        }
      },
      'availability.emergencyAvailable': true,
      isOnline: true
    }).populate('user', 'name phone');

    // Send emergency alert via Socket.IO
    const { io } = require('../server');
    const emergencyAlert = {
      userId,
      userName: req.user.name,
      location,
      emergencyType,
      description,
      timestamp: new Date()
    };

    nearbyExperts.forEach(expert => {
      io.to(expert.user._id.toString()).emit('emergency-alert', emergencyAlert);
    });

    res.json({
      success: true,
      message: 'Emergency alert sent',
      expertsNotified: nearbyExperts.length
    });
  } catch (error) {
    console.error('Emergency alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send emergency alert',
      error: error.message
    });
  }
});

module.exports = router;




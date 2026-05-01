const express = require('express');
const router = express.Router();
const Expert = require('../models/Expert');
const User = require('../models/User');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Get all experts
router.get('/', async (req, res) => {
  try {
    const { category, location, limit = 20, page = 1 } = req.query;

    let query = { isVerified: true, isAvailable: true };

    if (category) {
      query['services.category'] = category;
    }

    if (location) {
      const coords = location.split(',');
      if (coords.length !== 2) {
        return res.status(400).json({
          success: false,
          message: 'Invalid location format. Use lat,lng'
        });
      }
      const [lat, lng] = coords.map(Number);
      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return res.status(400).json({
          success: false,
          message: 'Invalid coordinates'
        });
      }
      query['location.current'] = {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: 10000 // 10km radius
        }
      };
    }

    const experts = await Expert.find(query)
      .populate('user', 'name phone avatar')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ 'rating.average': -1 });

    const total = await Expert.countDocuments(query);

    res.json({
      success: true,
      experts,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get experts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get experts',
      error: error.message
    });
  }
});

// Get expert by ID
router.get('/:id', async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id)
      .populate('user', 'name phone avatar')
      .populate('services.certifications');

    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found'
      });
    }

    res.json({
      success: true,
      expert
    });
  } catch (error) {
    console.error('Get expert error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get expert',
      error: error.message
    });
  }
});

// Register as expert
router.post('/register', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Check if user is already an expert
    const existingExpert = await Expert.findOne({ user: userId });
    if (existingExpert) {
      return res.status(400).json({
        success: false,
        message: 'User is already registered as an expert'
      });
    }

    const expertData = {
      user: userId,
      ...req.body
    };

    const expert = new Expert(expertData);
    await expert.save();

    res.status(201).json({
      success: true,
      message: 'Expert registration submitted successfully',
      expert
    });
  } catch (error) {
    console.error('Expert registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register as expert',
      error: error.message
    });
  }
});

// Get current user's expert profile
router.get('/me', auth, async (req, res) => {
  try {
    const expert = await Expert.findOne({ user: req.user._id })
      .populate('user', 'name phone avatar lastActive');

    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert profile not found'
      });
    }

    res.json({
      success: true,
      expert
    });
  } catch (error) {
    console.error('Get my expert profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get expert profile',
      error: error.message
    });
  }
});

// Update expert profile
router.put('/:id', auth, async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id);

    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found'
      });
    }

    // Check if user owns this expert profile
    if (expert.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update last active
    await User.findByIdAndUpdate(req.user._id, { lastActive: new Date() });

    Object.assign(expert, req.body);
    await expert.save();

    res.json({
      success: true,
      message: 'Expert profile updated successfully',
      expert
    });
  } catch (error) {
    console.error('Update expert error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update expert profile',
      error: error.message
    });
  }
});

// Update expert availability
router.put('/:id/availability', auth, async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id);
    
    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found'
      });
    }

    if (expert.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    expert.availability = { ...expert.availability, ...req.body };
    await expert.save();

    res.json({
      success: true,
      message: 'Availability updated successfully',
      availability: expert.availability
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update availability',
      error: error.message
    });
  }
});

// Update expert location
router.put('/:id/location', auth, async (req, res) => {
  try {
    const { lat, lng, address } = req.body;
    const expert = await Expert.findById(req.params.id);
    
    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found'
      });
    }

    if (expert.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await expert.updateLocation(lat, lng, address);

    res.json({
      success: true,
      message: 'Location updated successfully',
      location: expert.location.current
    });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update location',
      error: error.message
    });
  }
});

// Toggle expert online status
router.put('/:id/online-status', auth, async (req, res) => {
  try {
    const { isOnline } = req.body;
    const expert = await Expert.findById(req.params.id);
    
    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found'
      });
    }

    if (expert.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    expert.isOnline = isOnline;
    await expert.save();

    res.json({
      success: true,
      message: `Expert is now ${isOnline ? 'online' : 'offline'}`,
      isOnline: expert.isOnline
    });
  } catch (error) {
    console.error('Toggle online status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update online status',
      error: error.message
    });
  }
});

// Add service to expert
router.post('/:id/services', auth, async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id);

    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found'
      });
    }

    if (expert.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update last active
    await User.findByIdAndUpdate(req.user._id, { lastActive: new Date() });

    expert.services.push(req.body);
    await expert.save();

    res.status(201).json({
      success: true,
      message: 'Service added successfully',
      service: expert.services[expert.services.length - 1]
    });
  } catch (error) {
    console.error('Add service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add service',
      error: error.message
    });
  }
});

// Update service
router.put('/:id/services/:serviceId', auth, async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id);

    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found'
      });
    }

    if (expert.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const serviceIndex = expert.services.findIndex(
      service => service._id.toString() === req.params.serviceId
    );

    if (serviceIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Update last active
    await User.findByIdAndUpdate(req.user._id, { lastActive: new Date() });

    Object.assign(expert.services[serviceIndex], req.body);
    await expert.save();

    res.json({
      success: true,
      message: 'Service updated successfully',
      service: expert.services[serviceIndex]
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service',
      error: error.message
    });
  }
});

// Delete service
router.delete('/:id/services/:serviceId', auth, async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id);

    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found'
      });
    }

    if (expert.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const serviceIndex = expert.services.findIndex(
      service => service._id.toString() === req.params.serviceId
    );

    if (serviceIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Update last active
    await User.findByIdAndUpdate(req.user._id, { lastActive: new Date() });

    expert.services.splice(serviceIndex, 1);
    await expert.save();

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete service',
      error: error.message
    });
  }
});

// Expert login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is an expert
    const expert = await Expert.findOne({ user: user._id });
    if (!expert) {
      return res.status(400).json({
        success: false,
        message: 'User is not registered as an expert'
      });
    }

    // Update last login and last active
    user.lastLogin = new Date();
    user.lastActive = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: 'expert' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      success: true,
      message: 'Expert login successful',
      token,
      user: user.getProfile(),
      expert: expert
    });
  } catch (error) {
    console.error('Expert login error:', error);
    res.status(500).json({
      success: false,
      message: 'Expert login failed',
      error: error.message
    });
  }
});

module.exports = router;




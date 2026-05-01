const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Generate Agora token for video call
router.post('/generate-token', auth, async (req, res) => {
  try {
    const { channelName, uid } = req.body;
    
    // In a real implementation, you would generate Agora token here
    // For now, we'll return a mock token
    const token = `mock_token_${Date.now()}`;
    
    res.json({
      success: true,
      token,
      appId: process.env.AGORA_APP_ID,
      channelName,
      uid
    });
  } catch (error) {
    console.error('Generate token error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate token',
      error: error.message
    });
  }
});

// Start video call
router.post('/start-call', auth, async (req, res) => {
  try {
    const { bookingId, expertId } = req.body;
    
    // Emit video call request via Socket.IO
    const { io } = require('../server');
    io.to(expertId).emit('incoming-video-call', {
      bookingId,
      userId: req.user._id,
      userName: req.user.name
    });
    
    res.json({
      success: true,
      message: 'Video call request sent'
    });
  } catch (error) {
    console.error('Start video call error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start video call',
      error: error.message
    });
  }
});

module.exports = router;




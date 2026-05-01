const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Process voice command
router.post('/process-command', auth, async (req, res) => {
  try {
    const { audioData, language = 'en' } = req.body;
    
    // Mock voice processing - in real implementation, use speech-to-text
    const mockResponse = {
      text: 'I need a plumber for tomorrow morning',
      intent: 'book_service',
      entities: {
        service: 'plumber',
        time: 'tomorrow morning',
        urgency: 'medium'
      }
    };
    
    res.json({
      success: true,
      result: mockResponse
    });
  } catch (error) {
    console.error('Process voice command error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process voice command',
      error: error.message
    });
  }
});

module.exports = router;




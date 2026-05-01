const express = require('express');
const router = express.Router();
const AIService = require('../services/aiService');
const auth = require('../middleware/auth');

// AI-powered service matching
router.post('/match-expert', auth, async (req, res) => {
  try {
    const { problem, location, urgency } = req.body;
    
    if (!problem || !location) {
      return res.status(400).json({
        success: false,
        message: 'Problem description and location are required'
      });
    }

    const result = await AIService.matchExpert(problem, location, urgency);
    res.json(result);
  } catch (error) {
    console.error('AI matching error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to match experts',
      error: error.message
    });
  }
});

// Chatbot endpoint
router.post('/chatbot', auth, async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const result = await AIService.generateChatbotResponse(message, context);
    res.json(result);
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process message',
      error: error.message
    });
  }
});

// Voice search processing
router.post('/voice-search', auth, async (req, res) => {
  try {
    const { audioData, language } = req.body;
    
    if (!audioData) {
      return res.status(400).json({
        success: false,
        message: 'Audio data is required'
      });
    }

    const result = await AIService.processVoiceSearch(audioData, language);
    res.json(result);
  } catch (error) {
    console.error('Voice search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process voice input',
      error: error.message
    });
  }
});

// Analyze problem description
router.post('/analyze-problem', auth, async (req, res) => {
  try {
    const { problem } = req.body;
    
    if (!problem) {
      return res.status(400).json({
        success: false,
        message: 'Problem description is required'
      });
    }

    const analysis = await AIService.analyzeProblem(problem);
    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Problem analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze problem',
      error: error.message
    });
  }
});

// Extract intent from text
router.post('/extract-intent', auth, async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text is required'
      });
    }

    const intent = await AIService.extractIntent(text);
    res.json({
      success: true,
      intent
    });
  } catch (error) {
    console.error('Intent extraction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to extract intent',
      error: error.message
    });
  }
});

module.exports = router;


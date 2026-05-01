const express = require('express');
const router = express.Router();
const GamificationService = require('../services/gamificationService');
const auth = require('../middleware/auth');

// Get expert's gamification profile
router.get('/profile/:expertId', auth, async (req, res) => {
  try {
    const { expertId } = req.params;
    
    const profile = await GamificationService.getExpertProfile(expertId);
    res.json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Get expert profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get expert profile',
      error: error.message
    });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const leaderboard = await GamificationService.getLeaderboard(parseInt(limit));
    res.json({
      success: true,
      leaderboard
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get leaderboard',
      error: error.message
    });
  }
});

// Process daily rewards (admin only)
router.post('/process-daily-rewards', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    await GamificationService.processDailyRewards();
    res.json({
      success: true,
      message: 'Daily rewards processed successfully'
    });
  } catch (error) {
    console.error('Process daily rewards error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process daily rewards',
      error: error.message
    });
  }
});

// Get expert's badges
router.get('/badges/:expertId', auth, async (req, res) => {
  try {
    const { expertId } = req.params;
    
    const profile = await GamificationService.getExpertProfile(expertId);
    res.json({
      success: true,
      badges: profile.badges
    });
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get badges',
      error: error.message
    });
  }
});

// Get expert's achievements
router.get('/achievements/:expertId', auth, async (req, res) => {
  try {
    const { expertId } = req.params;
    
    const profile = await GamificationService.getExpertProfile(expertId);
    res.json({
      success: true,
      achievements: profile.achievements
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get achievements',
      error: error.message
    });
  }
});

// Get expert's streaks
router.get('/streaks/:expertId', auth, async (req, res) => {
  try {
    const { expertId } = req.params;
    
    const profile = await GamificationService.getExpertProfile(expertId);
    res.json({
      success: true,
      streaks: profile.streaks
    });
  } catch (error) {
    console.error('Get streaks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get streaks',
      error: error.message
    });
  }
});

module.exports = router;




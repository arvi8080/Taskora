const express = require('express');
const router = express.Router();
const Expert = require('../models/Expert');
const CommunityPost = require('../models/CommunityPost');
const CommunityComment = require('../models/CommunityComment');
const auth = require('../middleware/auth');

// Get community service opportunities
router.get('/opportunities', async (req, res) => {
  try {
    const { location, category, limit = 20 } = req.query;

    let aggregation = [
      {
        $match: {
          'communityService.isParticipating': true,
          isVerified: true
        }
      },
      {
        $addFields: {
          'communityService.availableHours': {
            $subtract: ['$communityService.freeHoursPerMonth', '$communityService.usedHours']
          }
        }
      },
      {
        $match: {
          'communityService.availableHours': { $gt: 0 }
        }
      }
    ];

    // Add category filter if provided
    if (category) {
      aggregation.push({
        $match: {
          'services.category': category
        }
      });
    }

    // Add location filter if provided
    if (location) {
      const [lat, lng] = location.split(',').map(Number);
      aggregation.push({
        $match: {
          'location.current': {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [lng, lat]
              },
              $maxDistance: 10000 // 10km radius
            }
          }
        }
      });
    }

    aggregation.push(
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: 1,
          services: 1,
          rating: 1,
          location: 1,
          communityService: 1,
          'user.name': 1,
          'user.phone': 1,
          'user.avatar': 1
        }
      },
      {
        $limit: parseInt(limit) || 20
      }
    );

    const experts = await Expert.aggregate(aggregation);

    res.json({
      success: true,
      opportunities: experts.map(expert => ({
        expertId: expert._id,
        name: expert.user.name,
        phone: expert.user.phone,
        avatar: expert.user.avatar,
        services: expert.services,
        rating: expert.rating.average,
        availableHours: expert.communityService.freeHoursPerMonth - expert.communityService.usedHours,
        location: expert.location.current
      }))
    });
  } catch (error) {
    console.error('Get community opportunities error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get community opportunities',
      error: error.message
    });
  }
});

// Join community service program
router.post('/join', auth, async (req, res) => {
  try {
    const { freeHoursPerMonth } = req.body;
    const expertId = req.user.expertId;

    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found'
      });
    }

    expert.communityService = {
      isParticipating: true,
      freeHoursPerMonth: freeHoursPerMonth || 5,
      usedHours: 0
    };

    await expert.save();

    res.json({
      success: true,
      message: 'Joined community service program successfully',
      communityService: expert.communityService
    });
  } catch (error) {
    console.error('Join community service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to join community service program',
      error: error.message
    });
  }
});

// Leave community service program
router.post('/leave', auth, async (req, res) => {
  try {
    const expertId = req.user.expertId;

    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found'
      });
    }

    expert.communityService.isParticipating = false;
    await expert.save();

    res.json({
      success: true,
      message: 'Left community service program successfully'
    });
  } catch (error) {
    console.error('Leave community service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to leave community service program',
      error: error.message
    });
  }
});

// Community Posts Routes

// Get all posts
router.get('/posts', async (req, res) => {
  try {
    const { page = 1, limit = 10, user } = req.query;

    let query = { isActive: true };
    if (user) {
      query.user = user;
    }

    const posts = await CommunityPost.find(query)
      .populate('user', 'name avatar')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'name avatar' },
        options: { sort: { createdAt: 1 } }
      })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await CommunityPost.countDocuments(query);

    res.json({
      success: true,
      posts,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get posts',
      error: error.message
    });
  }
});

// Create a new post
router.post('/posts', auth, async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = new CommunityPost({
      user: req.user._id,
      title,
      content
    });

    await post.save();

    await post.populate('user', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create post',
      error: error.message
    });
  }
});

// Get a single post
router.get('/posts/:id', async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id)
      .populate('user', 'name avatar')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'name avatar' },
        options: { sort: { createdAt: 1 } }
      });

    if (!post || !post.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.json({
      success: true,
      post
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get post',
      error: error.message
    });
  }
});

// Update a post
router.put('/posts/:id', auth, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { title, content } = req.body;
    post.title = title || post.title;
    post.content = content || post.content;

    await post.save();
    await post.populate('user', 'name avatar');

    res.json({
      success: true,
      message: 'Post updated successfully',
      post
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update post',
      error: error.message
    });
  }
});

// Delete a post
router.delete('/posts/:id', auth, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Soft delete
    post.isActive = false;
    await post.save();

    // Also soft delete comments
    await CommunityComment.updateMany({ post: req.params.id }, { isActive: false });

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete post',
      error: error.message
    });
  }
});

// Add a comment to a post
router.post('/posts/:postId/comments', auth, async (req, res) => {
  try {
    const { content, parentComment } = req.body;

    const post = await CommunityPost.findById(req.params.postId);
    if (!post || !post.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const comment = new CommunityComment({
      user: req.user._id,
      post: req.params.postId,
      content,
      parentComment: parentComment || null
    });

    await comment.save();

    // Add to post's comments array
    post.comments.push(comment._id);
    await post.save();

    // If it's a reply, add to parent comment's replies
    if (parentComment) {
      const parent = await CommunityComment.findById(parentComment);
      if (parent) {
        parent.replies.push(comment._id);
        await parent.save();
      }
    }

    await comment.populate('user', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add comment',
      error: error.message
    });
  }
});

module.exports = router;




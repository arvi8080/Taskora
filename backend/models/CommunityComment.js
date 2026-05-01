const mongoose = require('mongoose');

const communityCommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunityPost',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxLength: 1000
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunityComment',
    default: null
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunityComment'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
communityCommentSchema.index({ post: 1, createdAt: 1 });
communityCommentSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('CommunityComment', communityCommentSchema);

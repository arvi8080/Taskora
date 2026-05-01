import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { communityAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const Community = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [commenting, setCommenting] = useState(null);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await communityAPI.getPosts();
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load community posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setCreating(true);
    try {
      const response = await communityAPI.createPost(newPost);
      setPosts([response.data.post, ...posts]);
      setNewPost({ title: '', content: '' });
      toast.success('Post created successfully');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setCreating(false);
    }
  };

  const handleAddComment = async (postId) => {
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      const response = await communityAPI.addComment(postId, { content: newComment });
      // Update the post's comments
      setPosts(posts.map(post =>
        post._id === postId
          ? { ...post, comments: [...post.comments, response.data.comment] }
          : post
      ));
      setNewComment('');
      setCommenting(null);
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading community...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Community Forum
            </h1>
            <button
              onClick={() => window.location.href = '/community/opportunities'}
              className="btn-secondary"
            >
              Community Service
            </button>
          </div>

          {/* Create Post Form */}
          {user && (
            <div className="bg-white rounded-2xl p-6 shadow-soft mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Share Your Thoughts
              </h2>
              <form onSubmit={handleCreatePost}>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Post title..."
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="mb-4">
                  <textarea
                    placeholder="What's on your mind?"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={creating}
                  className="btn-primary disabled:opacity-50"
                >
                  {creating ? 'Posting...' : 'Post'}
                </button>
              </form>
            </div>
          )}

          {/* Posts Feed */}
          <div className="space-y-6">
            {posts.length > 0 ? (
              posts.map((post) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-soft"
                >
                  <div className="flex items-start space-x-3 mb-4">
                    <img
                      src={post.user.avatar || '/default-avatar.png'}
                      alt={post.user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                      <p className="text-sm text-gray-500">
                        {post.user.name} • {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>

                  {/* Comments Section */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-500">
                        {post.comments?.length || 0} comments
                      </span>
                      {user && (
                        <button
                          onClick={() => setCommenting(commenting === post._id ? null : post._id)}
                          className="text-sm text-primary-600 hover:text-primary-700"
                        >
                          {commenting === post._id ? 'Cancel' : 'Add Comment'}
                        </button>
                      )}
                    </div>

                    {/* Comments List */}
                    {post.comments?.length > 0 && (
                      <div className="space-y-3 mb-4">
                        {post.comments.slice(0, 3).map((comment) => (
                          <div key={comment._id} className="flex items-start space-x-3 bg-gray-50 p-3 rounded-lg">
                            <img
                              src={comment.user.avatar || '/default-avatar.png'}
                              alt={comment.user.name}
                              className="w-8 h-8 rounded-full"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{comment.user.name}</p>
                              <p className="text-sm text-gray-700">{comment.content}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                        {post.comments.length > 3 && (
                          <p className="text-sm text-gray-500 text-center">
                            And {post.comments.length - 3} more comments...
                          </p>
                        )}
                      </div>
                    )}

                    {/* Add Comment Form */}
                    {commenting === post._id && (
                      <div className="flex space-x-3">
                        <img
                          src={user.avatar || '/default-avatar.png'}
                          alt={user.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                          <textarea
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                          />
                          <div className="flex justify-end space-x-2 mt-2">
                            <button
                              onClick={() => setCommenting(null)}
                              className="text-sm text-gray-500 hover:text-gray-700"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleAddComment(post._id)}
                              className="text-sm bg-primary-600 text-white px-3 py-1 rounded-lg hover:bg-primary-700"
                            >
                              Comment
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="bg-white rounded-2xl p-8 shadow-soft text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No posts yet
                </h3>
                <p className="text-gray-600">
                  Be the first to share something with the community!
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Community;




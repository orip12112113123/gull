import React, { useEffect, useState } from 'react';
import { getFeed, createPost } from '../services/api';
import { Post } from '../types';
import { useAuth } from '../context/AuthContext';

const Feed: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      const response = await getFeed();
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to load feed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      await createPost({ type: 'TEXT', content: newPost });
      setNewPost('');
      loadFeed();
    } catch (error) {
      console.error('Failed to create post', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleCreatePost} className="space-y-4">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share your athletic journey..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-none"
            rows={3}
          />
          <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-lg">
            Post
          </button>
        </form>
      </div>

      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
              {post.user.profile.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{post.user.profile.name}</h3>
              <p className="text-sm text-gray-500">{post.user.profile.type}</p>
            </div>
          </div>
          {post.content && <p className="text-gray-800">{post.content}</p>}
          <div className="flex items-center gap-6 pt-2 border-t text-gray-600">
            <span>❤️ {post.likes.length}</span>
            <span>💬 {post.comments.length}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;

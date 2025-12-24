#!/bin/bash

# Feed.tsx
cat > pages/Feed.tsx <<'EOF'
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
EOF

# Profile.tsx
cat > pages/Profile.tsx <<'EOF'
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProfile, updateProfile } from '../services/api';
import { Profile as ProfileType } from '../types';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    location: '',
    sport: '',
    position: '',
  });

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    try {
      const response = await getProfile(id!);
      setProfile(response.data);
      setFormData({
        bio: response.data.bio || '',
        location: response.data.location || '',
        sport: response.data.sport || '',
        position: response.data.position || '',
      });
    } catch (error) {
      console.error('Failed to load profile', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateProfile(formData);
      loadProfile();
      setEditing(false);
    } catch (error) {
      console.error('Failed to update profile', error);
    }
  };

  if (loading || !profile) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const isOwnProfile = user?.profile.id === profile.id;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-primary-600 to-primary-800"></div>
        <div className="p-6">
          <div className="flex justify-between items-start -mt-20 mb-4">
            <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
              <div className="w-full h-full rounded-full bg-primary-600 flex items-center justify-center text-white text-4xl font-bold">
                {profile.name.charAt(0)}
              </div>
            </div>
            {isOwnProfile && (
              <button
                onClick={() => setEditing(!editing)}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
          <p className="text-gray-600">{profile.type}</p>

          {editing ? (
            <div className="mt-6 space-y-4">
              <input
                type="text"
                placeholder="Bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Sport"
                value={formData.sport}
                onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <button
                onClick={handleUpdate}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-2">
              {profile.bio && <p className="text-gray-700">{profile.bio}</p>}
              {profile.location && <p className="text-gray-600">📍 {profile.location}</p>}
              {profile.sport && <p className="text-gray-600">⚽ {profile.sport}</p>}
              {profile.position && <p className="text-gray-600">🎯 {profile.position}</p>}
            </div>
          )}

          {profile.skills && profile.skills.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Skills</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.skills.map((skill) => (
                  <div key={skill.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{skill.name}</h3>
                      <span className="text-primary-600 font-bold">{skill.level}/10</span>
                    </div>
                    {skill.description && <p className="text-sm text-gray-600">{skill.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
EOF

# Explore.tsx
cat > pages/Explore.tsx <<'EOF'
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { exploreProfiles } from '../services/api';
import { Profile } from '../types';

const Explore: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const response = await exploreProfiles();
      setProfiles(response.data);
    } catch (error) {
      console.error('Failed to load profiles', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Discover Athletes & Teams</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <Link
            key={profile.id}
            to={`/profile/${profile.id}`}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center text-white text-2xl font-bold">
                {profile.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">{profile.name}</h3>
                <p className="text-sm text-gray-600">{profile.type}</p>
              </div>
            </div>
            {profile.bio && <p className="text-gray-700 line-clamp-2 mb-2">{profile.bio}</p>}
            {profile.sport && (
              <span className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">
                {profile.sport}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Explore;
EOF

# Navbar.tsx
cat > components/Navbar.tsx <<'EOF'
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/feed" className="text-2xl font-bold text-primary-600">
            Gull
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/feed" className="text-gray-700 hover:text-primary-600 font-medium">
              Feed
            </Link>
            <Link to="/explore" className="text-gray-700 hover:text-primary-600 font-medium">
              Explore
            </Link>
            <Link
              to={`/profile/${user.profile.id}`}
              className="text-gray-700 hover:text-primary-600 font-medium"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
EOF

# App.tsx
cat > App.tsx <<'EOF'
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Explore from './pages/Explore';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/feed"
              element={
                <PrivateRoute>
                  <Feed />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/:id"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/explore"
              element={
                <PrivateRoute>
                  <Explore />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/feed" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
EOF

# main.tsx
cat > main.tsx <<'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

echo "All components created successfully!"

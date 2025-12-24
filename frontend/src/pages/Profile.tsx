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

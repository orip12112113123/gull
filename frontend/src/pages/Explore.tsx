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

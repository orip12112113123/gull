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

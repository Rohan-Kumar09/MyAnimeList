import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {

  const { user, isLoggedIn, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="bg-gray-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-bold hover:text-gray-200">
          MyAnimeList
        </Link>
        <div className="space-x-6 relative">
          <Link to="/" className="text-gray-300 hover:text-white transition-colors">
            Home
          </Link>
          <Link to="/saved" className="text-gray-300 hover:text-white transition-colors">
            Saved
          </Link>
          {isLoggedIn && (
            <div className="inline-block relative">
              <button
                className="text-gray-300 hover:text-white transition-colors focus:outline-none"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                {user.username}
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded shadow-lg z-10">
                  <button
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => { logout(); setShowDropdown(false); }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
          {!isLoggedIn && (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                Login
              </Link>
              <Link to="/register" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
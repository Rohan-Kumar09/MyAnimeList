import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {

  const { user, isLoggedIn } = useAuth();

  return (
    <nav className="bg-gray-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-bold hover:text-gray-200">
          MyAnimeList
        </Link>
        <div className="space-x-6">
          <Link to="/" className="text-gray-300 hover:text-white transition-colors">
            Home
          </Link>
          <Link to="/saved" className="text-gray-300 hover:text-white transition-colors">
            Saved
          </Link>
          {isLoggedIn && (
            <Link to="/profile" className="text-gray-300 hover:text-white transition-colors">
              {user.username}
            </Link>
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
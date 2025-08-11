import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Saved from "./components/Saved";
import Settings from "./components/Settings";
import { useAuth } from "./context/AuthContext";
import { deleteUserAccount } from './api/UserMethods';

function App() {
  const { user, token, logout } = useAuth();
  const handleDeleteAccount = async () => {
    if (!user || !user.id || !token) {
      alert("No user is logged in.");
      return;
    }
    try {
      await deleteUserAccount(user.id, token);
      alert("Account deleted successfully.");
      logout();
    } catch (error) {
      alert("Failed to delete account.");
    }
  };
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/settings" element={<Settings onDeleteAccount={handleDeleteAccount} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
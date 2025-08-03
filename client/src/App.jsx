import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Browse from "./components/Browse";
import { useTokenRefresh } from "./hooks/useTokenRefresh";
import { useState } from 'react';
import Saved from "./components/Saved";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useTokenRefresh(token, newToken => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  });

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/saved" element={<Saved />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App

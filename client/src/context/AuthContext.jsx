import { createContext, useContext, useState } from "react";
import { useTokenRefresh } from "../hooks/useTokenRefresh";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  // { id: "123", username: "testuser", email: "test@example.com" }
  const [user, setUser] = useState(null);

  // Automatically refresh token
  useTokenRefresh(token, (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  });

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("token", jwtToken);
  };
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ token, setToken, user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
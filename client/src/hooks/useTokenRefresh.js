import { useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";

// for refresh endpoint
const database = import.meta.env.VITE_DATABASE;

export function useTokenRefresh(token, setToken) {
  const timerRef = useRef();

  useEffect(() => {
    if (!token) return;

    const decoded = jwtDecode(token);
    const exp = decoded.exp * 1000; // ms
    const now = Date.now();
    // Refresh 2 minutes before expiry
    const refreshTime = exp - now - 2 * 60 * 1000;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      fetch(`${database}refresh`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          return res.json();
        })
        .then(data => {
          if (data.token) setToken(data.token);
        })
        .catch(err => {
          console.error("Token refresh error:", err);
        });
    }, Math.max(refreshTime, 0));

    return () => clearTimeout(timerRef.current);
  }, [token, setToken]);
}
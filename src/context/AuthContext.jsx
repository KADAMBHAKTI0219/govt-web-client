import React, { createContext, useState, useEffect, useContext } from "react";
import { registerAPI, loginAPI, logoutAPI, fetchProfileAPI } from "../services/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Fetch and verify profile on load
  const loadProfile = async (accessToken) => {
    try {
      const data = await fetchProfileAPI(accessToken);
      if (data.success) {
        setUser(data.data.user);
      } else {
        clearAuth();
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  const clearAuth = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // Sync token and load user profile on mount
  useEffect(() => {
    if (token) {
      loadProfile(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    try {
      const data = await loginAPI(email, password);
      if (data.success) {
        localStorage.setItem("token", data.data.accessToken);
        setToken(data.data.accessToken);
        setUser(data.data.user);
        return { success: true };
      }
      return { success: false, message: data.message || "Login failed" };
    } catch (err) {
      return { success: false, message: "Network connection error" };
    }
  };

  // Register handler
  const register = async (name, email, password, confirmPassword) => {
    try {
      const data = await registerAPI(name, email, password, confirmPassword);
      if (data.success) {
        return { success: true };
      }
      return { success: false, message: data.message || "Registration failed" };
    } catch (err) {
      return { success: false, message: "Network connection error" };
    }
  };

  // Google OAuth Login Complete handler
  const loginWithToken = (accessToken) => {
    localStorage.setItem("token", accessToken);
    setToken(accessToken);
  };

  // Logout handler
  const logout = async () => {
    if (token) {
      try {
        await logoutAPI(token);
      } catch (err) {
        console.error("Logout request error:", err);
      }
    }
    clearAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        loginWithToken,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

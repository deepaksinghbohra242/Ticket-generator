import React, { createContext, useContext , useEffect ,useState } from "react";
import { authAPI } from "../api/authAPI";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState("user");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        const userData = await authAPI.getUserData(token);
        setUser(userData);
      }
    } catch (err) {
      console.error("Failed to check auth status:", err);
      localStorage.removeItem("authToken");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.login(email, password);

      if (response.token) {
        localStorage.setItem("authToken", response.token);
        setUser(response.user);
        return { success: true, user: response.user };
      }

      throw new Error("Invalid Login response");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
    finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }finally {
      localStorage.removeItem("authToken");
      setUser(null);
      setError(null)
    }
  }

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthonticated: !!user,
    isAdmin: user?.role === "admin",
    clearError: () => setError(null),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

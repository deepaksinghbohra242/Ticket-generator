import React, { createContext, useContext, useEffect, useState } from "react";
import { authAPI } from "../api/authAPI";
import { ticketAPI } from "../api/ticketAPI";
import { adminAPI } from "../api/adminAPI";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState([]);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    checkAuthStatus();
    fetchSubjects();
    fetchDepartments();
  }, []);

  const normalizeUser = (userData) => {
    const normalizedRole =
      userData.role === "SUPER_ADMIN"
        ? "superadmin"
        : userData.role === "ADMIN"
        ? "admin"
        : "user";

    return {
      ...userData,
      role: normalizedRole,
      department: userData.department || null, 
    };
  };

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (parseError) {
          if (token) {
            const userData = await authAPI.getUserData();
            const normalizedUser = normalizeUser(userData);
            setUser(normalizedUser);
            localStorage.setItem("user", JSON.stringify(normalizedUser));
          }
        }
      } else if (token) {
        const userData = await authAPI.getUserData();
        const normalizedUser = normalizeUser(userData);
        setUser(normalizedUser);
        localStorage.setItem("user", JSON.stringify(normalizedUser));
      }
    } catch (err) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.login(email, password);

      if (response.token && response.role) {
        localStorage.setItem("authToken", response.token);

        const userData = await authAPI.getUserData();
        const normalizedUser = normalizeUser(userData);

        localStorage.setItem("user", JSON.stringify(normalizedUser));
        setUser(normalizedUser);

        return { success: true, user: normalizedUser };
      }

      throw new Error("Invalid Login response");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      setUser(null);
      setError(null);
      window.location.href = "/login";
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await ticketAPI.getSubjects();
      setSubject(response.data);
      return response.data;
    } catch (error) {
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await adminAPI.getDepartments();
      const deptList = Array.isArray(response) ? response : response.data;
      setDepartments(deptList);
      return deptList;
    } catch (error) {
      setDepartments([]);
      return [];
    }
  };

  const value = {
    user,
    loading,
    departments,
    subject,
    error,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin" || user?.role === "superadmin",
    isDepartmentAdmin: user?.role === "admin",
    isUser: user?.role === "user",
    isSuperAdmin: user?.role === "superadmin",
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export default AuthContext;

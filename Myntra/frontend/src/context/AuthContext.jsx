import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load profile when the application starts if token is in localStorage
  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get('/auth/profile');
      if (data.success) {
        setUser(data.data);
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error('Error loading user profile:', error.message);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // Login handler
  const login = async (emailOrPhone, password) => {
    try {
      const { data } = await api.post('/auth/login', { emailOrPhone, password });
      if (data.success) {
        localStorage.setItem('token', data.data.token);
        setUser({
          _id: data.data._id,
          name: data.data.name,
          email: data.data.email,
          phone: data.data.phone,
          role: data.data.role,
        });
        return { success: true };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, message: errorMessage };
    }
  };

  // Register handler
  const register = async (name, email, phone, password) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, phone, password });
      if (data.success) {
        localStorage.setItem('token', data.data.token);
        setUser({
          _id: data.data._id,
          name: data.data.name,
          email: data.data.email,
          phone: data.data.phone,
          role: data.data.role,
        });
        return { success: true };
      }
      return { success: false, message: data.message || 'Registration failed' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please check your details.';
      return { success: false, message: errorMessage };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

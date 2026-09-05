import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('chat_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('chat_token') || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync token and user in localStorage
  useEffect(() => {
    const handleAuthLogout = () => {
      logout();
    };
    window.addEventListener('auth:logout', handleAuthLogout);
    return () => window.removeEventListener('auth:logout', handleAuthLogout);
  }, []);

  const login = async (usernameOrEmail, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.post('/auth/login', {
        usernameOrEmail,
        password,
      });

      const { token: jwtToken, ...userData } = response.data;
      localStorage.setItem('chat_token', jwtToken);
      localStorage.setItem('chat_user', JSON.stringify(userData));

      setToken(jwtToken);
      setCurrentUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      let msg = 'Invalid username/password or user does not exist.';
      if (!err.response) {
        msg = 'Cannot connect to Spring Boot backend at http://localhost:8080. Please ensure the backend is running.';
      } else if (err.response.data?.message) {
        msg = err.response.data.message;
      } else if (err.response.data?.error) {
        msg = err.response.data.error;
      }
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password, avatarUrl) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.post('/auth/register', {
        username,
        email,
        password,
        avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
      });

      const { token: jwtToken, ...userData } = response.data;
      localStorage.setItem('chat_token', jwtToken);
      localStorage.setItem('chat_user', JSON.stringify(userData));

      setToken(jwtToken);
      setCurrentUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      let msg = 'Registration failed. Please verify your details.';
      if (!err.response) {
        msg = 'Cannot connect to Spring Boot backend at http://localhost:8080. Please ensure the backend is running.';
      } else if (err.response.data?.details?.password) {
        msg = err.response.data.details.password;
      } else if (err.response.data?.details?.username) {
        msg = err.response.data.details.username;
      } else if (err.response.data?.details?.email) {
        msg = err.response.data.details.email;
      } else if (err.response.data?.message) {
        msg = err.response.data.message;
      } else if (err.response.data?.error) {
        msg = err.response.data.error;
      }
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await axiosClient.post('/auth/logout');
      }
    } catch (err) {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('chat_token');
      localStorage.removeItem('chat_user');
      setToken(null);
      setCurrentUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        isAuthenticated: !!token && !!currentUser,
        loading,
        error,
        login,
        register,
        logout,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

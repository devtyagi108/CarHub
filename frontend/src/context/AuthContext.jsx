import React, { createContext, useState, useEffect } from 'react';
import * as api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.setAuthToken(token);
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const data = await api.getCurrentUser();
      setUser(data);
    } catch (error) {
      localStorage.removeItem('token');
      api.setAuthToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const data = await api.login(email, password);
    localStorage.setItem('token', data.token);
    api.setAuthToken(data.token);
    setUser(data);
    return data;
  };

  const signup = async (name, email, password, role) => {
    try {
      const data = await api.signup(name, email, password, role);
      console.log('Signup response:', data);
      
      if (data && data.token) {
        localStorage.setItem('token', data.token);
        api.setAuthToken(data.token);
        setUser({
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
        });
        return data;
      } else {
        throw new Error('No token received from server');
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    api.setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};


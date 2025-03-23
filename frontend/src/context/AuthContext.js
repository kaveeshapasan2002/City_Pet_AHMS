// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { isAuthenticated, getCurrentUser, logout,login as loginApi } from '../api/auth';




const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [error, setError] = useState(null);



  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = () => {
    setLoading(true);
    if (isAuthenticated()) {
      setUser(getCurrentUser());
      setIsAuth(true);
    } else {
      setUser(null);
      setIsAuth(false);
    }
    setLoading(false);
  };

  const logoutUser = () => {
    logout();
    setUser(null);
    setIsAuth(false);
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await loginApi(credentials);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
      setIsAuth(true);
      setError(null);
      
      return response;
    } catch (error) {
      // Handle account locked message specially
      if (error.response?.status === 403 && error.response?.data?.message?.includes('Account locked')) {
        setError(error.response.data.message);
      } else {
        setError(error.response?.data?.message || 'Failed to login');
      }
      
      setUser(null);
      setIsAuth(false);
      throw error;
    } finally {
      setLoading(false);

    }
  };















  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth,
        loading,
        setUser,
        setIsAuth,
        logoutUser,
        checkUserLoggedIn,
         login
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { isAuthenticated, getCurrentUser, logout } from '../api/auth';




const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
// src/api/auth.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Register user
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Server error' };
  }
};

// Verify OTP
export const verifyOtp = async (verificationData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/verify-otp`, verificationData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Server error' };
  }
};

// Login user
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Server error' };
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return localStorage.getItem('token') ? true : false;
};

// Get user info
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

// Update user profile
export const updateProfile = async (profileData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw { message: 'Authentication required' };
      }
  
      const response = await axios.put(`${API_URL}/auth/edit-profile`, profileData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Update local storage with new user data
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  };
  
  // Change user password
  export const changePassword = async (passwordData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw { message: 'Authentication required' };
      }
  
      const response = await axios.put(`${API_URL}/auth/change-password`, passwordData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to change password' };
    }
  };


  //today
  // Add these functions to your existing src/api/auth.js file

// Request password reset
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Server error' };
  }
};

// Verify password reset OTP
export const verifyResetOtp = async (verificationData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/verify-reset-otp`, verificationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Server error' };
  }
};

// Reset password with token
export const resetPassword = async (resetData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/reset-password`, resetData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Server error' };
  }
};
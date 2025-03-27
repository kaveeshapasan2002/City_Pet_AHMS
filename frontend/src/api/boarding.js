//Create API service for boarding

// src/api/boarding.js
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/boarding';

// Create a new boarding booking
export const createBooking = async (bookingData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw { message: 'Authentication required' };
    }

    const response = await axios.post(API_URL, bookingData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create booking' };
  }
};

// Get all bookings for the logged in user
export const getUserBookings = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw { message: 'Authentication required' };
    }

    const response = await axios.get(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch bookings' };
  }
};

// Cancel a booking
export const cancelBooking = async (bookingId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw { message: 'Authentication required' };
    }

    const response = await axios.delete(`${API_URL}/${bookingId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to cancel booking' };
  }
};


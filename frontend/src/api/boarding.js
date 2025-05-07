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

//Update a booking
export const updateBooking = async (bookingId, updateData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw { message: 'Authentication required' };
    } 

    ///////////////////////////
    // Calculate the price before sending to server
    const checkIn = new Date(updateData.checkInDate);
    const checkOut = new Date(updateData.checkOutDate);
    const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    const pricePerDay = {
      'Standard': 30,
      'Deluxe': 50,
      'Premium': 80
    };
    
    const servicesPrices = {
      'Grooming': 40,
      'Training': 50,
      'Special Diet': 20,
      'Health Check': 35,
      'Playtime': 15
    };
    
    let totalPrice = pricePerDay[updateData.boardingType] * days;
    
    if (updateData.additionalServices && servicesPrices[updateData.additionalServices]) {
      totalPrice += servicesPrices[updateData.additionalServices];
    }
    
    // Add the calculated price to the update data
    const dataWithPrice = {
      ...updateData,
      totalPrice
    };
    /////////////////////////
    const response = await axios.put(`${API_URL}/${bookingId}`, dataWithPrice, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update booking' };
  }
};

// Get a booking by ID
export const getBookingById = async (bookingId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw { message: 'Authentication required' };
    }
    const response = await axios.get(`${API_URL}/${bookingId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch booking details' };
  }
};


// Delete a booking permanently
export const deleteBooking = async (bookingId) => {
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
    console.error('Delete error:', error);
    throw error.response?.data || { message: 'Failed to delete booking' };
  }
};

///////////////////////////////////////////
// Get daily records for a booking
export const getDailyRecords = async (bookingId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw { message: 'Authentication required' };
    }
    
    const response = await axios.get(`http://localhost:5001/api/boarding/${bookingId}/records`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch daily records' };
  }
};
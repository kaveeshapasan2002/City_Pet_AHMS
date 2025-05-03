// src/api/admin.js
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/admin';


// Get all users with optional filtering
export const getUsers = async (filters = {}) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw { message: 'Authentication required' };
      }

      // Convert filters object to query string
    const queryString = Object.entries(filters)
    .filter(([_, value]) => value) // Remove empty values
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

    const response = await axios.get(`${API_URL}/users${queryString ? '?' + queryString : ''}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch users' };
    }
  };

  // Toggle user active status
export const toggleUserStatus = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw { message: 'Authentication required' };
      }
  
      const response = await axios.put(`${API_URL}/users/${userId}/toggle-status`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update user status' };
    }

};

// Add this function to your src/api/admin.js file

// Delete a user
export const deleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw { message: 'Authentication required' };
      }
  
      const response = await axios.delete(`${API_URL}/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete user' };
    }
  };


// Add this function to your src/api/admin.js file

// Add a new user (admin only)
export const addUser = async (userData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw { message: 'Authentication required' };
      }
  
      const response = await axios.post(`${API_URL}/users`, userData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create user' };
    }
  };


  // src/api/admin.js - Add these functions

// Change user role
export const changeUserRole = async (userId, role, reason) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw { message: 'Authentication required' };
      }
  
      const response = await axios.put(`${API_URL}/users/${userId}/role`, 
        { role, reason },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to change user role' };
    }
  };
  
  // Update user permissions
  export const updateUserPermissions = async (userId, permissions) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw { message: 'Authentication required' };
      }
  
      const response = await axios.put(`${API_URL}/users/${userId}/permissions`, 
        { permissions },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update permissions' };
    }
  };

 
// src/api/admin.js - Add these functions

// Get security logs
export const getSecurityLogs = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw { message: 'Authentication required' };
    }

    const response = await axios.get(`${API_URL}/security-logs`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch security logs' };
  }
};

// Unlock user account
export const unlockUserAccount = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw { message: 'Authentication required' };
    }

    const response = await axios.put(`${API_URL}/users/${userId}/unlock`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to unlock account' };
  }
};


// In src/api/admin.js - Add this function

// Get all bookings (admin only)
export const getBookings = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw { message: 'Authentication required' };
    }

    const response = await axios.get(`${API_URL}/bookings`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch bookings' };
  }
};











// In src/api/admin.js - Add this function

// Update booking status
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw { message: 'Authentication required' };
    }

    const response = await axios.put(`${API_URL}/bookings/${bookingId}/status`, 
      { status },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update booking status' };
  }
};
  


// In src/api/admin.js - Add this function

// Get user statistics by role
export const getUserStats = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw { message: 'Authentication required' };
    }

    const response = await axios.get(`${API_URL}/user-stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch user statistics' };
  }
};
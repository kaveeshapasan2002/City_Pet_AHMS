// src/api/messaging.js
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Get user's conversations
export const getConversations = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw { message: 'Authentication required' };
    }

    const response = await axios.get(`${API_URL}/conversations`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch conversations' };
  }
};

// Get a specific conversation
export const getConversation = async (conversationId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw { message: 'Authentication required' };
    }

    const response = await axios.get(`${API_URL}/conversations/${conversationId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch conversation' };
  }
};

// Create a new conversation
export const createConversation = async (receiverId, initialMessage) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw { message: 'Authentication required' };
    }

    const response = await axios.post(
      `${API_URL}/conversations`, 
      { receiverId, initialMessage },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create conversation' };
  }
};

// Archive a conversation
export const archiveConversation = async (conversationId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw { message: 'Authentication required' };
    }

    const response = await axios.put(
      `${API_URL}/conversations/${conversationId}/archive`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to archive conversation' };
  }
};

// Get messages from a conversation
export const getMessages = async (conversationId, page = 1, limit = 20) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw { message: 'Authentication required' };
    }

    const response = await axios.get(
      `${API_URL}/messages/${conversationId}?page=${page}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch messages' };
  }
};

// Send a new message
export const sendMessage = async (conversationId, content, attachments = []) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw { message: 'Authentication required' };
    }

    const response = await axios.post(
      `${API_URL}/messages`,
      { conversationId, content, attachments },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to send message' };
  }
};

// Get user's notifications
export const getNotifications = async (page = 1, limit = 20) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw { message: 'Authentication required' };
    }

    const response = await axios.get(
      `${API_URL}/notifications?page=${page}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch notifications' };
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw { message: 'Authentication required' };
    }

    const response = await axios.put(
      `${API_URL}/notifications/${notificationId}/read`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to mark notification as read' };
  }
};

// Get available veterinarians for messaging (for pet owners)
export const getAvailableVeterinarians = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw { message: 'Authentication required' };
    }

    // This endpoint would need to be implemented on the backend
    const response = await axios.get(
      `${API_URL}/users/veterinarians`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch veterinarians' };
  }
};

// Get pet owners (for veterinarians)
export const getPetOwners = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw { message: 'Authentication required' };
    }

    // This endpoint would need to be implemented on the backend
    const response = await axios.get(
      `${API_URL}/users/pet-owners`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch pet owners' };
  }
};

//create api

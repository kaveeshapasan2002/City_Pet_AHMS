// src/api/service.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
const API_URL = `${API_BASE_URL}/api`;

// Create axios instance with authorization header
const createAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
};

// Get all services
export const getAllServices = async () => {
  try {
    const response = await axios.get(`${API_URL}/services`, createAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Server error' };
  }
};

// Get service by ID
export const getServiceById = async (serviceId) => {
  try {
    const response = await axios.get(`${API_URL}/services/${serviceId}`, createAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Server error' };
  }
};

// Create new service
export const createService = async (serviceData) => {
  try {
    const response = await axios.post(`${API_URL}/services`, serviceData, createAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Server error' };
  }
};

// Update service
export const updateService = async (serviceId, serviceData) => {
  try {
    const response = await axios.put(`${API_URL}/services/${serviceId}`, serviceData, createAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Server error' };
  }
};

// Delete service (soft delete)
export const deleteService = async (serviceId) => {
  try {
    const response = await axios.delete(`${API_URL}/services/${serviceId}`, createAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Server error' };
  }
};
// src/api/invoice.js
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

// Get all invoices
export const  getAllInvoices = async () => {
  try {
    const response = await axios.get(`${API_URL}/invoices`, createAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Server error' };
  }
};

// Get single invoice by ID
export const getInvoiceById = async (invoiceId) => {
  try {
    const response = await axios.get(`${API_URL}/invoices/${invoiceId}`, createAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Server error' };
  }
};

// Create new invoice
export const createInvoice = async (invoiceData) => {
  try {
    const response = await axios.post(`${API_URL}/invoices`, invoiceData, createAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Server error' };
  }
};

// Update invoice
export const updateInvoice = async (invoiceId, invoiceData) => {
  try {
    const response = await axios.put(`${API_URL}/invoices/${invoiceId}`, invoiceData, createAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Server error' };
  }
};

// Record payment for invoice
export const recordPayment = async (invoiceId, paymentData) => {
  try {
    const response = await axios.post(
      `${API_URL}/invoices/${invoiceId}/payment`, 
      paymentData, 
      createAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Server error' };
  }
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

// Create a new service
export const createService = async (serviceData) => {
  try {
    const response = await axios.post(`${API_URL}/services`, serviceData, createAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Server error' };
  }
};

// Get all pets
export const getAllPets = async () => {
  try {
    const response = await axios.get(`${API_URL}/pets`, createAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Server error' };
  }
};
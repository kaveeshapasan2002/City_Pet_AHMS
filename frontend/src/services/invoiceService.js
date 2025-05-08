// src/services/invoiceService.js
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Create authentication header with JWT token
const createAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
};

// Fetch all invoices
export const getInvoices = async () => {
  try {
    const response = await axios.get(`${API_URL}/invoices`, createAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Server error' };
  }
};

// Fetch invoice by ID
export const getInvoiceById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/invoices/${id}`, createAuthHeader());
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
export const updateInvoice = async (id, invoiceData) => {
  try {
    const response = await axios.put(`${API_URL}/invoices/${id}`, invoiceData, createAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Server error' };
  }
};

// Record payment
export const recordPayment = async (id, paymentData) => {
  try {
    const response = await axios.post(`${API_URL}/invoices/${id}/payment`, paymentData, createAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Server error' };
  }
};

// Send invoice via email
export const sendInvoiceEmail = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/invoices/${id}/email`, {}, createAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Server error' };
  }
};

// Fetch client invoices
export const getClientInvoices = async (clientId) => {
  try {
    const response = await axios.get(`${API_URL}/invoices/client/${clientId}`, createAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Server error' };
  }
};

// Fetch pet invoices
export const getPetInvoices = async (petId) => {
  try {
    const response = await axios.get(`${API_URL}/invoices/pet/${petId}`, createAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Server error' };
  }
};
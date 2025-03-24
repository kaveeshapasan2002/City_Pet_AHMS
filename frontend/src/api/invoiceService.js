import axios from 'axios';

// Configure base URL - use environment variable or default
// const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_URL = `http://localhost:5000/api/invoices/`;

// Create a configured axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to handle token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Create new invoice
const createInvoice = async (invoiceData) => {
  try {
    const response = await axiosInstance.post('/', invoiceData);
    return response.data;
  } catch (error) {
    // Centralized error handling
    handleRequestError(error);
  }
};

// Get all invoices
const getInvoices = async (page = 1, status = 'all', search = '') => {
  try {
    const response = await axiosInstance.get('/', {
      params: { page, status, search }
    });
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

// Get invoice by ID
const getInvoiceById = async (invoiceId) => {
  try {
    const response = await axiosInstance.get(`/${invoiceId}`);
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

// Update invoice status (for payments)
const updateInvoiceStatus = async (invoiceId, statusData) => {
  try {
    const response = await axiosInstance.patch(`/${invoiceId}/status`, statusData);
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

// Delete invoice
const deleteInvoice = async (invoiceId) => {
  try {
    const response = await axiosInstance.delete(`/${invoiceId}`);
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

// Centralized error handling function
const handleRequestError = (error) => {
  // Log the error for debugging
  console.error('API Request Error:', error);

  // Handle specific error scenarios
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    switch (error.response.status) {
      case 400:
        throw new Error('Bad Request: Invalid data submitted');
      case 401:
        throw new Error('Unauthorized: Please log in again');
      case 403:
        throw new Error('Forbidden: You do not have permission');
      case 404:
        throw new Error('Not Found: The requested resource does not exist');
      case 500:
        throw new Error('Server Error: Please try again later');
      default:
        throw new Error(error.response.data.message || 'An unexpected error occurred');
    }
  } else if (error.request) {
    // The request was made but no response was received
    throw new Error('No response received from server. Please check your network connection.');
  } else {
    // Something happened in setting up the request that triggered an Error
    throw new Error('Error setting up the request. Please try again.');
  }
};

const invoiceService = {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoiceStatus,
  deleteInvoice,
};

export default invoiceService;
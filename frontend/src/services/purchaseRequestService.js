// frontend/src/services/purchaseRequestService.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
const API_URL = `${API_BASE_URL}/api/purchase-requests`;

// Create axios instance with auth
const createAxiosInstance = () => {
  const instance = axios.create();
  
  // Add auth token to every request
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  return instance;
};

const axiosInstance = createAxiosInstance();

// Create a new purchase request
const createPurchaseRequest = async (requestData) => {
  try {
    const response = await axiosInstance.post(API_URL, requestData);
    console.log('Created purchase request:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating purchase request:', error);
    throw error.response?.data?.message || 'Error creating purchase request';
  }
};

// Get purchase requests
const getPurchaseRequests = async (status) => {
  try {
    // Construct URL with status parameter
    const url = status ? `${API_URL}?status=${status}` : API_URL;
    console.log('Fetching purchase requests from URL:', url);
    
    const response = await axiosInstance.get(url);
    console.log('Received purchase requests:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching purchase requests:', error);
    throw error.response?.data?.message || 'Error fetching purchase requests';
  }
};

// Update purchase request status
const updatePurchaseRequestStatus = async (id, statusData) => {
  try {
    console.log(`Updating request ${id} status to:`, statusData);
    const response = await axiosInstance.patch(`${API_URL}/${id}`, statusData);
    console.log('Update response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating purchase request:', error);
    throw error.response?.data?.message || 'Error updating purchase request';
  }
};








// Delete purchase request
const deletePurchaseRequest = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting purchase request:', error);
    throw error.response?.data?.message || 'Error deleting purchase request';
  }
};

// Process payment for a purchase request
const processPurchasePayment = async (id, paymentDetails) => {
  try {
    console.log(`Processing payment for request ${id}:`, paymentDetails);
    const response = await axiosInstance.patch(`${API_URL}/payment/${id}`, paymentDetails);

    return response.data;
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error.response?.data?.message || 'Error processing payment';
  }
};

// Approve a purchase request
const approvePurchaseRequest = async (id) => {
  try {
    const response = await axiosInstance.patch(`${API_URL}/approve/${id}`);
    console.log(`Approved request ${id}:`, response.data);
    return response.data;
  } catch (error) {
    console.error('Error approving purchase request:', error);
    throw error.response?.data?.message || 'Error approving purchase request';
  }
};

const purchaseRequestService = {
  createPurchaseRequest,
  getPurchaseRequests,
  updatePurchaseRequestStatus,
  deletePurchaseRequest,
  processPurchasePayment,
  approvePurchaseRequest
};

export default purchaseRequestService;
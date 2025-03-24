// frontend/src/services/purchaseRequestService.js
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/purchase-requests';

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
export const createPurchaseRequest = async (requestData) => {
  try {
    const response = await axiosInstance.post(API_URL, requestData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error creating purchase request';
  }
};

// Get purchase requests
export const getPurchaseRequests = async (status) => {
  try {
    const url = status ? `${API_URL}?status=${status}` : API_URL;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error fetching purchase requests';
  }
};

// Update purchase request status
export const updatePurchaseRequestStatus = async (id, statusData) => {
  try {
    const response = await axiosInstance.patch(`${API_URL}/${id}`, statusData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error updating purchase request';
  }
};

// Delete purchase request
export const deletePurchaseRequest = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error deleting purchase request';
  }
};

const purchaseRequestService = {
  createPurchaseRequest,
  getPurchaseRequests,
  updatePurchaseRequestStatus,
  deletePurchaseRequest
};

export default purchaseRequestService;
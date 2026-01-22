// frontend/src/services/inventoryService.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
const API_URL = `${API_BASE_URL}/api/inventory`;

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

// Get all inventory items
export const getInventoryItems = async (page = 1, limit = 10, filters = {}) => {
  try {
    let url = `${API_URL}?page=${page}&limit=${limit}`;
    
    if (filters.category) {
      url += `&category=${filters.category}`;
    }
    
    if (filters.search) {
      url += `&search=${filters.search}`;
    }
    
    if (filters.lowStock) {
      url += `&lowStock=true`;
    }
    
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error fetching inventory items';
  }
};

// Get inventory item by ID
export const getInventoryItemById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error fetching inventory item';
  }
};

// Create new inventory item
export const createInventoryItem = async (itemData) => {
  try {
    const response = await axiosInstance.post(API_URL, itemData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error creating inventory item';
  }
};

// Update inventory item
export const updateInventoryItem = async (id, itemData) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, itemData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error updating inventory item';
  }
};

// Delete inventory item
export const deleteInventoryItem = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error deleting inventory item';
  }
};

// Get inventory statistics
export const getInventoryStats = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/stats`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error fetching inventory statistics';
  }
};

// Get low stock items
export const getLowStockItems = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/low-stock`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error fetching low stock items';
  }
};

// Process auto reorder for low stock items
export const processAutoReorder = async () => {
  try {
    const response = await axiosInstance.post(`${API_URL}/auto-reorder`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error processing auto reorder';
  }
};

const inventoryService = {
  getInventoryItems,
  getInventoryItemById,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getInventoryStats,
  getLowStockItems,
  processAutoReorder
};

export default inventoryService;
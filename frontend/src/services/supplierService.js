// frontend/src/services/supplierService.js
// Check if we're in development mode to enable verbose logging
const isDev = process.env.NODE_ENV === 'development';

// The correct API URL based on your backend code
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
const API_URL = `${API_BASE_URL}/api/suppliers`;

// Log API endpoint in development
if (isDev) {
  console.log('Supplier API endpoint:', API_URL);
}

// Create fetch wrapper with auth
const createFetchInstance = () => {
  const fetchWithAuth = async (url, options = {}) => {
    if (isDev) {
      console.log(`Fetching: ${url}`, options);
    }
    
    // Get the auth token
    const token = localStorage.getItem('token');
    
    // Set default headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    // Add auth token to headers if available
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    try {
      // Execute the fetch with auth headers
      const response = await fetch(url, {
        ...options,
        headers
      });
      
      if (isDev) {
        console.log(`Response status: ${response.status} ${response.statusText}`);
      }
      
      // Check if the response is ok (status in the range 200-299)
      if (!response.ok) {
        // Try to parse error response as JSON, fallback to empty object
        const errorData = await response.json().catch(() => ({}));
        
        // Create an error object that mimics axios error structure
        const error = new Error(errorData.message || `Error: ${response.status} ${response.statusText}`);
        error.response = {
          status: response.status,
          statusText: response.statusText,
          data: errorData
        };
        
        throw error;
      }
      
      // Parse the JSON response
      return response.json();
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        // This likely means the server is not running or not accessible
        console.error('Network error: Unable to connect to the server. Is it running?');
        const networkError = new Error('Network error: Unable to connect to the server');
        networkError.response = { data: { message: 'Server connection failed' } };
        throw networkError;
      }
      throw error;
    }
  };
  
  return fetchWithAuth;
};

const fetchWithAuth = createFetchInstance();

// Get all suppliers
export const getSuppliers = async (page = 1, limit = 10, filters = {}) => {
  try {
    let url = `${API_URL}?page=${page}&limit=${limit}`;
    
    if (filters.category) {
      url += `&category=${filters.category}`;
    }
    
    if (filters.search) {
      url += `&search=${filters.search}`;
    }
    
    return await fetchWithAuth(url);
  } catch (error) {
    console.error('Supplier fetch error:', error);
    throw error.response?.data?.message || 'Error fetching suppliers';
  }
};

// Get supplier by ID
export const getSupplierById = async (id) => {
  try {
    return await fetchWithAuth(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Get supplier error:', error);
    throw error.response?.data?.message || 'Error fetching supplier';
  }
};

// Create new supplier
export const createSupplier = async (supplierData) => {
  try {
    return await fetchWithAuth(API_URL, {
      method: 'POST',
      body: JSON.stringify(supplierData)
    });
  } catch (error) {
    console.error('Create supplier error:', error);
    throw error.response?.data?.message || 'Error creating supplier';
  }
};

// Update supplier
export const updateSupplier = async (id, supplierData) => {
  try {
    return await fetchWithAuth(`${API_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(supplierData)
    });
  } catch (error) {
    console.error('Update supplier error:', error);
    throw error.response?.data?.message || 'Error updating supplier';
  }
};

// Delete supplier
export const deleteSupplier = async (id) => {
  try {
    return await fetchWithAuth(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Delete supplier error:', error);
    throw error.response?.data?.message || 'Error deleting supplier';
  }
};

// Get supplier statistics
export const getSupplierStats = async () => {
  try {
    return await fetchWithAuth(`${API_URL}/stats`);
  } catch (error) {
    console.error('Supplier stats error:', error);
    throw error.response?.data?.message || 'Error fetching supplier statistics';
  }
};

const supplierService = {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierStats
};

export default supplierService;
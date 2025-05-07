// components/admin/FAQManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaToggleOn, FaToggleOff } from 'react-icons/fa';

const FAQManagement = () => {
  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const [filterOptions, setFilterOptions] = useState({
    category: 'all',
    showInactive: true,
    searchTerm: ''
  });
  
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    keywords: '',
    category: '',
    priority: 0,
    isActive: true
  });
  
  useEffect(() => {
    fetchData();
  }, []);
  
  useEffect(() => {
    applyFilters();
  }, [faqs, filterOptions]);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      // Get FAQs
      const faqsResponse = await axios.get('/api/faqs', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // Get categories
      const categoriesResponse = await axios.get('/api/faqs/categories', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setFaqs(faqsResponse.data);
      setCategories(categoriesResponse.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching FAQ data:', err);
      setError('Failed to load FAQs. Please try again later.');
      setLoading(false);
    }
  };
  
  const applyFilters = () => {
    let filtered = [...faqs];
    
    // Filter by category
    if (filterOptions.category !== 'all') {
      filtered = filtered.filter(faq => faq.category === filterOptions.category);
    }
    
    // Filter by active status
    if (!filterOptions.showInactive) {
      filtered = filtered.filter(faq => faq.isActive);
    }
    
    // Filter by search term
    if (filterOptions.searchTerm) {
      const term = filterOptions.searchTerm.toLowerCase();
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(term) || 
        faq.answer.toLowerCase().includes(term) ||
        (faq.keywords && faq.keywords.some(keyword => keyword.toLowerCase().includes(term)))
      );
    }
    
    setFilteredFaqs(filtered);
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSearchChange = (e) => {
    setFilterOptions(prev => ({
      ...prev,
      searchTerm: e.target.value
    }));
  };
  
  const toggleShowInactive = () => {
    setFilterOptions(prev => ({
      ...prev,
      showInactive: !prev.showInactive
    }));
  };
  
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      keywords: '',
      category: categories.length > 0 ? categories[0].id : '',
      priority: 0,
      isActive: true
    });
  };
  
  const handleEditClick = (faq) => {
    setSelectedFAQ(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      keywords: faq.keywords ? faq.keywords.join(', ') : '',
      category: faq.category,
      priority: faq.priority || 0,
      isActive: faq.isActive
    });
    setIsEditing(true);
    setIsAdding(false);
  };
  
  const handleAddClick = () => {
    resetForm();
    setSelectedFAQ(null);
    setIsEditing(false);
    setIsAdding(true);
  };
  
  const handleCancelClick = () => {
    setIsEditing(false);
    setIsAdding(false);
    setSelectedFAQ(null);
    resetForm();
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Parse keywords from comma-separated string to array
      const keywordsArray = formData.keywords
        .split(',')
        .map(keyword => keyword.trim())
        .filter(keyword => keyword.length > 0);
      
      const faqData = {
        ...formData,
        keywords: keywordsArray
      };
      
      if (isAdding) {
        // Create new FAQ
        await axios.post('/api/faqs', faqData, {
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}` 
          }
        });
      } else if (isEditing && selectedFAQ) {
        // Update existing FAQ
        await axios.put(`/api/faqs/${selectedFAQ._id}`, faqData, {
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}` 
          }
        });
      }
      
      // Refresh FAQs list
      fetchData();
      
      // Reset form and states
      handleCancelClick();
    } catch (error) {
      console.error('Error saving FAQ:', error);
      setError('Failed to save FAQ. Please try again.');
    }
  };
  
  const handleToggleStatus = async (faq) => {
    try {
      await axios.put(`/api/faqs/${faq._id}/toggle-status`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // Refresh FAQs list
      fetchData();
    } catch (error) {
      console.error('Error toggling FAQ status:', error);
      setError('Failed to update FAQ status. Please try again.');
    }
  };
  
  const handleDeleteClick = async (faq) => {
    if (window.confirm('Are you sure you want to delete this FAQ? This action cannot be undone.')) {
      try {
        await axios.delete(`/api/faqs/${faq._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        // Refresh FAQs list
        fetchData();
      } catch (error) {
        console.error('Error deleting FAQ:', error);
        setError('Failed to delete FAQ. Please try again.');
      }
    }
  };
  
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };
  
  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading FAQs...</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
        <h2 className="text-xl font-semibold">Chatbot FAQ Management</h2>
        <button 
          className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 flex items-center"
          onClick={handleAddClick}
        >
          <FaPlus className="mr-2" /> Add FAQ
        </button>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4">
          <p>{error}</p>
          <button 
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}
      
      {/* Filters */}
      <div className="border-b border-gray-200 p-4 bg-gray-50">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h3 className="text-gray-700 font-medium mb-2 md:mb-0">Filter FAQs</h3>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search FAQs..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-auto"
                value={filterOptions.searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            
            {/* Category filter */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                name="category"
                value={filterOptions.category}
                onChange={handleFilterChange}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Show inactive toggle */}
            <button
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white"
              onClick={toggleShowInactive}
            >
              {filterOptions.showInactive ? (
                <>
                  <FaToggleOn className="text-blue-500 mr-2" />
                  Showing Inactive
                </>
              ) : (
                <>
                  <FaToggleOff className="text-gray-500 mr-2" />
                  Hiding Inactive
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Form for adding/editing */}
      {(isAdding || isEditing) && (
        <div className="p-4 border-b border-gray-200 bg-blue-50">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            {isAdding ? 'Add New FAQ' : 'Edit FAQ'}
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 mb-4">
              {/* Question */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="question"
                  value={formData.question}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              
              {/* Answer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Answer <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="answer"
                  value={formData.answer}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows="5"
                  required
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Keywords */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Keywords (comma separated)
                  </label>
                  <input
                    type="text"
                    name="keywords"
                    value={formData.keywords}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g. hours, schedule, timing"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority (0-10)
                  </label>
                  <input
                    type="number"
                    name="priority"
                    value={formData.priority}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    min="0"
                    max="10"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Higher priority FAQs appear first in search results
                  </p>
                </div>
                
                {/* Active status */}
                <div className="flex items-center h-full pt-6">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleFormChange}
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700">
                    Active (visible to users)
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancelClick}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {isAdding ? 'Add FAQ' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* FAQs Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map(faq => (
                <tr key={faq._id} className={!faq.isActive ? 'bg-gray-50' : ''}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{faq.question}</div>
                    <div className="text-xs text-gray-500 mt-1 truncate max-w-md">
                      {faq.answer.substring(0, 100)}{faq.answer.length > 100 ? '...' : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {getCategoryName(faq.category)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {faq.priority || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        faq.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {faq.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleToggleStatus(faq)}
                        className="text-gray-500 hover:text-blue-600"
                        title={faq.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {faq.isActive ? <FaToggleOn className="text-green-500" /> : <FaToggleOff />}
                      </button>
                      <button 
                        onClick={() => handleEditClick(faq)}
                        className="text-gray-500 hover:text-blue-600"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(faq)}
                        className="text-gray-500 hover:text-red-600"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No FAQs found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FAQManagement;
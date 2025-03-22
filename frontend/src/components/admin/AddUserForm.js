// src/components/admin/AddUserForm.js
import React, { useState } from 'react';
import { addUser } from '../../api/admin';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';

const AddUserForm = ({ onUserAdded }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phonenumber: '',
    role: 'Pet Owner',
    isActive: true
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await addUser(formData);
      
      setMessage('User created successfully!');
      setMessageType('success');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        phonenumber: '',
        role: 'Pet Owner',
        isActive: true
      });
      
      // Inform parent component if needed
      if (onUserAdded && typeof onUserAdded === 'function') {
        onUserAdded(response.user);
      }
      
      // Close form after successful creation (optional)
      // setShowForm(false);
    } catch (error) {
      setMessage(error.message || 'Failed to create user');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
      
        <Button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white"
        >
          {showForm ? 'Hide Form' : 'Add New User'}
        </Button>
      </div>
      
      {message && (
        <Alert 
          type={messageType} 
          message={message} 
          onClose={() => setMessage('')}
          className="mb-4" 
        />
      )}
      
      {showForm && (
        <div className="border rounded-lg p-4 bg-gray-50 mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New User</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Enter full name"
                required
              />
              
              <Input 
                label="Email" 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="Enter email address"
                required
              />
              
              <Input 
                label="Password" 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="Enter password"
                required
              />
              
              <Input 
                label="Phone Number" 
                name="phonenumber" 
                value={formData.phonenumber} 
                onChange={handleChange} 
                placeholder="Enter phone number"
                required
              />
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Pet Owner">Pet Owner</option>
                  <option value="Veterinarian">Veterinarian</option>
                 
                  <option value="Admin">Admin</option>
                </select>
              </div>
              
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="isActive" className="text-gray-700">
                  Active Account
                </label>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button
                type="button"
                className="px-4 py-2 bg-gray-300 text-gray-800 mr-2"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create User'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddUserForm;
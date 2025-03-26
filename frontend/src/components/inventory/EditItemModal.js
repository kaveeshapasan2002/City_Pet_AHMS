// frontend/src/components/inventory/EditItemModal.js
import React, { useState, useEffect } from 'react';
import { useInventory } from '../../context/InventoryContext';
import Modal from '../common/Modal';

const EditItemModal = ({ item, onClose }) => {
  const { updateItem } = useInventory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: '',
    unitPrice: '',
    location: '',
    expiryDate: '',
    lowStockThreshold: '',
    description: ''
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        category: item.category || 'Medication',
        quantity: item.quantity?.toString() || '',
        unit: item.unit || '',
        unitPrice: item.unitPrice?.toString() || '',
        location: item.location || '',
        expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : '',
        lowStockThreshold: item.lowStockThreshold?.toString() || '10',
        description: item.description || ''
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim()) {
      setError('Item name is required');
      return;
    }

    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      setError('Quantity must be a valid number');
      return;
    }

    if (!formData.unitPrice || parseFloat(formData.unitPrice) <= 0) {
      setError('Unit price must be a valid number greater than zero');
      return;
    }

    // Prepare data for submission
    const itemData = {
      ...formData,
      quantity: parseInt(formData.quantity),
      unitPrice: parseFloat(formData.unitPrice),
      lowStockThreshold: parseInt(formData.lowStockThreshold),
      expiryDate: formData.expiryDate || null
    };

    setLoading(true);
    setError('');

    try {
      await updateItem(item._id, itemData);
      onClose();
    } catch (err) {
      setError(err.toString());
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Edit Inventory Item"
      onClose={onClose}
      showFooter={false}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Item Name */}
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Item Name *
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="Medication">Medication</option>
              <option value="Supply">Supply</option>
              <option value="Equipment">Equipment</option>
              <option value="Food">Food</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Storage Location *
            </label>
            <input
              type="text"
              name="location"
              id="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          {/* Quantity */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Quantity *
            </label>
            <input
              type="number"
              name="quantity"
              id="quantity"
              min="0"
              value={formData.quantity}
              onChange={handleChange}
              required
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          {/* Unit */}
          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
              Unit *
            </label>
            <input
              type="text"
              name="unit"
              id="unit"
              placeholder="e.g., tablets, bottles, pieces"
              value={formData.unit}
              onChange={handleChange}
              required
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          {/* Unit Price */}
          <div>
            <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700">
              Unit Price ($) *
            </label>
            <input
              type="number"
              name="unitPrice"
              id="unitPrice"
              min="0.01"
              step="0.01"
              value={formData.unitPrice}
              onChange={handleChange}
              required
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          {/* Low Stock Threshold */}
          <div>
            <label htmlFor="lowStockThreshold" className="block text-sm font-medium text-gray-700">
              Low Stock Alert Threshold
            </label>
            <input
              type="number"
              name="lowStockThreshold"
              id="lowStockThreshold"
              min="1"
              value={formData.lowStockThreshold}
              onChange={handleChange}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          {/* Expiry Date */}
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
              Expiry Date
            </label>
            <input
              type="date"
              name="expiryDate"
              id="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          {/* Description */}
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              placeholder="Additional details about this item..."
            ></textarea>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              loading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Saving...' : 'Update Item'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditItemModal;
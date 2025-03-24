import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Make sure to install axios: npm install axios


// const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';


const InvoiceCreate2 = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [invoice, setInvoice] = useState({
    patientName: '',
    ownerName: '',
    items: [{ description: '', quantity: 1, price: 0 }],
    total: 0
  });

  // Update item in the invoice
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...invoice.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    
    // Recalculate item total
    if (field === 'quantity' || field === 'price') {
      const total = updatedItems.reduce((sum, item) => {
        return sum + (item.quantity * item.price);
      }, 0);
      
      setInvoice({
        ...invoice,
        items: updatedItems,
        total: total
      });
    } else {
      setInvoice({
        ...invoice,
        items: updatedItems
      });
    }
  };

  // Add a new item row
  const addItem = () => {
    setInvoice({
      ...invoice,
      items: [...invoice.items, { description: '', quantity: 1, price: 0 }]
    });
  };

  // Remove an item row
  const removeItem = (index) => {
    if (invoice.items.length === 1) {
      return; // Keep at least one item
    }
    
    const updatedItems = invoice.items.filter((_, i) => i !== index);
    const total = updatedItems.reduce((sum, item) => {
      return sum + (item.quantity * item.price);
    }, 0);
    
    setInvoice({
      ...invoice,
      items: updatedItems,
      total: total
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Create the invoice data object
      const invoiceData = {
        patientName: invoice.patientName,
        ownerName: invoice.ownerName,
        items: invoice.items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          price: item.price
        })),
        total: invoice.total
      };
      
      // Send POST request to your API
      const response = await axios.post(`${BASE_URL}/api/invoices/`, invoiceData);
      
      // Get the invoice ID from the response
      const newInvoiceId = response.data._id;
      
      // Navigate to payment page with the new ID
      console.log(`Navigating to /payment/${newInvoiceId}`);
      navigate(`/payment/${newInvoiceId}`);
      
    } catch (error) {
      console.error('Error creating invoice:', error);
      setError(error.response?.data?.message || 'Failed to create invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Invoice</h1>
      
      {/* Show error message if there's an error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          {/* Patient and Owner Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient Name
              </label>
              <input
                type="text"
                value={invoice.patientName}
                onChange={(e) => setInvoice({...invoice, patientName: e.target.value})}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter patient name"
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Owner Name
              </label>
              <input
                type="text"
                value={invoice.ownerName}
                onChange={(e) => setInvoice({...invoice, ownerName: e.target.value})}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter owner name"
                disabled={loading}
              />
            </div>
          </div>
          
          {/* Invoice Items */}
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-3">Invoice Items</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full mb-3">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Description</th>
                    <th className="text-center py-2 w-24">Quantity</th>
                    <th className="text-right py-2 w-32">Price</th>
                    <th className="text-right py-2 w-32">Amount</th>
                    <th className="w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-1"
                          placeholder="Item description"
                          required
                          disabled={loading}
                        />
                      </td>
                      <td className="py-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-full border border-gray-300 rounded px-3 py-1 text-center"
                          required
                          disabled={loading}
                        />
                      </td>
                      <td className="py-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                          className="w-full border border-gray-300 rounded px-3 py-1 text-right"
                          required
                          disabled={loading}
                        />
                      </td>
                      <td className="py-2 text-right">
                        ${(item.quantity * item.price).toFixed(2)}
                      </td>
                      <td className="py-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-500 hover:text-red-700"
                          disabled={invoice.items.length === 1 || loading}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <button
              type="button"
              onClick={addItem}
              className="bg-gray-200 text-gray-700 py-1 px-3 rounded hover:bg-gray-300"
              disabled={loading}
            >
              + Add Item
            </button>
          </div>
          
          {/* Total */}
          <div className="flex justify-end mb-6">
            <div className="w-64">
              <div className="flex justify-between py-2 border-t border-b">
                <span className="font-bold">Total:</span>
                <span className="font-bold">${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Buttons */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/invoices')}
              className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceCreate2;
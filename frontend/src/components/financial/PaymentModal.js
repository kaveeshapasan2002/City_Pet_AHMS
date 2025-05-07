// src/components/financial/PaymentModal.js
import React, { useState } from 'react';

const PaymentModal = ({ invoice, remainingBalance, onClose, onSubmit }) => {
  const [amount, setAmount] = useState(remainingBalance);
  const [method, setMethod] = useState('');
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate payment amount
    if (amount <= 0) {
      setError('Payment amount must be greater than zero.');
      return;
    }
    
    if (amount > remainingBalance) {
      setError(`Payment amount cannot exceed the remaining balance of $${remainingBalance.toFixed(2)}.`);
      return;
    }
    
    // Validate payment method
    if (!method) {
      setError('Please select a payment method.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Submit payment data
      await onSubmit({
        amount: parseFloat(amount),
        method,
        reference: reference || null
      });
    } catch (error) {
      setError('Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Record Payment</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Invoice #{invoice.invoiceNumber}
            </label>
            <p className="text-sm text-gray-600">
              Total: ${invoice.total.toFixed(2)} | 
              Remaining: ${remainingBalance.toFixed(2)}
            </p>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Payment Amount ($)
            </label>
            <input 
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full p-2 border rounded"
              step="0.01"
              min="0.01"
              max={remainingBalance}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Payment Method
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Payment Method</option>
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Check">Check</option>
              <option value="Insurance">Insurance</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              Reference (Optional)
            </label>
            <input 
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Transaction ID, Check #, etc."
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
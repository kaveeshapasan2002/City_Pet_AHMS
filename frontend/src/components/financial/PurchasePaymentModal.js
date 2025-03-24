// frontend/src/components/financial/PurchasePaymentModal.js
import React, { useState } from 'react';
import { usePurchaseRequest } from '../../context/PurchaseRequestContext';

const PurchasePaymentModal = ({ 
  purchaseRequest, 
  onClose, 
  onPaymentSuccess 
}) => {
  const { processPurchasePayment } = usePurchaseRequest();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!paymentMethod || !transactionId) {
      setError('Please fill in all payment details');
      return;
    }

    try {
      await processPurchasePayment({
        purchaseRequestId: purchaseRequest._id,
        paymentMethod,
        transactionId
      });
      
      onPaymentSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-4">Complete Purchase</h2>
        
        {/* Purchase Details */}
        <div className="mb-4">
          <p>Item: {purchaseRequest.item.name}</p>
          <p>Quantity: {purchaseRequest.quantity}</p>
          <p>Total Amount: ${purchaseRequest.totalAmount.toFixed(2)}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Payment Method */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Payment Method</option>
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          {/* Transaction ID */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Transaction ID</label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter Transaction ID"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Complete Purchase
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchasePaymentModal;
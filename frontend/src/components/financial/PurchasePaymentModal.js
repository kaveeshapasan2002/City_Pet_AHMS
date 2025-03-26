import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PurchasePaymentModal = ({ request, onClose, onSubmit }) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Validate credit card details
    const { cardNumber, cardHolder, expiryDate, cvv } = cardDetails;
    
    // Basic validation
    if (paymentMethod === 'Credit Card') {
      if (
        !cardNumber || 
        !cardHolder || 
        !expiryDate || 
        !cvv || 
        cardNumber.replace(/\s/g, '').length !== 16 ||
        !/^\d{3}$/.test(cvv)
      ) {
        setError('Please enter valid credit card details');
        setLoading(false);
        return;
      }
    }

    // For Bank Transfer, require transaction ID
    if (paymentMethod === 'Bank Transfer' && !transactionId) {
      setError('Please enter a transaction ID for bank transfers');
      setLoading(false);
      return;
    }

    try {
      // Submit payment with method and card details
      await onSubmit({
        paymentMethod,
        transactionId,
        ...(paymentMethod === 'Credit Card' ? { cardDetails } : {})
      });

      // Navigate to payment success page
      navigate('/payment-success', { 
        state: { 
          amount: request.totalAmount, 
          itemName: request.item.name 
        } 
      });
    } catch (err) {
      console.error('Payment submission failed', err);
      setError('Payment submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Payment for {request.item.name}</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Payment Method Selection */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 border rounded"
              required
              disabled={loading}
            >
              <option value="">Select Payment Method</option>
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          {/* Transaction ID for Bank Transfer */}
          {paymentMethod === 'Bank Transfer' && (
            <div className="mb-4">
              <label className="block mb-2 font-medium">Transaction ID</label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter bank transaction ID"
                required
                disabled={loading}
              />
            </div>
          )}

          {/* Credit Card Details */}
          {paymentMethod === 'Credit Card' && (
            <div className="space-y-4">
              {/* Card Number */}
              <div>
                <label className="block mb-2 font-medium">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleCardDetailsChange}
                  placeholder="1234 5678 9012 3456"
                  pattern="\d{4}\s?\d{4}\s?\d{4}\s?\d{4}"
                  maxLength="19"
                  className="w-full p-2 border rounded"
                  required
                  disabled={loading}
                />
              </div>

              {/* Card Holder Name */}
              <div>
                <label className="block mb-2 font-medium">Card Holder Name</label>
                <input
                  type="text"
                  name="cardHolder"
                  value={cardDetails.cardHolder}
                  onChange={handleCardDetailsChange}
                  placeholder="John Doe"
                  className="w-full p-2 border rounded"
                  required
                  disabled={loading}
                />
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-2 gap-4">
                {/* Expiry Date */}
                <div>
                  <label className="block mb-2 font-medium">Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={cardDetails.expiryDate}
                    onChange={handleCardDetailsChange}
                    placeholder="MM/YY"
                    pattern="(0[1-9]|1[0-2])\/\d{2}"
                    maxLength="5"
                    className="w-full p-2 border rounded"
                    required
                    disabled={loading}
                  />
                </div>

                {/* CVV */}
                <div>
                  <label className="block mb-2 font-medium">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={cardDetails.cvv}
                    onChange={handleCardDetailsChange}
                    placeholder="123"
                    pattern="\d{3}"
                    maxLength="3"
                    className="w-full p-2 border rounded"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Total Amount Display */}
          <div className="mt-4 text-right">
            <p className="text-lg font-bold">
              Total Amount: ${request.totalAmount.toFixed(2)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-6">
            <button 
              type="button" 
              onClick={onClose} 
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`bg-blue-500 text-white px-4 py-2 rounded ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'}`}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Complete Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchasePaymentModal;
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Payment = () => {
  // Change from invoiceId to id to match App.js route parameter
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payment, setPayment] = useState({
    amount: 0,
    method: 'cash'
  });

  // Fetch invoice data
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        // Use id instead of invoiceId
        const response = await axios.get(`/api/invoices/${id}`);
        setInvoice(response.data);
        setPayment({ ...payment, amount: response.data.total });
      } catch (err) {
        setError('Error fetching invoice data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInvoice();
  }, [id]); // Change dependency to id

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Update invoice status - use id instead of invoiceId
      await axios.patch(`/api/invoices/${id}/status`, {
        status: 'paid',
        paymentMethod: payment.method,
        amountPaid: payment.amount
      });
      
      // Navigate back to invoices
      navigate('/invoices', { 
        state: { 
          message: 'Payment processed successfully',
          type: 'success' 
        } 
      });
    } catch (err) {
      setError('Error processing payment');
      console.error(err);
    }
  };

  // Rest of the component remains the same
  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            onClick={() => navigate('/invoices')}
            className="mt-2 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
          >
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>Invoice not found.</p>
          <button 
            onClick={() => navigate('/invoices')}
            className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white py-1 px-3 rounded"
          >
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Process Payment</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Invoice Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Invoice Details</h2>
          
          <div className="mb-4">
            <p><span className="font-medium">Invoice ID:</span> {invoice._id}</p>
            <p><span className="font-medium">Date:</span> {new Date(invoice.createdAt).toLocaleDateString()}</p>
            <p><span className="font-medium">Patient:</span> {invoice.patientName}</p>
            <p><span className="font-medium">Owner:</span> {invoice.ownerName}</p>
          </div>
          
          <h3 className="font-medium mb-2">Items</h3>
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Description</th>
                  <th className="text-center py-2">Qty</th>
                  <th className="text-right py-2">Price</th>
                  <th className="text-right py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{item.description}</td>
                    <td className="py-2 text-center">{item.quantity}</td>
                    <td className="py-2 text-right">${item.price.toFixed(2)}</td>
                    <td className="py-2 text-right">${(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="py-2 text-right font-bold">Total:</td>
                  <td className="py-2 text-right font-bold">${invoice.total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        
        {/* Payment Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Payment Information</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={payment.amount}
                onChange={(e) => setPayment({...payment, amount: parseFloat(e.target.value) || 0})}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
              {payment.amount < invoice.total && (
                <p className="text-yellow-600 text-sm mt-1">
                  Warning: Amount is less than the total invoice amount.
                </p>
              )}
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                value={payment.method}
                onChange={(e) => setPayment({...payment, method: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              >
                <option value="cash">Cash</option>
                <option value="credit">Credit Card</option>
                <option value="debit">Debit Card</option>
                <option value="check">Check</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => navigate('/invoices')}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
              >
                Process Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;
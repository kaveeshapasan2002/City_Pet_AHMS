import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch invoice on component mount
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/invoices/${id}`);
        setInvoice(response.data);
      } catch (err) {
        setError('Error loading invoice details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="ml-3 text-gray-600">Loading invoice details...</p>
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
          <p>Invoice not found</p>
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoice Details</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => navigate('/invoices')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
          >
            Back to Invoices
          </button>
          {invoice.status === 'unpaid' && (
            <button
              onClick={() => navigate(`/payment/${invoice._id}`)}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
            >
              Process Payment
            </button>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Invoice Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between flex-wrap">
            <div>
              <p className="text-lg font-semibold">Invoice #{invoice._id}</p>
              <p className="text-gray-600">Created: {new Date(invoice.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold
                ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 
                  invoice.status === 'unpaid' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-gray-100 text-gray-800'}`}
              >
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Customer & Payment Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-sm font-medium text-gray-500 uppercase mb-2">Customer Information</h2>
              <p className="font-medium">{invoice.patientName}</p>
              <p className="text-gray-600">Owner: {invoice.ownerName}</p>
            </div>
            
            {invoice.status === 'paid' && (
              <div>
                <h2 className="text-sm font-medium text-gray-500 uppercase mb-2">Payment Information</h2>
                <p><span className="font-medium">Date:</span> {new Date(invoice.paymentDate).toLocaleDateString()}</p>
                <p><span className="font-medium">Method:</span> {invoice.paymentMethod}</p>
                <p><span className="font-medium">Amount Paid:</span> ${invoice.amountPaid.toFixed(2)}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Invoice Items */}
        <div className="p-6">
          <h2 className="text-sm font-medium text-gray-500 uppercase mb-4">Invoice Items</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoice.items.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                      ${(item.quantity * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td colSpan="3" className="px-6 py-4 text-right font-medium">
                    Total:
                  </td>
                  <td className="px-6 py-4 text-right font-bold">
                    ${invoice.total.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
      
      {/* Invoice Actions */}
      <div className="mt-6 flex justify-end space-x-2">
        {invoice.status === 'paid' && (
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
            onClick={() => window.print()} // For future receipt printing
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
            </svg>
            Print Receipt
          </button>
        )}
        
        <button 
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
          onClick={() => navigate('/invoices')}
        >
          Back to Invoices
        </button>
      </div>
    </div>
  );
};

export default InvoiceDetail;
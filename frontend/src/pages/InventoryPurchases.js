// frontend/src/pages/InventoryPurchases.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import { usePurchaseRequest } from '../context/PurchaseRequestContext';
import LowStockRecommendations from '../components/financial/LowStockRecommendations';
import PurchasePaymentModal from '../components/financial/PurchasePaymentModal';
import PaymentList from '../components/admin/PaymentList';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const InventoryPurchases = () => {
  const navigate = useNavigate();
  const { fetchItems } = useInventory();
  const { 
    purchaseRequests, 
    fetchPurchaseRequests,
    processPurchasePayment,
    loading,
    error
  } = usePurchaseRequest();
  
  const [selectedApprovedRequest, setSelectedApprovedRequest] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    console.log("Fetching approved purchase requests...");
    fetchPurchaseRequests('Approved')
      .then(data => console.log("Approved requests received:", data))
      .catch(err => console.error("Error fetching approved requests:", err));

    fetchItems();

    const refreshInterval = setInterval(() => {
      console.log("Auto-refreshing approved purchase requests...");
      fetchPurchaseRequests('Approved');
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, [fetchPurchaseRequests, fetchItems, refreshTrigger]);

  const handleRefresh = () => {
    console.log("Manual refresh requested");
    setRefreshTrigger(prev => prev + 1);
    toast.info("Refreshing approved purchase requests...");
  };

  const handlePaymentInitiation = (request) => {
    setSelectedApprovedRequest(request);
  };

  const handlePaymentSubmit = async (paymentDetails) => {
    try {
      setPaymentProcessing(true);
      const response = await processPurchasePayment(
        selectedApprovedRequest._id, 
        paymentDetails
      );

      toast.success(`Payment processed successfully for ${selectedApprovedRequest.item.name}`);
      setSelectedApprovedRequest(null);
      fetchPurchaseRequests('Approved');
      fetchItems();
      
      navigate('/payment-success', { 
        state: { 
          amount: selectedApprovedRequest.totalAmount, 
          itemName: selectedApprovedRequest.item.name,
          inventoryUpdate: response.inventoryUpdate
        } 
      });
    } catch (error) {
      console.error('Payment processing failed', error);
      toast.error(`Payment failed: ${error.toString()}`);
    } finally {
      setPaymentProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Purchases</h1>
        <Link 
          to="/financial-management"
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded transition"
        >
          Back to Financial Management
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Low Stock Recommendations */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Low Stock Recommendations</h2>
        <LowStockRecommendations />
      </div>

      {/* Approved Purchase Requests */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Approved Purchase Requests</h2>
          <button
            onClick={handleRefresh}
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
        
        {loading ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <div className="flex justify-center items-center">
              <svg className="animate-spin h-5 w-5 mr-3 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Loading approved purchase requests...</span>
            </div>
          </div>
        ) : purchaseRequests.length === 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center text-gray-500">
            No approved purchase requests at the moment.
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {purchaseRequests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{request.item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{request.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${request.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handlePaymentInitiation(request)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                        disabled={paymentProcessing}
                      >
                        Proceed to Payment
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Payment List</h2>
        <PaymentList />
      </div>
      

      {/* Payment Modal */}
      {selectedApprovedRequest && (
        <PurchasePaymentModal 
          request={selectedApprovedRequest}
          onClose={() => setSelectedApprovedRequest(null)}
          onSubmit={handlePaymentSubmit}
        />
      )}
    </div>
  );
};

export default InventoryPurchases;
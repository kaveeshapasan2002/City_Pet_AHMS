// frontend/src/components/admin/PaymentList.js
import React, { useState, useEffect } from 'react';
import { usePurchaseRequest } from '../../context/PurchaseRequestContext';
import { toast } from 'react-toastify';

const PaymentList = () => {
  const { 
    purchaseRequests, 
    fetchPurchaseRequests, 
    updatePurchaseRequestStatus, // Use this for reject
    loading, 
    error 
  } = usePurchaseRequest();
  
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [processingRequest, setProcessingRequest] = useState(null);

  useEffect(() => {
    // Fetch pending purchase requests
    fetchPurchaseRequests('Pending');
  }, [fetchPurchaseRequests, refreshTrigger]);

  // Handle approving a purchase request - without using approvePurchaseRequest yet
  const handleApprove = async (id) => {
    try {
      setProcessingRequest(id);
      
      // Just use regular update until we fix the context
      await updatePurchaseRequestStatus(id, { status: 'Approved' });
      
      toast.success('Purchase request approved successfully');
      
      // Refresh the list
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error approving purchase request:', error);
      toast.error(`Failed to approve request: ${error.toString()}`);
    } finally {
      setProcessingRequest(null);
    }
  };

  // Handle rejecting a purchase request
  const handleReject = async (id) => {
    try {
      setProcessingRequest(id);
      await updatePurchaseRequestStatus(id, { status: 'Rejected' });
      toast.success('Purchase request rejected');
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error rejecting purchase request:', error);
      toast.error(`Failed to reject request: ${error.toString()}`);
    } finally {
      setProcessingRequest(null);
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-blue-100 text-blue-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Debug function to log available functions
  const logAvailableFunctions = () => {
    console.log('Available functions in PurchaseRequestContext:');
    console.log('purchaseRequests:', Array.isArray(purchaseRequests));
    console.log('fetchPurchaseRequests:', typeof fetchPurchaseRequests);
    console.log('updatePurchaseRequestStatus:', typeof updatePurchaseRequestStatus);
    console.log('loading:', typeof loading);
    console.log('error:', error);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Payment Requests</h2>
        <div className="flex space-x-2">
          <button
            onClick={logAvailableFunctions}
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
          >
            Debug Context
          </button>
          <button
            onClick={() => setRefreshTrigger(prev => prev + 1)}
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 flex items-center"
            disabled={loading}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading && !purchaseRequests.length ? (
        <div className="text-center py-4">
          <svg 
            className="animate-spin h-8 w-8 mx-auto text-blue-500" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            ></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-2">Loading payment requests...</p>
        </div>
      ) : purchaseRequests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No pending payment requests available.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requested By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {purchaseRequests.map((request) => (
                <tr key={request._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {request.item?.name || 'Unknown Item'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{request.quantity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">${request.totalAmount?.toFixed(2) || '0.00'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {request.requestedBy?.name || 'Unknown User'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {request.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(request._id)}
                            disabled={processingRequest === request._id}
                            className={`text-green-600 hover:text-green-900 ${processingRequest === request._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {processingRequest === request._id ? 'Processing...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleReject(request._id)}
                            disabled={processingRequest === request._id}
                            className={`text-red-600 hover:text-red-900 ${processingRequest === request._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentList;
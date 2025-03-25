import React, { useState } from 'react';
import { usePurchaseRequest } from '../../context/PurchaseRequestContext';
import Spinner from '../common/Spinner';
import { toast } from 'react-toastify';

const PurchaseRequestTable = ({ purchaseRequests, loading, onStatusUpdate }) => {
  const { updatePurchaseRequestStatus, approvePurchaseRequest, deletePurchaseRequest } = usePurchaseRequest();
  const [processingRequest, setProcessingRequest] = useState(null);

  // Status color mapping
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

  // Handle status update
  const handleStatusUpdate = async (id, status) => {
    try {
      setProcessingRequest(id);
      console.log(`Updating request ${id} to status ${status}`);
      
      let updated;
      
      // Use approvePurchaseRequest for approvals to avoid automatic completion
      if (status === 'Approved') {
        updated = await approvePurchaseRequest(id);
        console.log('Request approved:', updated);
      } else {
        updated = await updatePurchaseRequestStatus(id, { status });
        console.log('Request status updated:', updated);
      }
      
      toast.success(`Request status updated to ${status}`);
      
      // Call the callback if provided
      if (onStatusUpdate) {
        onStatusUpdate(updated);
      }
      
    } catch (error) {
      console.error('Failed to update status', error);
      toast.error(`Failed to update status: ${error.toString()}`);
    } finally {
      setProcessingRequest(null);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      setProcessingRequest(id);
      await deletePurchaseRequest(id);
      toast.success('Purchase request deleted');
      
      // Call the callback if provided
      if (onStatusUpdate) {
        onStatusUpdate();
      }
      
    } catch (error) {
      console.error('Failed to delete purchase request', error);
      toast.error(`Failed to delete request: ${error.toString()}`);
    } finally {
      setProcessingRequest(null);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Item Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Unit Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Amount
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
          {purchaseRequests.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                No purchase requests found
              </td>
            </tr>
          ) : (
            purchaseRequests.map((request) => (
              <tr key={request._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {request.item.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{request.quantity}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">${request.unitPrice.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">${request.totalAmount.toFixed(2)}</div>
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
                          onClick={() => handleStatusUpdate(request._id, 'Approved')}
                          disabled={processingRequest === request._id}
                          className={`text-green-600 hover:text-green-900 ${processingRequest === request._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {processingRequest === request._id ? 'Processing...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(request._id, 'Rejected')}
                          disabled={processingRequest === request._id}
                          className={`text-red-600 hover:text-red-900 ${processingRequest === request._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {request.status === 'Approved' && (
                      <span className="text-blue-600">
                        Awaiting Payment
                      </span>
                    )}
                    {(request.status === 'Rejected' || request.status === 'Completed') && (
                      <button
                        onClick={() => handleDelete(request._id)}
                        disabled={processingRequest === request._id}
                        className={`text-red-600 hover:text-red-900 ${processingRequest === request._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {processingRequest === request._id ? 'Deleting...' : 'Delete'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseRequestTable;
// frontend/src/components/financial/LowStockRecommendations.js
import React, { useState, useEffect } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { usePurchaseRequest } from '../../context/PurchaseRequestContext';
import { toast } from 'react-toastify'; // Assuming you're using react-toastify for notifications

const LowStockRecommendations = () => {
  const { items, loading: inventoryLoading, fetchItems } = useInventory();
  const { 
    createPurchaseRequest, 
    loading: requestLoading, 
    fetchPurchaseRequests 
  } = usePurchaseRequest();
  
  const [lowStockItems, setLowStockItems] = useState([]);
  const [creatingRequestFor, setCreatingRequestFor] = useState(null);

  useEffect(() => {
    // Find items with quantity below low stock threshold
    const recommendedItems = items.filter(
      item => item.quantity <= item.lowStockThreshold
    ).map(item => ({
      ...item,
      recommendedQuantity: Math.max(item.lowStockThreshold * 2 - item.quantity, 0),
      estimatedCost: Math.max(item.lowStockThreshold * 2 - item.quantity, 0) * item.unitPrice
    }));

    setLowStockItems(recommendedItems);
  }, [items]);

  // Handle creating a purchase request
  const handleCreatePurchaseRequest = async (item) => {
    try {
      // Set the current item being processed
      setCreatingRequestFor(item._id);

      // Create purchase request
      await createPurchaseRequest({
        item: item._id,
        quantity: item.recommendedQuantity
      });

      // Success notification
      toast.success(`Purchase request created for ${item.name}`);
      
      // Refresh the low stock items (in case any metrics need to update)
      fetchItems();
      
      // Important: Don't refresh the "Approved" requests, since the new request 
      // will be in "Pending" status and shouldn't appear in the approved list
    } catch (error) {
      // Error notification
      toast.error(`Failed to create purchase request: ${error.message}`);
      console.error('Failed to create purchase request', error);
    } finally {
      // Reset the creating state
      setCreatingRequestFor(null);
    }
  };

  // Render loading state
  if (inventoryLoading) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
        <div className="flex justify-center items-center">
          <svg 
            className="animate-spin h-5 w-5 mr-3 text-indigo-600" 
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
          <span>Loading inventory items...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      {lowStockItems.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No low stock items requiring purchase
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recommended Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estimated Cost
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {lowStockItems.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`
                    ${item.quantity <= 0 ? 'text-red-500' : 
                      item.quantity <= item.lowStockThreshold ? 'text-yellow-500' : 'text-green-500'}
                  `}>
                    {item.quantity} {item.unit}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-blue-500">
                    {item.recommendedQuantity} {item.unit}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">
                    ${item.estimatedCost.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => handleCreatePurchaseRequest(item)}
                    disabled={creatingRequestFor === item._id || requestLoading}
                    className={`
                      inline-flex items-center px-3 py-1.5 border border-transparent 
                      text-xs font-medium rounded-full shadow-sm text-white 
                      ${creatingRequestFor === item._id || requestLoading 
                        ? 'bg-indigo-400 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-700'
                      }
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                    `}
                  >
                    {creatingRequestFor === item._id ? 'Creating...' : 'Create Purchase Request'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LowStockRecommendations;
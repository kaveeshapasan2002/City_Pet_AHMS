// frontend/src/components/financial/LowStockRecommendations.js
import React, { useState, useEffect } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { usePurchaseRequest } from '../../context/PurchaseRequestContext';
import PurchasePaymentModal from '../payments/PurchasePaymentModal';

const LowStockRecommendations = () => {
  const { items, fetchItems } = useInventory();
  const { createPurchaseRequest, fetchPurchaseRequests } = usePurchaseRequest();
  const [lowStockItems, setLowStockItems] = useState([]);
  const [selectedPurchaseRequest, setSelectedPurchaseRequest] = useState(null);

  useEffect(() => {
    // Find items with quantity below low stock threshold
    const recommendedItems = items
      .filter(item => item.quantity <= item.lowStockThreshold)
      .map(item => ({
        ...item,
        recommendedQuantity: Math.max(item.lowStockThreshold * 2 - item.quantity, 0),
        estimatedCost: Math.max(item.lowStockThreshold * 2 - item.quantity, 0) * item.unitPrice
      }));

    setLowStockItems(recommendedItems);
  }, [items]);

  // Handle creating a purchase request
  const handleCreatePurchaseRequest = async (item) => {
    try {
      const purchaseRequest = await createPurchaseRequest({
        item: item._id,
        quantity: item.recommendedQuantity
      });
      // Open payment modal for the new purchase request
      setSelectedPurchaseRequest(purchaseRequest);
    } catch (error) {
      console.error('Failed to create purchase request', error);
    }
  };

  return (
    <>
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
                  Low Stock Threshold
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
                    <div className="text-sm text-gray-500">{item.category}</div>
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
                    <div className="text-sm text-gray-500">
                      {item.lowStockThreshold} {item.unit}
                    </div>
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
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Create Purchase Request
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Purchase Payment Modal */}
      {selectedPurchaseRequest && (
        <PurchasePaymentModal
          purchaseRequest={selectedPurchaseRequest}
          onClose={() => setSelectedPurchaseRequest(null)}
          onPaymentSuccess={() => {
            // Refresh inventory and purchase requests
            fetchItems();
            fetchPurchaseRequests();
          }}
        />
      )}
    </>
  );
};

export default LowStockRecommendations;

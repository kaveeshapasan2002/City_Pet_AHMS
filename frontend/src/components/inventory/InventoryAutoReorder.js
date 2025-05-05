// frontend/src/components/inventory/InventoryAutoReorder.js
import React, { useState, useEffect } from 'react';
import { useInventory } from '../../context/InventoryContext';
import Spinner from '../common/Spinner';
import InAlert from '../common/InAlert';

const InventoryAutoReorder = () => {
  const { 
    lowStockItems, 
    fetchLowStockItems, 
    processAutoReorder, 
    reorderLoading,
    reorderResult
  } = useInventory();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  
  useEffect(() => {
    const loadLowStockItems = async () => {
      setLoading(true);
      try {
        await fetchLowStockItems();
        setError(null);
      } catch (err) {
        setError(err.toString());
      } finally {
        setLoading(false);
      }
    };
    
    loadLowStockItems();
  }, [fetchLowStockItems]);
  
  const handleAutoReorder = async () => {
    try {
      await processAutoReorder();
      setShowResults(true);
      setError(null);
    } catch (err) {
      setError(err.toString());
    }
  };
  
  if (loading && !lowStockItems.length) {
    return <Spinner />;
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Auto Inventory Reorder</h2>
      
      {error && <InAlert type="error" message={error} className="mb-4" />}
      
      <div className="mb-4">
        <p className="text-gray-600 mb-2">
          Found <span className="font-semibold">{lowStockItems.length}</span> items that are low in stock.
        </p>
        {lowStockItems.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
            <h3 className="text-yellow-800 font-semibold mb-2">Low Stock Items</h3>
            <div className="max-h-60 overflow-y-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-yellow-100">
                    <th className="text-left py-2 px-3">Item Name</th>
                    <th className="text-left py-2 px-3">Category</th>
                    <th className="text-left py-2 px-3">Current Quantity</th>
                    <th className="text-left py-2 px-3">Low Stock Threshold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-yellow-200">
                  {lowStockItems.map((item) => (
                    <tr key={item._id} className="hover:bg-yellow-50">
                      <td className="py-2 px-3">{item.name}</td>
                      <td className="py-2 px-3">{item.category}</td>
                      <td className="py-2 px-3">
                        <span className="font-semibold text-red-600">
                          {item.quantity} {item.unit}
                        </span>
                      </td>
                      <td className="py-2 px-3">{item.lowStockThreshold} {item.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <p className="text-gray-600 text-sm">
          Clicking "Auto Reorder" will create purchase requests and send emails to suppliers for all low stock items.
        </p>
        <button
          onClick={handleAutoReorder}
          disabled={reorderLoading || lowStockItems.length === 0}
          className={`flex items-center px-4 py-2 rounded-md text-white font-medium ${
            reorderLoading || lowStockItems.length === 0
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {reorderLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Auto Reorder
            </>
          )}
        </button>
      </div>
      
      {showResults && reorderResult && (
        <div className={`mt-6 p-4 rounded-md ${reorderResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <h3 className={`font-semibold mb-2 ${reorderResult.success ? 'text-green-800' : 'text-red-800'}`}>
            Reorder Results
          </h3>
          <p className="mb-2">{reorderResult.message}</p>
          
          {reorderResult.success && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-white p-3 rounded-md border border-gray-200">
                <p className="text-sm text-gray-500">Items Processed</p>
                <p className="text-2xl font-bold text-gray-800">{reorderResult.itemsProcessed}</p>
              </div>
              <div className="bg-white p-3 rounded-md border border-gray-200">
                <p className="text-sm text-gray-500">Emails Sent</p>
                <p className="text-2xl font-bold text-gray-800">{reorderResult.emailsSent}</p>
              </div>
            </div>
          )}
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setShowResults(false)}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryAutoReorder;
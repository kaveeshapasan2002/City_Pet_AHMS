// frontend/src/pages/FinancialManagement.js
import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import { usePurchaseRequest } from '../context/PurchaseRequestContext';
import InventoryStats from '../components/inventory/InventoryStats';
import PurchaseRequestTable from '../components/financial/PurchaseRequestTable';
import LowStockRecommendations from '../components/financial/LowStockRecommendations';

const FinancialManagement = () => {
  const { stats, fetchItems } = useInventory();
  const { 
    purchaseRequests, 
    fetchPurchaseRequests,
    loading: purchaseRequestLoading 
  } = usePurchaseRequest();

  const [activeTab, setActiveTab] = useState('overview');

  // Fetch initial data
  useEffect(() => {
    fetchItems();
    fetchPurchaseRequests();
  }, [fetchItems, fetchPurchaseRequests]);

  // Render tabs
  const renderTabs = () => {
    const tabs = [
      { key: 'overview', label: 'Overview' },
      { key: 'purchase-requests', label: 'Purchase Requests' },
      { key: 'low-stock', label: 'Low Stock Recommendations' }
    ];

    return (
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                py-4 px-1 text-sm font-medium 
                ${activeTab === tab.key 
                  ? 'border-indigo-500 text-indigo-600 border-b-2' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    );
  };

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Financial Overview</h2>
            <InventoryStats stats={stats} />
            
            {/* Quick Financial Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-500 text-sm font-medium mb-2">Total Inventory Value</h3>
                <div className="text-2xl font-bold text-green-600">${stats.inventoryValue.toFixed(2)}</div>
              </div>
              {/* Add more financial metrics as needed */}
            </div>
          </div>
        );
      
      case 'purchase-requests':
        return (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Purchase Requests</h2>
            <PurchaseRequestTable 
              purchaseRequests={purchaseRequests} 
              loading={purchaseRequestLoading} 
            />
          </div>
        );
      
      case 'low-stock':
        return (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Low Stock Recommendations</h2>
            <LowStockRecommendations />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Financial Management</h1>
        <p className="text-gray-600">Manage inventory, purchase requests, and financial insights</p>
      </div>

      {renderTabs()}
      {renderTabContent()}
    </div>
  );
};

export default FinancialManagement;
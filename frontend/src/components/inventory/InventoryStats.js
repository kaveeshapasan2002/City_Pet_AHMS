// frontend/src/components/inventory/InventoryStats.js
import React from 'react';

const InventoryStats = ({ stats }) => {
  const { totalItems, lowStockItems, categories, inventoryValue } = stats;

  const statCards = [
    {
      title: 'Total Items',
      value: totalItems,
      icon: (
        <div className="bg-blue-100 p-3 rounded-full">
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
          </svg>
        </div>
      ),
      color: 'text-blue-500'
    },
    {
      title: 'Low Stock Items',
      value: lowStockItems,
      icon: (
        <div className="bg-yellow-100 p-3 rounded-full">
          <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
      ),
      color: 'text-yellow-500'
    },
    {
      title: 'Categories',
      value: categories,
      icon: (
        <div className="bg-purple-100 p-3 rounded-full">
          <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
          </svg>
        </div>
      ),
      color: 'text-purple-500'
    },
    {
      title: 'Inventory Value',
      value: `$${inventoryValue.toFixed(2)}`,
      icon: (
        <div className="bg-green-100 p-3 rounded-full">
          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
      ),
      color: 'text-green-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            {stat.icon}
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InventoryStats;
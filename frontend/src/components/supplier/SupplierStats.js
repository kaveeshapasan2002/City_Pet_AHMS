// frontend/src/components/supplier/SupplierStats.js
import React from 'react';

const SupplierStats = ({ stats }) => {
  const { totalSuppliers, categories, categoryBreakdown } = stats;

  // Count suppliers by category for display
  const categoryStats = Object.entries(categoryBreakdown || {}).map(([category, count]) => ({
    category,
    count
  }));

  const statCards = [
    {
      title: 'Total Suppliers',
      value: totalSuppliers,
      icon: (
        <div className="bg-blue-100 p-3 rounded-full">
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
        </div>
      ),
      color: 'text-blue-500'
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
    }
  ];

  // Add category-specific stats
  const categoryColors = {
    Medication: { text: 'text-indigo-500', bg: 'bg-indigo-100' },
    Supply: { text: 'text-green-500', bg: 'bg-green-100' },
    Equipment: { text: 'text-yellow-500', bg: 'bg-yellow-100' },
    Food: { text: 'text-orange-500', bg: 'bg-orange-100' },
    Other: { text: 'text-gray-500', bg: 'bg-gray-100' }
  };

  // Add more statCards for each category
  if (categoryBreakdown && Object.keys(categoryBreakdown).length > 0) {
    const topCategories = categoryStats
      .sort((a, b) => b.count - a.count)
      .slice(0, 2); // Show top 2 categories
    
    topCategories.forEach(({ category, count }) => {
      const colors = categoryColors[category] || { text: 'text-gray-500', bg: 'bg-gray-100' };
      
      statCards.push({
        title: `${category} Suppliers`,
        value: count,
        icon: (
          <div className={`${colors.bg} p-3 rounded-full`}>
            <svg className={`w-6 h-6 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
        ),
        color: colors.text
      });
    });
  }

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

export default SupplierStats;
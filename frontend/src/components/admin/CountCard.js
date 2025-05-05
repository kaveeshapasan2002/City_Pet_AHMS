// src/components/admin/CountCard.js
import React from 'react';

const CountCard = ({ title, count, icon, color, percentage }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg overflow-hidden border-l-4 ${color}`}>
      <div className="p-4 flex items-center justify-between">
        <div>
          <p className="text-gray-500 font-medium text-sm uppercase">{title}</p>
          <p className="text-3xl font-bold mt-1">{count}</p>
          {percentage !== undefined && (
            <p className="text-sm text-gray-600 mt-1">
              {percentage}% of total users
            </p>
          )}
        </div>
        <div className={`text-${color.replace('border-', '')} p-3 rounded-full bg-gray-50`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default CountCard;
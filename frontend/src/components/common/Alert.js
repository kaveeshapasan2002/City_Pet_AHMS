// src/components/common/Alert.js
import React from 'react';

const Alert = ({ type = 'info', message, onClose }) => {
  const alertTypes = {
    success: 'bg-green-100 text-green-800 border-green-300',
    error: 'bg-red-100 text-red-800 border-red-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300',
  };

  return (
    <div className={`p-4 mb-4 rounded border ${alertTypes[type]}`}>
      <div className="flex justify-between items-center">
        <div className="flex-1">{message}</div>
        {onClose && (
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;

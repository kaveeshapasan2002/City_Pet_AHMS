// src/components/common/Button.js
import React from 'react';

const Button = ({ 
  type = 'button', 
  className = '', 
  onClick, 
  children, 
  disabled = false 
}) => {
  return (
    <button
      type={type}
      className={`px-4 py-2 rounded font-semibold text-white bg-blue-600 hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
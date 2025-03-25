import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const PaymentSuccessPage = () => {
  const location = useLocation();
  const { amount, itemName } = location.state || {};

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md w-full">
        <div className="mb-6">
          <svg 
            className="mx-auto h-16 w-16 text-green-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Payment Successful!
        </h1>
        
        {amount && itemName ? (
          <div className="mb-6">
            <p className="text-gray-600 mb-2">
              You have successfully paid 
              <span className="font-bold text-green-600"> ${amount.toFixed(2)}</span> 
              for <span className="font-bold">{itemName}</span>.
            </p>
          </div>
        ) : (
          <p className="text-gray-600 mb-6">
            Your payment has been processed successfully.
          </p>
        )}
        
        <div className="flex justify-center space-x-4">
          <Link 
            to="/financial-management"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Back to Financial Management
          </Link>
          <Link 
            to="/dashboard"
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
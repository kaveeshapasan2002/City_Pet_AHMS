// frontend/src/pages/FinancialManagement.js
import React from 'react';
import { Link } from 'react-router-dom';

const FinancialManagement = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Financial Management</h1>

      {/* Financial Services Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Financial Services</h2>
          <Link 
            to="/financial-management/invoices"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
          >
            Manage Invoices
          </Link>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Invoice Management */}
            <div className="bg-blue-50 p-4 rounded shadow-sm border border-blue-100">
              <h3 className="font-semibold text-lg mb-2">Invoice Management</h3>
              <p className="text-gray-600 mb-4">Create and manage invoices for veterinary services.</p>
              <Link 
                to="/financial-management/invoices"
                className="text-blue-500 hover:text-blue-700 font-medium"
              >
                View Invoices →
              </Link>
            </div>

            {/* Service Management */}
            <div className="bg-green-50 p-4 rounded shadow-sm border border-green-100">
              <h3 className="font-semibold text-lg mb-2">Service Management</h3>
              <p className="text-gray-600 mb-4">Create and manage veterinary services and pricing.</p>
              <Link 
                to="/financial-management/services"
                className="text-green-500 hover:text-green-700 font-medium"
              >
                Manage Services →
              </Link>
            </div>
            
            {/* Inventory Purchases - NEW CARD */}
            <div className="bg-orange-50 p-4 rounded shadow-sm border border-orange-100">
              <h3 className="font-semibold text-lg mb-2">Inventory Purchases</h3>
              <p className="text-gray-600 mb-4">Manage purchase requests and track inventory stock levels.</p>
              <Link 
                to="/financial-management/inventory-purchases"
                className="text-orange-500 hover:text-orange-700 font-medium"
              >
                View Purchases →
              </Link>
            </div>

            {/* Reports Placeholder */}
            <div className="bg-purple-50 p-4 rounded shadow-sm border border-purple-100">
              <h3 className="font-semibold text-lg mb-2">Financial Reports</h3>
              <p className="text-gray-600 mb-4">View and generate financial reports and analytics.</p>
              <span className="text-gray-500 italic">Coming soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialManagement;
// frontend/src/components/inventory/InventoryTable.js
import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import EditItemModal from './EditItemModal';
import DeleteConfirmModal from '../common/DeleteConfirmModal';

const InventoryTable = ({ items, viewMode, currentPage, totalPages, onPageChange }) => {
  const { deleteItem } = useInventory();
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  const handleEdit = (item) => {
    setEditingItem(item);
  };

  const handleDelete = (item) => {
    setDeletingItem(item);
  };

  const confirmDelete = async () => {
    if (deletingItem) {
      try {
        await deleteItem(deletingItem._id);
        setDeletingItem(null);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const getStatusColor = (quantity, threshold) => {
    if (quantity <= 0) return 'text-red-500';
    if (quantity <= threshold) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusIcon = (quantity, threshold) => {
    if (quantity <= 0) {
      return (
        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
        </svg>
      );
    } else if (quantity <= threshold) {
      return (
        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
        </svg>
      );
    } else {
      return (
        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
        </svg>
      );
    }
  };

  // Render different views based on viewMode
  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {items.length > 0 ? (
            items.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-2">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.category === 'Medication' ? 'bg-blue-100 text-blue-800' :
                    item.category === 'Supply' ? 'bg-purple-100 text-purple-800' :
                    item.category === 'Equipment' ? 'bg-yellow-100 text-yellow-800' :
                    item.category === 'Food' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.category}
                  </span>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(item.quantity, item.lowStockThreshold)}
                    <span className={`ml-1 ${getStatusColor(item.quantity, item.lowStockThreshold)}`}>
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">${item.unitPrice.toFixed(2)}</td>
                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">{item.location}</td>
                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">
                  {item.expiryDate 
                    ? new Date(item.expiryDate).toLocaleDateString() 
                    : <span className="text-gray-400">N/A</span>}
                </td>
                <td className="py-3 px-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="py-4 text-center text-gray-500">
                No items found. Add some inventory items to get started.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.length > 0 ? (
        items.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 truncate">{item.name}</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  item.category === 'Medication' ? 'bg-blue-100 text-blue-800' :
                  item.category === 'Supply' ? 'bg-purple-100 text-purple-800' :
                  item.category === 'Equipment' ? 'bg-yellow-100 text-yellow-800' :
                  item.category === 'Food' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {item.category}
                </span>
              </div>
              <div className="mt-4 flex items-center">
                <div className="flex-shrink-0">
                  {getStatusIcon(item.quantity, item.lowStockThreshold)}
                </div>
                <div className="ml-3">
                  <div className={`text-sm font-medium ${getStatusColor(item.quantity, item.lowStockThreshold)}`}>
                    {item.quantity} {item.unit}
                  </div>
                  <div className="text-sm text-gray-500">
                    ${item.unitPrice.toFixed(2)} per {item.unit}
                  </div>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                <div>Location: {item.location}</div>
                <div>
                  Expiry: {item.expiryDate 
                    ? new Date(item.expiryDate).toLocaleDateString() 
                    : 'N/A'}
                </div>
              </div>
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => handleEdit(item)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full py-4 text-center text-gray-500">
          No items found. Add some inventory items to get started.
        </div>
      )}
    </div>
  );

  return (
    <div>
      {viewMode === 'table' ? renderTableView() : renderCardView()}

      {/* Pagination */}
      {items.length > 0 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{currentPage}</span> of{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 ${
                    currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show pages around the current page
                  let page = currentPage - 2 + i;
                  if (page < 1) page += 5;
                  if (page > totalPages) page -= 5;
                  
                  // Ensure within range
                  if (page >= 1 && page <= totalPages) {
                    return (
                      <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === currentPage 
                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }
                  return null;
                })}
                <button
                  onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 ${
                    currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <EditItemModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingItem && (
        <DeleteConfirmModal
          title="Delete Inventory Item"
          message={`Are you sure you want to delete ${deletingItem.name}? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingItem(null)}
        />
      )}
    </div>
  );
};

export default InventoryTable;
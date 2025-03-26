// frontend/src/pages/Inventory.js
import React, { useEffect, useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import InventoryStats from '../components/inventory/InventoryStats';
import InventoryTable from '../components/inventory/InventoryTable';
import InventoryFilter from '../components/inventory/InventoryFilter';
import AddItemModal from '../components/inventory/AddItemModal';
import Spinner from '../components/common/Spinner';
import InAlert from '../components/common/InAlert';

const Inventory = () => {
  const {
    items,
    stats,
    pagination,
    loading,
    error,
    filters,
    fetchItems,
    updateFilters
  } = useInventory();

  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

  useEffect(() => {
    fetchItems(pagination.page, pagination.limit, filters);
  }, [fetchItems, pagination.page, pagination.limit, filters]);

  const handlePageChange = (newPage) => {
    fetchItems(newPage, pagination.limit, filters);
  };

  const handleSearch = (searchTerm) => {
    updateFilters({ search: searchTerm });
  };

  const handleCategoryFilter = (category) => {
    updateFilters({ category });
  };

  const handleLowStockFilter = (checked) => {
    updateFilters({ lowStock: checked });
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'table' ? 'cards' : 'table');
  };

  if (loading && items.length === 0) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
          <p className="text-gray-600">Manage and monitor your animal hospital inventory</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add New Item
        </button>
      </div>

      {error && <InAlert type="error" message={error} />}

      <InventoryStats stats={stats} />

      <div className="mb-6">
        <InventoryFilter 
          onSearch={handleSearch} 
          onCategoryChange={handleCategoryFilter} 
          onLowStockChange={handleLowStockFilter}
          currentCategory={filters.category}
          lowStockChecked={filters.lowStock}
          searchValue={filters.search}
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={toggleViewMode}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            {viewMode === 'table' ? (
              <>
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                </svg>
                Cards
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd"></path>
                </svg>
                Table
              </>
            )}
          </button>
        </div>
      </div>

      <InventoryTable 
        items={items} 
        viewMode={viewMode}
        currentPage={pagination.page}
        totalPages={pagination.pages}
        onPageChange={handlePageChange}
      />

      {showAddModal && (
        <AddItemModal 
          onClose={() => setShowAddModal(false)}
          onAddSuccess={() => {
            setShowAddModal(false);
            fetchItems(1, pagination.limit, filters);
          }}
        />
      )}
    </div>
  );
};

export default Inventory;
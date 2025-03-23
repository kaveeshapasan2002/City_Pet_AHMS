// frontend/src/components/inventory/InventoryFilter.js
import React, { useState, useEffect } from 'react';

const InventoryFilter = ({
  onSearch,
  onCategoryChange,
  onLowStockChange,
  currentCategory = '',
  lowStockChecked = false,
  searchValue = ''
}) => {
  const [search, setSearch] = useState(searchValue);
  const [category, setCategory] = useState(currentCategory);
  const [lowStock, setLowStock] = useState(lowStockChecked);

  useEffect(() => {
    setSearch(searchValue);
    setCategory(currentCategory);
    setLowStock(lowStockChecked);
  }, [searchValue, currentCategory, lowStockChecked]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(search);
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    onCategoryChange(selectedCategory);
  };

  const handleLowStockChange = (e) => {
    const checked = e.target.checked;
    setLowStock(checked);
    onLowStockChange(checked);
  };

  const categories = [
    { value: '', label: 'All categories' },
    { value: 'Medication', label: 'Medication' },
    { value: 'Supply', label: 'Supply' },
    { value: 'Equipment', label: 'Equipment' },
    { value: 'Food', label: 'Food' },
    { value: 'Other', label: 'Other' }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                name="search"
                id="search"
                value={search}
                onChange={handleSearchChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search items..."
              />
            </div>
          </form>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
          {/* Categories Dropdown */}
          <div className="flex items-center space-x-2">
            <label htmlFor="category-filter" className="text-sm font-medium text-gray-700">
              Filter by:
            </label>
            <select
              id="category-filter"
              name="category"
              value={category}
              onChange={handleCategoryChange}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Low Stock Toggle */}
          <div className="flex items-center">
            <input
              id="low-stock"
              name="low-stock"
              type="checkbox"
              checked={lowStock}
              onChange={handleLowStockChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="low-stock" className="ml-2 block text-sm text-gray-700">
              Low stock only
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryFilter;
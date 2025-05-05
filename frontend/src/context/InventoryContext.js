// frontend/src/context/InventoryContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import inventoryService from '../services/inventoryService';
import { toast } from 'react-toastify';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockItems: 0,
    categories: 0,
    inventoryValue: 0
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    lowStock: false
  });
  const [lowStockItems, setLowStockItems] = useState([]);
  const [reorderLoading, setReorderLoading] = useState(false);
  const [reorderResult, setReorderResult] = useState(null);

  // Get all inventory items
  const fetchItems = useCallback(async (page = 1, limit = 10, filterParams = filters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await inventoryService.getInventoryItems(page, limit, filterParams);
      setItems(data.items);
      setPagination(data.pagination);
      setStats(data.stats);
      setLoading(false);
    } catch (err) {
      setError(err.toString());
      setLoading(false);
    }
  }, [filters]);

  // Get item by ID
  const fetchItemById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await inventoryService.getInventoryItemById(id);
      setCurrentItem(data);
      setLoading(false);
    } catch (err) {
      setError(err.toString());
      setLoading(false);
    }
  }, []);

  // Create new item
  const createItem = useCallback(async (itemData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await inventoryService.createInventoryItem(itemData);
      setItems([data, ...items]);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.toString());
      setLoading(false);
      throw err;
    }
  }, [items]);

  // Update item
  const updateItem = useCallback(async (id, itemData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await inventoryService.updateInventoryItem(id, itemData);
      setItems(items.map(item => item._id === id ? data : item));
      setCurrentItem(data);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.toString());
      setLoading(false);
      throw err;
    }
  }, [items]);

  // Delete item
  const deleteItem = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await inventoryService.deleteInventoryItem(id);
      setItems(items.filter(item => item._id !== id));
      setLoading(false);
    } catch (err) {
      setError(err.toString());
      setLoading(false);
      throw err;
    }
  }, [items]);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Get low stock items
  const fetchLowStockItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await inventoryService.getLowStockItems();
      setLowStockItems(data.items);
      setLoading(false);
      return data.items;
    } catch (err) {
      setError(err.toString());
      setLoading(false);
      throw err;
    }
  }, []);

  // Process auto reorder
  const processAutoReorder = useCallback(async () => {
    setReorderLoading(true);
    setError(null);
    try {
      const result = await inventoryService.processAutoReorder();
      setReorderResult(result);
      setReorderLoading(false);
      
      // Show success toast notification
      toast.success(`Successfully processed ${result.itemsProcessed} low stock items and sent ${result.emailsSent} supplier emails.`);
      
      return result;
    } catch (err) {
      setError(err.toString());
      setReorderLoading(false);
      
      // Show error toast notification
      toast.error(`Error processing auto reorder: ${err.toString()}`);
      
      throw err;
    }
  }, []);

  return (
    <InventoryContext.Provider
      value={{
        items,
        currentItem,
        stats,
        pagination,
        loading,
        error,
        filters,
        lowStockItems,
        reorderLoading,
        reorderResult,
        fetchItems,
        fetchItemById,
        createItem,
        updateItem,
        deleteItem,
        updateFilters,
        fetchLowStockItems,
        processAutoReorder
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);
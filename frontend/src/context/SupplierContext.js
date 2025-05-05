// frontend/src/context/SupplierContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import supplierService from '../services/supplierService';

const SupplierContext = createContext();

export const SupplierProvider = ({ children }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [currentSupplier, setCurrentSupplier] = useState(null);
  const [stats, setStats] = useState({
    totalSuppliers: 0,
    categories: 0,
    categoryBreakdown: {}
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
    search: ''
  });

  // Get all suppliers
  const fetchSuppliers = useCallback(async (page = 1, limit = 10, filterParams = filters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await supplierService.getSuppliers(page, limit, filterParams);
      setSuppliers(data.suppliers);
      setPagination(data.pagination);
      setStats(data.stats);
      setLoading(false);
    } catch (err) {
      setError(err.toString());
      setLoading(false);
    }
  }, [filters]);

  // Get supplier by ID
  const fetchSupplierById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await supplierService.getSupplierById(id);
      setCurrentSupplier(data);
      setLoading(false);
    } catch (err) {
      setError(err.toString());
      setLoading(false);
    }
  }, []);

  // Create new supplier
  const createSupplier = useCallback(async (supplierData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await supplierService.createSupplier(supplierData);
      setSuppliers([data, ...suppliers]);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.toString());
      setLoading(false);
      throw err;
    }
  }, [suppliers]);

  // Update supplier
  const updateSupplier = useCallback(async (id, supplierData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await supplierService.updateSupplier(id, supplierData);
      setSuppliers(suppliers.map(supplier => supplier._id === id ? data : supplier));
      setCurrentSupplier(data);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.toString());
      setLoading(false);
      throw err;
    }
  }, [suppliers]);

  // Delete supplier
  const deleteSupplier = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await supplierService.deleteSupplier(id);
      setSuppliers(suppliers.filter(supplier => supplier._id !== id));
      setLoading(false);
    } catch (err) {
      setError(err.toString());
      setLoading(false);
      throw err;
    }
  }, [suppliers]);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return (
    <SupplierContext.Provider
      value={{
        suppliers,
        currentSupplier,
        stats,
        pagination,
        loading,
        error,
        filters,
        fetchSuppliers,
        fetchSupplierById,
        createSupplier,
        updateSupplier,
        deleteSupplier,
        updateFilters
      }}
    >
      {children}
    </SupplierContext.Provider>
  );
};

export const useSupplier = () => useContext(SupplierContext);
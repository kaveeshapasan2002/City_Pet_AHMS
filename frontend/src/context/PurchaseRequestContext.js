// frontend/src/context/PurchaseRequestContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import purchaseRequestService from '../services/purchaseRequestService';

const PurchaseRequestContext = createContext();

export const PurchaseRequestProvider = ({ children }) => {
  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create a new purchase request
  const createPurchaseRequest = useCallback(async (requestData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await purchaseRequestService.createPurchaseRequest(requestData);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.toString());
      setLoading(false);
      throw err;
    }
  }, []);

  // Fetch purchase requests
  const fetchPurchaseRequests = useCallback(async (status) => {
    setLoading(true);
    setError(null);
    try {
      const data = await purchaseRequestService.getPurchaseRequests(status);
      setPurchaseRequests(data);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.toString());
      setLoading(false);
      throw err;
    }
  }, []);

  // Update purchase request status
  const updatePurchaseRequestStatus = useCallback(async (id, statusData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await purchaseRequestService.updatePurchaseRequestStatus(id, statusData);
      setPurchaseRequests(prev => 
        prev.map(request => request._id === id ? data : request)
      );
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.toString());
      setLoading(false);
      throw err;
    }
  }, []);

  // Delete purchase request
  const deletePurchaseRequest = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await purchaseRequestService.deletePurchaseRequest(id);
      setPurchaseRequests(prev => prev.filter(request => request._id !== id));
      setLoading(false);
    } catch (err) {
      setError(err.toString());
      setLoading(false);
      throw err;
    }
  }, []);

  // Process purchase payment
  const processPurchasePayment = useCallback(async (requestId, paymentDetails) => {
    setLoading(true);
    setError(null);
    try {
      const response = await purchaseRequestService.processPurchasePayment(
        requestId, 
        paymentDetails
      );
      
      // Remove the completed request from the list
      setPurchaseRequests(prev => 
        prev.filter(request => request._id !== requestId)
      );

      setLoading(false);
      return response;
    } catch (error) {
      setError(error.toString());
      setLoading(false);
      console.error('Payment processing failed', error);
      throw error;
    }
  }, []);

  // Approve purchase request - add this function
  const approvePurchaseRequest = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await purchaseRequestService.approvePurchaseRequest(id);
      
      // Update the request in the current list
      setPurchaseRequests(prev => 
        prev.map(request => request._id === id ? data : request)
      );
      
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.toString());
      setLoading(false);
      throw err;
    }
  }, []);

  return (
    <PurchaseRequestContext.Provider
      value={{
        purchaseRequests,
        loading,
        error,
        createPurchaseRequest,
        fetchPurchaseRequests,
        updatePurchaseRequestStatus,
        deletePurchaseRequest,
        processPurchasePayment,
        approvePurchaseRequest // Make sure to include this in the provided value
      }}
    >
      {children}
    </PurchaseRequestContext.Provider>
  );
};

export const usePurchaseRequest = () => useContext(PurchaseRequestContext);
// src/components/financial/InvoiceForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createInvoice, updateInvoice, getInvoiceById, getAllServices } from '../../api/invoice';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import PhoneSearch from '../common/PhoneSearch'; // Import the new component

const InvoiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditMode = !!id;
  
  // Form state
  const [petOptions, setPetOptions] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [clientFieldsReadOnly, setClientFieldsReadOnly] = useState(false);
  
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    clientId: '',
    clientName: '',
    clientContact: '',
    clientEmail: '',
    items: [
      {
        service: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        amount: 0
      }
    ],
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    discountAmount: 0,
    total: 0,
    notes: ''
  });
  
   // Handle when client is found via phone search
   const handleClientFound = (client) => {
    if (client) {
      // Fill client details
      setFormData(prev => ({
        ...prev,
        clientId: client._id,
        clientName: client.name,
        clientEmail: client.email || '',
        clientContact: client.phonenumber
      }));
      setClientFieldsReadOnly(true);
    } else {
      // No client found, clear any existing client data and allow manual entry
      setFormData(prev => ({
        ...prev,
        clientId: '',
        clientName: '',
        clientEmail: ''
      }));
      setClientFieldsReadOnly(false);
    }
  };
  
  // Handle when pets are found via phone search
  const handlePetsFound = (pets) => {
    if (pets.length > 0) {
      // If there's just one pet, auto-select it
      if (pets.length === 1) {
        const pet = pets[0];
        setFormData(prev => ({
          ...prev,
          patientId: pet.id,
          patientName: pet.name
        }));
      }
      
      // Reorder pet options to show matching pets first
      const reorderedPets = [
        ...pets,
        ...petOptions.filter(pet => !pets.some(mp => mp.id === pet.id))
      ];
      setPetOptions(reorderedPets);
    }
  };
  // Fetch pets and services on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setInitialLoading(true);
        
        // Fetch services
        const servicesResponse = await getAllServices();
        setServices(servicesResponse.services || []);
        
        // Fetch pets using correct API endpoint
        const petsResponse = await axios.get('http://localhost:5001/pets', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        console.log("Pet data received:", petsResponse.data);
        
        if (petsResponse.data && petsResponse.data.pets) {
          // Format pet options - no need to fetch owners here
          setPetOptions(petsResponse.data.pets.map(pet => ({
            id: pet.id,
            name: pet.name,
            contact: pet.contact,
            species: pet.species,
            breed: pet.breed
          })));
        }
        
        // If in edit mode, fetch invoice data
        if (isEditMode) {
          const invoiceResponse = await getInvoiceById(id);
          if (invoiceResponse.invoice) {
            setFormData(invoiceResponse.invoice);
            
            // If client fields exist, set them as read-only
            if (invoiceResponse.invoice.clientId) {
              setClientFieldsReadOnly(true);
            }
          }
        }
        
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
        toast.error('Failed to load data. Please try again.');
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchInitialData();
  }, [id, isEditMode]);
  
  // Calculate totals when items, tax rate, or discount changes
  useEffect(() => {
    const calculateTotals = () => {
      // Calculate subtotal
      const subtotal = formData.items.reduce(
        (sum, item) => sum + (item.amount || 0), 
        0
      );
      
      // Calculate tax amount
      const taxAmount = (subtotal * formData.taxRate) / 100;
      
      // Calculate total
      const total = subtotal + taxAmount - (formData.discountAmount || 0);
      
      setFormData(prev => ({
        ...prev,
        subtotal,
        taxAmount,
        total
      }));
    };
    
    calculateTotals();
  }, [formData.items, formData.taxRate, formData.discountAmount]);
  
  // Handle pet selection
const handlePetSelect = async (e) => {
  const petId = e.target.value;
  const selectedPet = petOptions.find(pet => pet.id === petId);
  
  if (selectedPet) {
    // Set pet information first
    setFormData({
      ...formData,
      patientId: selectedPet.id,
      patientName: selectedPet.name,
      clientContact: selectedPet.contact.toString(),
    });
    
    // Try to find a matching user by phone number using the new endpoint
    try {
      // Format the phone number for query - convert to string and handle possible formats
      const petContactStr = selectedPet.contact.toString();
      
      // Try multiple phone number formats
      const possiblePhoneFormats = [
        petContactStr,                    // Original format (e.g. 767856921)
        `0${petContactStr}`,              // With leading zero (e.g. 0767856921)
        petContactStr.replace(/^0+/, '')  // Without leading zeros (if any exist)
      ];
      
      console.log(`Searching for pet owner with phone numbers:`, possiblePhoneFormats);
      
      // Try each phone format until we find a match
      let foundUser = null;
      
      for (const phoneFormat of possiblePhoneFormats) {
        if (foundUser) break; // Skip if we already found a user
        
        const response = await axios.get('http://localhost:5001/api/invoice-users/petowners', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          params: {
            phonenumber: phoneFormat
          }
        });
        
        console.log(`Search response for number ${phoneFormat}:`, response.data);
        
        if (response.data.users && response.data.users.length > 0) {
          foundUser = response.data.users[0];
        }
      }
      
      if (foundUser) {
        console.log("Matching pet owner found:", foundUser);
        
        // We found a matching user, update client information
        setFormData(prev => ({
          ...prev,
          clientId: foundUser._id,
          clientName: foundUser.name,
          clientEmail: foundUser.email || '',
        }));
        setClientFieldsReadOnly(true);
      } else {
        console.log("No matching pet owner found after trying multiple formats. Manual entry required.");
        // No matching user found, enable manual client info entry
        setFormData(prev => ({
          ...prev,
          clientId: '',
          clientName: '',
          clientEmail: '',
        }));
        setClientFieldsReadOnly(false);
      }
    } catch (error) {
      console.error('Failed to find matching pet owner:', error);
      // Continue with manual entry if API call fails
      setFormData(prev => ({
        ...prev,
        clientId: '',
        clientName: '',
        clientEmail: '',
      }));
      setClientFieldsReadOnly(false);
    }
  }
};
  
  // Handle item changes
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    
    // If service is selected, update the description and unit price
    if (field === 'service') {
      const selectedService = services.find(s => s._id === value);
      if (selectedService) {
        updatedItems[index].description = selectedService.description;
        updatedItems[index].unitPrice = selectedService.cost;
        // Recalculate amount
        updatedItems[index].amount = selectedService.cost * updatedItems[index].quantity;
      }
    }
    
    // If quantity or unitPrice changes, update amount
    if (field === 'quantity' || field === 'unitPrice') {
      updatedItems[index].amount = 
        parseFloat(updatedItems[index].quantity) * 
        parseFloat(updatedItems[index].unitPrice);
    }
    
    setFormData({
      ...formData,
      items: updatedItems
    });
  };
  
  // Add new item
  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          service: '',
          description: '',
          quantity: 1,
          unitPrice: 0,
          amount: 0
        }
      ]
    });
  };
  
  // Remove item
  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      items: updatedItems
    });
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Validate required fields
      if (!formData.patientId) {
        toast.error('Please select a patient');
        setLoading(false);
        return;
      }
      
      // If no client ID but client fields are filled manually, that's okay
      if (!formData.clientId && (!formData.clientName || !formData.clientContact)) {
        toast.error('Please provide client information');
        setLoading(false);
        return;
      }
      
      if (formData.items.length === 0 || formData.items.some(item => !item.description)) {
        toast.error('Please add at least one service item with a description');
        setLoading(false);
        return;
      }
      
      // Process form submission
      const submitData = {
        ...formData,
        createdBy: user._id
      };
      
      let response;
      if (isEditMode) {
        response = await updateInvoice(id, submitData);
        toast.success('Invoice updated successfully');
      } else {
        response = await createInvoice(submitData);
        toast.success('Invoice created successfully');
      }
      
      // Navigate to invoice details page
      navigate(`/financial-management/invoices/${response.invoice._id}`);
      
    } catch (error) {
      console.error('Failed to save invoice:', error);
      toast.error('Failed to save invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (initialLoading) {
    return (
      <div className="container mx-auto px-4 py-6 flex justify-center items-center">
        <svg 
          className="animate-spin h-8 w-8 text-blue-500" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          ></circle>
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Invoice' : 'Create New Invoice'}
      </h1>
      
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        {/* Phone Search Component - Only show in create mode */}
        {!isEditMode && (
          <PhoneSearch 
            onClientFound={handleClientFound}
            onPetsFound={handlePetsFound}
            petOptions={petOptions}
          />
        )}
        {/* Patient and Client Information */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Patient & Client Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Patient</label>
              <select
                value={formData.patientId}
                onChange={handlePetSelect}
                className="w-full p-2 border rounded"
                disabled={isEditMode}
                required
              >
                <option value="">Select Patient</option>
                {petOptions.map(pet => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name} ({pet.species}, {pet.breed})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Client Name</label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${clientFieldsReadOnly ? 'bg-gray-50' : ''}`}
                readOnly={clientFieldsReadOnly}
                placeholder="Client Name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Contact</label>
              <input
                type="text"
                name="clientContact"
                value={formData.clientContact}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${clientFieldsReadOnly ? 'bg-gray-50' : ''}`}
                readOnly={clientFieldsReadOnly}
                placeholder="Client Contact Number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="clientEmail"
                value={formData.clientEmail}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${clientFieldsReadOnly ? 'bg-gray-50' : ''}`}
                readOnly={clientFieldsReadOnly}
                placeholder="Client Email"
              />
            </div>
          </div>
        </div>
        
        {/* Invoice Items */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Invoice Items</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 border">Service</th>
                  <th className="px-4 py-2 border">Description</th>
                  <th className="px-4 py-2 border w-20">Qty</th>
                  <th className="px-4 py-2 border w-24">Unit Price</th>
                  <th className="px-4 py-2 border w-24">Amount</th>
                  <th className="px-4 py-2 border w-20">Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border">
                      <select
                        value={item.service}
                        onChange={(e) => handleItemChange(index, 'service', e.target.value)}
                        className="w-full p-1 border rounded"
                      >
                        <option value="">Select Service</option>
                        {services.map(service => (
                          <option key={service._id} value={service._id}>
                            {service.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2 border">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        className="w-full p-1 border rounded"
                        placeholder="Description"
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-2 border text-right">
                      ${item.amount ? item.amount.toFixed(2) : '0.00'}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <button
            type="button"
            onClick={addItem}
            className="mt-3 bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded flex items-center text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Item
          </button>
        </div>
        
        {/* Invoice Totals and Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">Notes</h2>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows="4"
              placeholder="Additional notes..."
            ></textarea>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-3">Invoice Summary</h2>
            <div className="bg-gray-50 p-4 rounded border">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>${formData.subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <span>Tax Rate (%):</span>
                <input
                  type="number"
                  name="taxRate"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.taxRate}
                  onChange={handleInputChange}
                  className="w-20 p-1 border rounded text-right"
                />
              </div>
              
              <div className="flex justify-between mb-2">
                <span>Tax Amount:</span>
                <span>${formData.taxAmount.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <span>Discount:</span>
                <input
                  type="number"
                  name="discountAmount"
                  min="0"
                  step="0.01"
                  value={formData.discountAmount}
                  onChange={handleInputChange}
                  className="w-20 p-1 border rounded text-right"
                />
              </div>
              
              <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                <span>Total:</span>
                <span>${formData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate('/financial-management/invoices')}
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 
              'Saving...' : 
              isEditMode ? 'Update Invoice' : 'Create Invoice'
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;
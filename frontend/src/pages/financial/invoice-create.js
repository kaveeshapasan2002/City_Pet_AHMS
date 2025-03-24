import React, { useState, useEffect } from 'react';
import { 
  Save, 
  PlusCircle, 
  Trash2, 
  ArrowLeft, 
  FileText,
  Search
} from 'lucide-react';

const InvoiceCreate = () => {
  // Form state
  const [invoice, setInvoice] = useState({
    patientId: '',
    patientName: '',
    patientType: '',
    ownerId: '',
    ownerName: '',
    invoiceDate: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().slice(0, 10),
    items: [{ description: '', quantity: 1, unitPrice: 0, amount: 0 }],
    notes: '',
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    discount: 0,
    totalAmount: 0,
    status: 'draft'
  });

  // For patient search functionality
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [patientSearchResults, setPatientSearchResults] = useState([]);
  const [showPatientSearch, setShowPatientSearch] = useState(false);

  // Sample data for development
  const samplePatients = [
    { id: 'P001', name: 'Max', type: 'Dog', ownerId: 'O001', ownerName: 'John Smith' },
    { id: 'P002', name: 'Bella', type: 'Cat', ownerId: 'O002', ownerName: 'Sarah Johnson' },
    { id: 'P003', name: 'Rocky', type: 'Dog', ownerId: 'O003', ownerName: 'Mike Thompson' },
    { id: 'P004', name: 'Luna', type: 'Bird', ownerId: 'O004', ownerName: 'Emily Wilson' },
    { id: 'P005', name: 'Charlie', type: 'Rabbit', ownerId: 'O005', ownerName: 'Jessica Brown' }
  ];

  // Sample services with prices
  const sampleServices = [
    { id: 'S001', description: 'General Checkup', price: 150.00 },
    { id: 'S002', description: 'Vaccination', price: 85.00 },
    { id: 'S003', description: 'Dental Cleaning', price: 225.50 },
    { id: 'S004', description: 'X-Ray', price: 350.00 },
    { id: 'S005', description: 'Blood Test', price: 120.00 },
    { id: 'S006', description: 'Nail Trimming', price: 35.00 },
    { id: 'S007', description: 'Microchipping', price: 75.00 },
    { id: 'S008', description: 'Surgery - Minor', price: 350.00 },
    { id: 'S009', description: 'Surgery - Major', price: 850.00 },
    { id: 'S010', description: 'Grooming', price: 65.00 }
  ];

  // Calculate totals when items change
  useEffect(() => {
    calculateInvoiceTotals();
  }, [invoice.items, invoice.taxRate, invoice.discount]);

  // Search patients based on search term
  useEffect(() => {
    if (patientSearchTerm.length > 0) {
      const results = samplePatients.filter(patient => 
        patient.name.toLowerCase().includes(patientSearchTerm.toLowerCase()) ||
        patient.ownerName.toLowerCase().includes(patientSearchTerm.toLowerCase())
      );
      setPatientSearchResults(results);
    } else {
      setPatientSearchResults([]);
    }
  }, [patientSearchTerm]);

  // Handle item changes
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...invoice.items];
    
    if (field === 'description' && value) {
      // Check if it's a predefined service
      const service = sampleServices.find(s => s.description === value);
      if (service) {
        updatedItems[index] = {
          ...updatedItems[index],
          description: service.description,
          unitPrice: service.price,
          amount: service.price * updatedItems[index].quantity
        };
      } else {
        updatedItems[index] = {
          ...updatedItems[index],
          [field]: value
        };
      }
    } else {
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value
      };
    }
    
    // Calculate amount if quantity or unitPrice changed
    if (field === 'quantity' || field === 'unitPrice') {
      updatedItems[index].amount = 
        parseFloat(updatedItems[index].quantity) * 
        parseFloat(updatedItems[index].unitPrice);
    }
    
    setInvoice({
      ...invoice,
      items: updatedItems
    });
  };

  // Add a new item row
  const addItem = () => {
    setInvoice({
      ...invoice,
      items: [...invoice.items, { description: '', quantity: 1, unitPrice: 0, amount: 0 }]
    });
  };

  // Remove an item row
  const removeItem = (index) => {
    if (invoice.items.length === 1) {
      return; // Keep at least one item
    }
    
    const updatedItems = invoice.items.filter((_, i) => i !== index);
    setInvoice({
      ...invoice,
      items: updatedItems
    });
  };

  // Calculate invoice totals
  const calculateInvoiceTotals = () => {
    const subtotal = invoice.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const taxAmount = (subtotal * parseFloat(invoice.taxRate || 0)) / 100;
    const totalAmount = subtotal + taxAmount - parseFloat(invoice.discount || 0);
    
    setInvoice({
      ...invoice,
      subtotal,
      taxAmount,
      totalAmount
    });
  };

  // Handle patient selection
  const handleSelectPatient = (patient) => {
    setInvoice({
      ...invoice,
      patientId: patient.id,
      patientName: patient.name,
      patientType: patient.type,
      ownerId: patient.ownerId,
      ownerName: patient.ownerName
    });
    setShowPatientSearch(false);
    setPatientSearchTerm('');
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to save the invoice
    console.log('Saving invoice:', invoice);
    // navigate('/financial/invoices'); // Redirect after save
  };

  // Handle save as draft
  const handleSaveAsDraft = () => {
    console.log('Saving as draft:', invoice);
    // API call would go here
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button 
            onClick={() => console.log('Go back')} 
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Create New Invoice</h1>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handleSaveAsDraft}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Save as Draft
          </button>
          <button 
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700"
          >
            <Save size={16} className="mr-2" /> Save & Issue
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          {/* Patient and Owner Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-medium text-gray-700 mb-3">Patient Information</h2>
              <div className="relative">
                <div className="flex mb-4">
                  <input
                    type="text"
                    placeholder="Search for patient..."
                    value={invoice.patientId ? `${invoice.patientName} (${invoice.patientType})` : patientSearchTerm}
                    onChange={(e) => {
                      if (!invoice.patientId) {
                        setPatientSearchTerm(e.target.value);
                        setShowPatientSearch(true);
                      }
                    }}
                    className="px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => setShowPatientSearch(true)}
                  />
                  {invoice.patientId && (
                    <button
                      type="button"
                      onClick={() => {
                        setInvoice({
                          ...invoice,
                          patientId: '',
                          patientName: '',
                          patientType: '',
                          ownerId: '',
                          ownerName: ''
                        });
                        setPatientSearchTerm('');
                      }}
                      className="ml-2 text-gray-500 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
                
                {showPatientSearch && patientSearchResults.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-300 max-h-60 overflow-y-auto">
                    {patientSearchResults.map((patient) => (
                      <div
                        key={patient.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelectPatient(patient)}
                      >
                        <div className="font-medium">{patient.name} ({patient.type})</div>
                        <div className="text-xs text-gray-500">Owner: {patient.ownerName}</div>
                      </div>
                    ))}
                  </div>
                )}
                
                {showPatientSearch && patientSearchTerm && patientSearchResults.length === 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-300 p-4">
                    <p className="text-gray-500">No patients found. <button className="text-blue-500 hover:underline">Add new patient</button></p>
                  </div>
                )}
              </div>
              
              {invoice.patientId && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <div className="text-sm">
                    <p><span className="font-medium">Patient:</span> {invoice.patientName} ({invoice.patientType})</p>
                    <p><span className="font-medium">Owner:</span> {invoice.ownerName}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-lg font-medium text-gray-700 mb-3">Invoice Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    value={invoice.invoiceDate}
                    onChange={(e) => setInvoice({...invoice, invoiceDate: e.target.value})}
                    className="px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={invoice.dueDate}
                    onChange={(e) => setInvoice({...invoice, dueDate: e.target.value})}
                    className="px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Invoice Items */}
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-700 mb-3">Invoice Items</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 mb-3">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="relative px-3 py-3 w-10">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoice.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <select
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          className="border border-gray-300 rounded-md px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select service...</option>
                          {sampleServices.map(service => (
                            <option key={service.id} value={service.description}>
                              {service.description}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                          className="border border-gray-300 rounded-md px-3 py-1 w-20 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="border border-gray-300 rounded-md px-3 py-1 w-28 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right">
                        ${item.amount ? item.amount.toFixed(2) : '0.00'}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-500 hover:text-red-700"
                          disabled={invoice.items.length === 1}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <button
              type="button"
              onClick={addItem}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <PlusCircle size={16} className="mr-1" /> Add Item
            </button>
          </div>
          
          {/* Invoice Summary and Totals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium text-gray-700 mb-3">Notes</h2>
              <textarea
                value={invoice.notes}
                onChange={(e) => setInvoice({...invoice, notes: e.target.value})}
                placeholder="Add notes or special instructions..."
                rows={4}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            
            <div>
              <h2 className="text-lg font-medium text-gray-700 mb-3">Summary</h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${invoice.subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Tax Rate (%):</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={invoice.taxRate}
                    onChange={(e) => setInvoice({...invoice, taxRate: parseFloat(e.target.value) || 0})}
                    className="border border-gray-300 rounded-md px-3 py-1 w-20 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Tax Amount:</span>
                  <span className="font-medium">${invoice.taxAmount.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Discount:</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={invoice.discount}
                    onChange={(e) => setInvoice({...invoice, discount: parseFloat(e.target.value) || 0})}
                    className="border border-gray-300 rounded-md px-3 py-1 w-20 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex justify-between pt-4 border-t border-gray-200 mt-2">
                  <span className="font-semibold text-gray-700">Total Amount:</span>
                  <span className="font-bold text-xl">${invoice.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceCreate;
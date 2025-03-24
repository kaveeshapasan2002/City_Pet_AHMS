import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  CreditCard,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// This would be replaced with your API service call
// import { fetchInvoices } from '../../api/invoiceService';

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Mock data for development
  const mockInvoices = [
    {
      id: 'INV-2023-001',
      patientName: 'Max',
      patientType: 'Dog',
      ownerName: 'John Smith',
      date: '2023-03-15',
      totalAmount: 450.00,
      status: 'paid',
      items: [
        { description: 'General Checkup', amount: 150.00 },
        { description: 'Vaccinations', amount: 200.00 },
        { description: 'Medications', amount: 100.00 }
      ]
    },
    {
      id: 'INV-2023-002',
      patientName: 'Bella',
      patientType: 'Cat',
      ownerName: 'Sarah Johnson',
      date: '2023-03-16',
      totalAmount: 275.50,
      status: 'pending',
      items: [
        { description: 'Dental Cleaning', amount: 225.50 },
        { description: 'Pain Medication', amount: 50.00 }
      ]
    },
    {
      id: 'INV-2023-003',
      patientName: 'Rocky',
      patientType: 'Dog',
      ownerName: 'Mike Thompson',
      date: '2023-03-17',
      totalAmount: 780.00,
      status: 'overdue',
      items: [
        { description: 'X-Ray', amount: 350.00 },
        { description: 'Surgery - Leg Fracture', amount: 400.00 },
        { description: 'Post-Surgery Meds', amount: 30.00 }
      ]
    },
    {
      id: 'INV-2023-004',
      patientName: 'Luna',
      patientType: 'Bird',
      ownerName: 'Emily Wilson',
      date: '2023-03-18',
      totalAmount: 120.75,
      status: 'partially_paid',
      paidAmount: 50.00,
      items: [
        { description: 'Wing Inspection', amount: 85.75 },
        { description: 'Beak Trimming', amount: 35.00 }
      ]
    },
    {
      id: 'INV-2023-005',
      patientName: 'Charlie',
      patientType: 'Rabbit',
      ownerName: 'Jessica Brown',
      date: '2023-03-20',
      totalAmount: 195.25,
      status: 'draft',
      items: [
        { description: 'Dietary Consultation', amount: 125.25 },
        { description: 'Nail Trimming', amount: 70.00 }
      ]
    }
  ];

  // Fetch invoices on component mount
  useEffect(() => {
    // In a real application, you would fetch from your API
    // const fetchData = async () => {
    //   try {
    //     setLoading(true);
    //     const response = await fetchInvoices(currentPage, filterStatus, searchTerm);
    //     setInvoices(response.data);
    //     setTotalPages(response.totalPages);
    //   } catch (error) {
    //     console.error('Error fetching invoices:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    
    // For development, use mock data
    const fetchMockData = () => {
      setLoading(true);
      setTimeout(() => {
        setInvoices(mockInvoices);
        setTotalPages(3); // Mock pagination
        setLoading(false);
      }, 500); // Simulate network delay
    };

    fetchMockData();
  }, [currentPage, filterStatus, searchTerm]);

  // Filter invoices based on search term
  const filteredInvoices = invoices.filter(invoice => {
    // If we have a filter status other than 'all', apply it
    if (filterStatus !== 'all' && invoice.status !== filterStatus) {
      return false;
    }
    
    // Apply search term filter
    const searchValue = searchTerm.toLowerCase();
    return (
      invoice.id.toLowerCase().includes(searchValue) ||
      invoice.patientName.toLowerCase().includes(searchValue) ||
      invoice.ownerName.toLowerCase().includes(searchValue)
    );
  });

  // Handle status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'partially_paid':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format status for display
  const formatStatus = (status) => {
    switch (status) {
      case 'partially_paid':
        return 'Partially Paid';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  // Handle invoice actions
  const handleViewInvoice = (invoiceId) => {
    // Navigate to invoice detail page
    console.log(`View Invoice: ${invoiceId}`);
    // In a real app, you would use React Router
    // navigate(`/financial/invoices/${invoiceId}`);
  };

  const handleEditInvoice = (invoiceId) => {
    console.log(`Edit Invoice: ${invoiceId}`);
    // navigate(`/financial/invoices/${invoiceId}/edit`);
  };

  const handleDeleteInvoice = (invoiceId) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      console.log(`Delete Invoice: ${invoiceId}`);
      // Implement the delete API call
    }
  };

  const handleRecordPayment = (invoiceId) => {
    console.log(`Record Payment for Invoice: ${invoiceId}`);
    // Navigate to payment form pre-populated with invoice
    // navigate(`/financial/payments/new?invoice=${invoiceId}`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Invoice Management</h1>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700 transition-colors"
          onClick={() => console.log('Create Invoice')} // Navigate to create form
        >
          <Plus size={16} className="mr-1" /> Create Invoice
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
          <div className="flex-1 w-full md:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search invoices by ID, patient, or owner"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Filter size={18} className="text-gray-500" />
              <select
                className="border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
                <option value="partially_paid">Partially Paid</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            
            <button 
              className="px-3 py-2 border border-gray-300 rounded-md flex items-center hover:bg-gray-50 transition-colors"
              onClick={() => console.log('Export Invoices')}
            >
              <Download size={18} className="mr-1 text-gray-500" /> Export
            </button>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64">
            <FileText size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No invoices found</p>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient/Owner
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-600">{invoice.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{invoice.patientName} ({invoice.patientType})</div>
                        <div className="text-xs text-gray-500">{invoice.ownerName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(invoice.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-medium text-gray-900">
                          ${invoice.totalAmount.toFixed(2)}
                        </div>
                        {invoice.paidAmount && (
                          <div className="text-xs text-gray-500">
                            Paid: ${invoice.paidAmount.toFixed(2)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(invoice.status)}`}>
                          {formatStatus(invoice.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleViewInvoice(invoice.id)}
                            className="text-gray-600 hover:text-gray-900"
                            title="View Invoice"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEditInvoice(invoice.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit Invoice"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteInvoice(invoice.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Invoice"
                          >
                            <Trash2 size={18} />
                          </button>
                          {(invoice.status === 'pending' || invoice.status === 'partially_paid' || invoice.status === 'overdue') && (
                            <button
                              onClick={() => handleRecordPayment(invoice.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Record Payment"
                            >
                              <CreditCard size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Showing page {currentPage} of {totalPages}
              </div>
              <div className="flex-1 flex justify-end">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    currentPage === 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ChevronLeft size={16} className="mr-1" /> Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    currentPage === totalPages
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InvoiceManagement;
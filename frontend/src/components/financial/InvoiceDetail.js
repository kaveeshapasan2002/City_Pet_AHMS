// src/components/financial/InvoiceDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getInvoiceById, recordPayment } from '../../api/invoice';
import { toast } from 'react-toastify';
import PaymentModal from './PaymentModal'; // We'll create this next

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  //mail
  
  
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const response = await getInvoiceById(id);
        setInvoice(response.invoice);
      } catch (error) {
        console.error('Failed to fetch invoice:', error);
        toast.error('Failed to load invoice. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInvoice();
  }, [id]);
  
  const handlePrintInvoice = () => {
    window.print();
  };
  
  const handleRecordPayment = async (paymentData) => {
    try {
      const response = await recordPayment(id, paymentData);
      setInvoice(response.invoice);
      setShowPaymentModal(false);
      toast.success('Payment recorded successfully');
    } catch (error) {
      console.error('Failed to record payment:', error);
      toast.error('Failed to record payment. Please try again.');
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  if (loading) {
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
  
  if (!invoice) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        // src/components/financial/InvoiceDetail.js (continued)
          Invoice not found. It may have been deleted or you don't have permission to view it.
        </div>
        <div className="mt-4">
          <Link 
            to="/financial-management/invoices" 
            className="text-blue-500 hover:text-blue-700"
          >
            &larr; Back to Invoices
          </Link>
        </div>
      </div>
    );
  }
  
  // Calculate total paid amount
  const totalPaid = invoice.paymentHistory?.reduce(
    (sum, payment) => sum + payment.amount, 
    0
  ) || 0;
  
  // Calculate remaining balance
  const remainingBalance = invoice.total - totalPaid;
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoice #{invoice.invoiceNumber}</h1>
        
        <div className="flex space-x-2 print:hidden">
          <button
            onClick={() => navigate('/financial-management/invoices')}
            className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded transition"
          >
            Back
          </button>
          
          <button
            onClick={handlePrintInvoice}
            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded transition"
          >
            Print
          </button>
          
          {invoice.paymentStatus !== 'Paid' && (
            <>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
              >
                Record Payment
              </button>
              
              {invoice.paymentStatus === 'Unpaid' && (
                <Link
                  to={`/financial-management/invoices/${id}/edit`}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
                >
                  Edit
                </Link>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Invoice Content */}
      <div className="bg-white shadow rounded-lg overflow-hidden print:shadow-none">
        {/* Invoice Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between">
            <div>
              <h2 className="font-bold text-lg mb-1"> City Animal Hospital</h2>
              <p className="text-sm text-gray-600">123 Main Street</p>
              <p className="text-sm text-gray-600">Colombo, Sri Lanka</p>
              <p className="text-sm text-gray-600">+94 11 2345678</p>
              <p className="text-sm text-gray-600">info@petcity.lk</p>
            </div>
            
            <div className="text-right">
              <h2 className="font-bold text-lg mb-1">Invoice</h2>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Invoice Number:</span> {invoice.invoiceNumber}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Date:</span> {formatDate(invoice.date)}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Due Date:</span> {formatDate(invoice.dueDate)}
              </p>
              <p className={`text-sm font-semibold ${
                invoice.paymentStatus === 'Paid' 
                  ? 'text-green-600' 
                  : invoice.paymentStatus === 'Partially Paid'
                  ? 'text-yellow-600' 
                  : 'text-red-600'
              }`}>
                {invoice.paymentStatus}
              </p>
            </div>
          </div>
        </div>
        
        {/* Client and Patient Info */}
        <div className="p-6 border-b grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Bill To:</h3>
            <p className="font-medium">{invoice.clientName}</p>
            <p>{invoice.clientEmail}</p>
            <p>{invoice.clientContact}</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Patient Information:</h3>
            <p><span className="font-medium">Name:</span> {invoice.patientName}</p>
            <p><span className="font-medium">ID:</span> {invoice.patientId}</p>
          </div>
        </div>
        
        {/* Invoice Items */}
        <div className="p-6 border-b">
          <h3 className="font-semibold mb-3">Invoice Items:</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-2 px-4 text-left">Description</th>
                  <th className="py-2 px-4 text-right">Qty</th>
                  <th className="py-2 px-4 text-right">Unit Price</th>
                  <th className="py-2 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {invoice.items?.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium">{item.service?.name || 'Custom Service'}</div>
                      <div className="text-sm text-gray-600">{item.description}</div>
                    </td>
                    <td className="py-3 px-4 text-right">{item.quantity}</td>
                    <td className="py-3 px-4 text-right">${item.unitPrice?.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right">${item.amount?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Invoice Summary */}
        <div className="p-6 border-b flex justify-end">
          <div className="w-full max-w-xs">
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Subtotal:</span>
              <span>${invoice.subtotal?.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Tax ({invoice.taxRate}%):</span>
              <span>${invoice.taxAmount?.toFixed(2)}</span>
            </div>
            
            {invoice.discountAmount > 0 && (
              <div className="flex justify-between py-1">
                <span className="text-gray-600">Discount:</span>
                <span>-${invoice.discountAmount?.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between pt-2 border-t mt-2 font-bold">
              <span>Total:</span>
              <span>${invoice.total?.toFixed(2)}</span>
            </div>
            
            {invoice.paymentHistory?.length > 0 && (
              <>
                <div className="flex justify-between py-1 mt-2">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="text-green-600">${totalPaid.toFixed(2)}</span>
                </div>
                
                {remainingBalance > 0 && (
                  <div className="flex justify-between py-1 font-semibold">
                    <span>Balance Due:</span>
                    <span className="text-red-600">${remainingBalance.toFixed(2)}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Payment History */}
        {invoice.paymentHistory?.length > 0 && (
          <div className="p-6 border-b">
            <h3 className="font-semibold mb-3">Payment History:</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-4 text-left">Date</th>
                    <th className="py-2 px-4 text-left">Method</th>
                    <th className="py-2 px-4 text-left">Reference</th>
                    <th className="py-2 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {invoice.paymentHistory.map((payment, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-2 px-4">{formatDate(payment.date)}</td>
                      <td className="py-2 px-4">{payment.method}</td>
                      <td className="py-2 px-4">{payment.reference || '-'}</td>
                      <td className="py-2 px-4 text-right">${payment.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Notes */}
        {invoice.notes && (
          <div className="p-6">
            <h3 className="font-semibold mb-2">Notes:</h3>
            <p className="text-gray-700">{invoice.notes}</p>
          </div>
        )}
      </div>
      
      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal 
          invoice={invoice}
          remainingBalance={remainingBalance}
          onClose={() => setShowPaymentModal(false)}
          onSubmit={handleRecordPayment}
        />
      )}
    </div>
  );
};

export default InvoiceDetail;
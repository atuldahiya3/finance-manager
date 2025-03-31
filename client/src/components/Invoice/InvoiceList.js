import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InvoiceModal = ({ invoice, onClose }) => {
  if (!invoice) return null;
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Invoice #{invoice.invoiceNumber}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">From</h3>
            <p>Your Company Name</p>
            <p>Your Address</p>
            <p>Your Email</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">To</h3>
            <p>{invoice.customerName}</p>
            <p>{invoice.customerAddress}</p>
            <p>{invoice.customerEmail}</p>
            <p>{invoice.customerPhone}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p><span className="font-semibold">Issue Date:</span> {new Date(invoice.issueDate).toLocaleDateString()}</p>
            <p><span className="font-semibold">Due Date:</span> {new Date(invoice.dueDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p><span className="font-semibold">Status:</span> <span 
              className={
                invoice.status === 'paid' ? 'text-green-500 font-semibold' : 
                invoice.status === 'overdue' ? 'text-red-500 font-semibold' : 
                'text-yellow-500 font-semibold'
              }
            >{invoice.status}</span></p>
            {invoice.paymentDate && (
              <p><span className="font-semibold">Payment Date:</span> {new Date(invoice.paymentDate).toLocaleDateString()}</p>
            )}
            {invoice.paymentMethod && (
              <p><span className="font-semibold">Payment Method:</span> {invoice.paymentMethod}</p>
            )}
          </div>
        </div>
        
        <table className="w-full border-collapse mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Item</th>
              <th className="border p-2 text-right">Quantity</th>
              <th className="border p-2 text-right">Unit Price</th>
              <th className="border p-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items && invoice.items.map((item, index) => (
              <tr key={index} className="border">
                <td className="border p-2">{item.description}</td>
                <td className="border p-2 text-right">{item.quantity}</td>
                <td className="border p-2 text-right">${item.unitPrice.toFixed(2)}</td>
                <td className="border p-2 text-right">${(item.quantity * item.unitPrice).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="flex justify-end">
          <div className="w-64">
            <div className="flex justify-between py-2">
              <span>Subtotal:</span>
              <span>${invoice.subtotal.toFixed(2)}</span>
            </div>
            {invoice.taxRate > 0 && (
              <div className="flex justify-between py-2">
                <span>Tax ({invoice.taxRate}%):</span>
                <span>${invoice.taxAmount.toFixed(2)}</span>
              </div>
            )}
            {invoice.discount > 0 && (
              <div className="flex justify-between py-2">
                <span>Discount:</span>
                <span>-${invoice.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between py-2 font-bold border-t border-gray-300 mt-2">
              <span>Total:</span>
              <span>${invoice.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {invoice.notes && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Notes</h3>
            <p className="p-3 bg-gray-50 rounded">{invoice.notes}</p>
          </div>
        )}
        
        <div className="flex justify-end mt-6 space-x-3">
          <button 
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
          >
            Close
          </button>
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => window.print()}
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

const ErrorModal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-red-600">Error</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end">
          <button 
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const InvoiceList = ({ invoices: initialInvoices, loading, onRefresh }) => {
  const [invoices, setInvoices] = useState(initialInvoices || []);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(loading || false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setInvoices(initialInvoices || []);
    setIsLoading(loading || false);
  }, [initialInvoices, loading]);
  
  // Function to determine if a string is a valid MongoDB ObjectId
  const isValidObjectId = (id) => {
    // MongoDB ObjectId should be a 24-character hex string
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    return objectIdPattern.test(id);
  };
  
  const handleViewInvoice = async (invoiceId) => {
    // Validate the invoice ID first
    if (!isValidObjectId(invoiceId)) {
      setError(`Invalid invoice ID format: ${invoiceId}`);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Get the authentication token from local storage
      const token = localStorage.getItem('token');
      
      // Log the request for debugging
      console.log(`Fetching invoice with ID: ${invoiceId}`);
      
      // Make the API request
      const response = await axios.get(`/api/invoice/${invoiceId}`, {
        headers: {
          'x-auth-token': token
        }
      });
      
      console.log('API Response:', response.data);
      setSelectedInvoice(response.data);
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      
      // Create a more user-friendly error message
      let errorMessage = 'Error fetching invoice details. Please try again.';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log('Error response data:', error.response.data);
        console.log('Error response status:', error.response.status);
        
        if (error.response.status === 404) {
          errorMessage = 'Invoice not found. It may have been deleted or you may not have permission to view it.';
        } else if (error.response.status === 401) {
          errorMessage = 'You are not authorized to view this invoice. Please log in again.';
        } else if (error.response.data && error.response.data.msg) {
          errorMessage = error.response.data.msg;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please check your internet connection.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const closeModal = () => {
    setSelectedInvoice(null);
    setError(null);
  };
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Invoices</h2>
        <button 
          onClick={onRefresh}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
      
      {isLoading && !selectedInvoice && !error ? (
        <p>Loading invoices...</p>
      ) : invoices.length === 0 ? (
        <p>No invoices found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Invoice #</th>
                <th className="border p-2">Customer</th>
                <th className="border p-2">Issue Date</th>
                <th className="border p-2">Due Date</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice._id} className="border hover:bg-gray-50">
                  <td className="border p-2">{invoice.invoiceNumber}</td>
                  <td className="border p-2">{invoice.customerName}</td>
                  <td className="border p-2">{new Date(invoice.issueDate).toLocaleDateString()}</td>
                  <td className="border p-2">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                  <td className="border p-2">${invoice.total.toFixed(2)}</td>
                  <td className="border p-2 font-semibold">
                    <span className={
                      invoice.status === 'paid' ? 'text-green-500' : 
                      invoice.status === 'overdue' ? 'text-red-500' : 
                      'text-yellow-500'}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="border p-2">
                    <button 
                      onClick={() => handleViewInvoice(invoice._id)}
                      className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-sm"
                      disabled={isLoading}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {selectedInvoice && (
        <InvoiceModal 
          invoice={selectedInvoice} 
          onClose={closeModal} 
        />
      )}
      
      {error && (
        <ErrorModal
          message={error}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default InvoiceList;
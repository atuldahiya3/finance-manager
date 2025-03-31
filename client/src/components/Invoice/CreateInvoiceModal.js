import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { PlusIcon, TrashIcon } from '@heroicons/react/outline';
import Button from '../common/Button';
import axios from 'axios';

const CreateInvoiceModal = ({ isOpen, onClose, onSubmit }) => {
  const [invoice, setInvoice] = useState({
    invoiceNumber: '',
    customerName: '',
    customerAddress: '',
    customerEmail: '',
    customerPhone: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [{ description: '', quantity: 1, unitPrice: 0, amount: 0 }],
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    discount: 0,
    total: 0,
    notes: '',
    status: 'draft',
    paymentMethod: 'bank'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      resetForm();
      fetchNextInvoiceNumber();
    }
  }, [isOpen]);

  const resetForm = () => {
    setInvoice({
      invoiceNumber: '',
      customerName: '',
      customerAddress: '',
      customerEmail: '',
      customerPhone: '',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [{ description: '', quantity: 1, unitPrice: 0, amount: 0 }],
      subtotal: 0,
      taxRate: 0,
      taxAmount: 0,
      discount: 0,
      total: 0,
      notes: '',
      status: 'draft',
      paymentMethod: 'bank'
    });
    setError('');
  };

  const fetchNextInvoiceNumber = async () => {
    try {
      const response = await axios.get('/api/invoice/generate-number');
      if (response.data && response.data.nextInvoiceNumber) {
        setInvoice(prev => ({ ...prev, invoiceNumber: response.data.nextInvoiceNumber }));
      } else {
        // Fallback if API doesn't return expected data
        setInvoice(prev => ({ ...prev, invoiceNumber: `INV-${Date.now().toString().slice(-8)}` }));
      }
    } catch (error) {
      console.error('Error fetching invoice number:', error);
      // Fallback to timestamp-based invoice number
      setInvoice(prev => ({ ...prev, invoiceNumber: `INV-${Date.now().toString().slice(-8)}` }));
    }
  };

  const calculateLineItemAmount = (item) => {
    return parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0);
  };

  const updateItemAmount = (index, updatedItem) => {
    const amount = calculateLineItemAmount(updatedItem);
    updatedItem.amount = amount;
    
    const updatedItems = invoice.items.map((item, i) => 
      i === index ? updatedItem : item
    );
    
    updateInvoiceTotals(updatedItems);
  };

  const updateInvoiceTotals = (items) => {
    const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const taxAmount = subtotal * (parseFloat(invoice.taxRate || 0) / 100);
    const total = subtotal + taxAmount - parseFloat(invoice.discount || 0);

    setInvoice(prev => ({
      ...prev,
      items,
      subtotal,
      taxAmount,
      total
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...invoice.items];
    const updatedItem = { ...updatedItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'unitPrice') {
      updateItemAmount(index, updatedItem);
    } else {
      updatedItems[index] = updatedItem;
      setInvoice(prev => ({ ...prev, items: updatedItems }));
    }
  };

  const addItem = () => {
    const newItem = { description: '', quantity: 1, unitPrice: 0, amount: 0 };
    const updatedItems = [...invoice.items, newItem];
    setInvoice(prev => ({ ...prev, items: updatedItems }));
  };

  const removeItem = (index) => {
    if (invoice.items.length === 1) return;
    
    const updatedItems = invoice.items.filter((_, i) => i !== index);
    updateInvoiceTotals(updatedItems);
  };

  const handleTaxRateChange = (value) => {
    const taxRate = parseFloat(value) || 0;
    const taxAmount = invoice.subtotal * (taxRate / 100);
    const total = invoice.subtotal + taxAmount - parseFloat(invoice.discount || 0);

    setInvoice(prev => ({
      ...prev,
      taxRate,
      taxAmount,
      total
    }));
  };

  const handleDiscountChange = (value) => {
    const discount = parseFloat(value) || 0;
    const total = invoice.subtotal + invoice.taxAmount - discount;

    setInvoice(prev => ({
      ...prev,
      discount,
      total
    }));
  };

  const handleChange = (field, value) => {
    setInvoice(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!invoice.invoiceNumber.trim()) {
      setError('Invoice number is required');
      return false;
    }
    
    if (!invoice.customerName.trim()) {
      setError('Customer name is required');
      return false;
    }
    
    if (!invoice.issueDate) {
      setError('Issue date is required');
      return false;
    }
    
    if (!invoice.dueDate) {
      setError('Due date is required');
      return false;
    }
    
    if (invoice.items.length === 0) {
      setError('At least one item is required');
      return false;
    }
    
    for (const item of invoice.items) {
      if (!item.description.trim()) {
        setError('All items must have a description');
        return false;
      }
      if (parseFloat(item.quantity) <= 0) {
        setError('All items must have a quantity greater than zero');
        return false;
      }
      if (parseFloat(item.unitPrice) < 0) {
        setError('Item prices cannot be negative');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setError('');
    setLoading(true);
    
    try {
      // Format the invoice data to match the API expectations
      const invoiceData = {
        ...invoice,
        items: invoice.items.map(item => ({
          description: item.description,
          quantity: parseFloat(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
          amount: parseFloat(item.amount)
        })),
        subtotal: parseFloat(invoice.subtotal),
        taxRate: parseFloat(invoice.taxRate),
        taxAmount: parseFloat(invoice.taxAmount),
        discount: parseFloat(invoice.discount),
        total: parseFloat(invoice.total)
      };
      
      await onSubmit(invoiceData);
      onClose();
    } catch (error) {
      console.error('Error creating invoice:', error);
      setError(error.response?.data?.msg || 'Failed to create invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
      <Dialog.Panel className="relative z-50 w-full max-w-4xl bg-white rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <Dialog.Title as="h3" className="text-xl font-bold text-gray-900 mb-6">
          Create New Invoice
        </Dialog.Title>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Invoice Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
                <input
                  type="text"
                  value={invoice.invoiceNumber}
                  onChange={(e) => handleChange('invoiceNumber', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Issue Date</label>
                <input
                  type="date"
                  value={invoice.issueDate}
                  onChange={(e) => handleChange('issueDate', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="date"
                  value={invoice.dueDate}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={invoice.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                <select
                  value={invoice.paymentMethod}
                  onChange={(e) => handleChange('paymentMethod', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="bank">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="credit">Credit Card</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                <input
                  type="text"
                  value={invoice.customerName}
                  onChange={(e) => handleChange('customerName', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer Address</label>
                <textarea
                  value={invoice.customerAddress}
                  onChange={(e) => handleChange('customerAddress', e.target.value)}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer Email</label>
                <input
                  type="email"
                  value={invoice.customerEmail}
                  onChange={(e) => handleChange('customerEmail', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer Phone</label>
                <input
                  type="text"
                  value={invoice.customerPhone}
                  onChange={(e) => handleChange('customerPhone', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
          
          {/* Invoice Items */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-gray-900">Invoice Items</h4>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={addItem}
                className="py-1"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoice.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          placeholder="Item description"
                        />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                          className="block w-20 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <input
                          type="number"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="block w-28 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                        {item.amount.toFixed(2)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <button
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800"
                          disabled={invoice.items.length === 1}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Invoice Totals */}
          <div className="flex justify-end">
            <div className="w-full md:w-1/2 lg:w-1/3 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-700">Subtotal:</span>
                <span className="text-sm font-medium">{invoice.subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">Tax Rate (%):</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={invoice.taxRate}
                  onChange={(e) => handleTaxRateChange(e.target.value)}
                  className="w-20 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-700">Tax Amount:</span>
                <span className="text-sm font-medium">{invoice.taxAmount.toFixed(2)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">Discount:</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={invoice.discount}
                  onChange={(e) => handleDiscountChange(e.target.value)}
                  className="w-20 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              
              <div className="flex justify-between border-t pt-2">
                <span className="text-base font-medium text-gray-900">Total:</span>
                <span className="text-base font-bold text-gray-900">{invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={invoice.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Add any additional notes, payment instructions, or terms..."
            />
          </div>
          
          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <div className='bg-gray-800 rounded-lg'>
              <Button onClick={handleSubmit} loading={loading}>
                Save Invoice
              </Button>
            </div>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default CreateInvoiceModal;
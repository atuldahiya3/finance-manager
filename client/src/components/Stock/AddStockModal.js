import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddStockModal = ({ isOpen, onClose, onSubmit }) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset,
    watch
  } = useForm();
  
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate total amount in real-time
  const quantity = watch('quantity', 0);
  const unitPrice = watch('unitPrice', 0);
  const totalAmount = quantity * unitPrice;

  const handleFormSubmit = async (data) => {
    if (loading) return; // Use just one flag
    
    setLoading(true);
  
    try {
      const response = await axios.post('/api/stock', { 
        ...data, 
        totalAmount: data.quantity * data.unitPrice 
      });
      
      onSubmit(response.data);
      toast.success('Stock item added successfully');
      reset();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to add stock item');
      console.error('Error adding stock:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      reset();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Stock Item">
      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <div className="space-y-4">
          {/* Item Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Item Name *
            </label>
            <input
              type="text"
              {...register('itemName', { 
                required: 'Item name is required',
                maxLength: {
                  value: 100,
                  message: 'Item name cannot exceed 100 characters'
                }
              })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                errors.itemName ? 'border-red-500' : ''
              }`}
              disabled={loading}
            />
            {errors.itemName && (
              <p className="mt-1 text-sm text-red-600">{errors.itemName.message}</p>
            )}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type *
            </label>
            <select
              {...register('type', { required: 'Type is required' })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                errors.type ? 'border-red-500' : ''
              }`}
              disabled={loading}
            >
              <option value="">Select type</option>
              <option value="purchase">Purchase</option>
              <option value="sale">Sale</option>
              <option value="return">Return</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          {/* Vendor Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Vendor Name *
            </label>
            <input
              type="text"
              {...register('vendorName', { 
                required: 'Vendor name is required',
                maxLength: {
                  value: 100,
                  message: 'Vendor name cannot exceed 100 characters'
                }
              })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                errors.vendorName ? 'border-red-500' : ''
              }`}
              disabled={loading}
            />
            {errors.vendorName && (
              <p className="mt-1 text-sm text-red-600">{errors.vendorName.message}</p>
            )}
          </div>

          {/* Quantity and Unit Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantity *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                {...register('quantity', { 
                  required: 'Quantity is required',
                  min: { 
                    value: 0.01, 
                    message: 'Quantity must be greater than 0' 
                  },
                  max: {
                    value: 999999,
                    message: 'Quantity is too large'
                  }
                })}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                  errors.quantity ? 'border-red-500' : ''
                }`}
                disabled={loading}
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Unit Price *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                {...register('unitPrice', { 
                  required: 'Unit price is required',
                  min: { 
                    value: 0.01, 
                    message: 'Price must be greater than 0' 
                  },
                  max: {
                    value: 999999,
                    message: 'Price is too large'
                  }
                })}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                  errors.unitPrice ? 'border-red-500' : ''
                }`}
                disabled={loading}
              />
              {errors.unitPrice && (
                <p className="mt-1 text-sm text-red-600">{errors.unitPrice.message}</p>
              )}
            </div>
          </div>

          {/* Total Amount (read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Total Amount
            </label>
            <input
              type="text"
              value={`$${totalAmount.toFixed(2)}`}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              {...register('notes', {
                maxLength: {
                  value: 500,
                  message: 'Notes cannot exceed 500 characters'
                }
              })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              disabled={loading}
            />
            {errors.notes && (
              <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-6 flex justify-end space-x-3">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <div className='bg-gray-800 rounded-lg'>
            <Button 
              type="submit" 
              loading={loading}
              disabled={loading || isSubmitting}
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddStockModal;
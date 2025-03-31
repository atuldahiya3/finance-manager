// client/src/components/Stock/AddStockModal.js
import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddStockModal = ({ isOpen, onClose, onSubmit }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (data) => {
    try {
      setLoading(true);
      const totalAmount = data.quantity * data.unitPrice;
      const response = await axios.post('/api/stock', { ...data, totalAmount });
      onSubmit(response.data);
      toast.success('Stock item added successfully');
      reset();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to add stock item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Stock Item">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Name</label>
            <input
              type="text"
              {...register('itemName', { required: 'Item name is required' })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                errors.itemName ? 'border-red-500' : ''
              }`}
            />
            {errors.itemName && (
              <p className="mt-1 text-sm text-red-600">{errors.itemName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              {...register('type', { required: 'Type is required' })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                errors.type ? 'border-red-500' : ''
              }`}
            >
              <option value="">Select type</option>
              <option value="purchase">Purchase</option>
              <option value="sale">Sale</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Vendor Name</label>
            <input
              type="text"
              {...register('vendorName', { required: 'Vendor name is required' })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                errors.vendorName ? 'border-red-500' : ''
              }`}
            />
            {errors.vendorName && (
              <p className="mt-1 text-sm text-red-600">{errors.vendorName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                step="0.01"
                {...register('quantity', { 
                  required: 'Quantity is required',
                  min: { value: 0.01, message: 'Quantity must be greater than 0' }
                })}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                  errors.quantity ? 'border-red-500' : ''
                }`}
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Unit Price</label>
              <input
                type="number"
                step="0.01"
                {...register('unitPrice', { 
                  required: 'Unit price is required',
                  min: { value: 0.01, message: 'Price must be greater than 0' }
                })}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                  errors.unitPrice ? 'border-red-500' : ''
                }`}
              />
              {errors.unitPrice && (
                <p className="mt-1 text-sm text-red-600">{errors.unitPrice.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              {...register('notes')}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddStockModal;
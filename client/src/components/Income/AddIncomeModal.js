import { useForm } from 'react-hook-form';
import Modal from '../common/Modal';
import Button from '../common/Button';

const AddIncome = ({ isOpen, onClose, categories = [], onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const submitHandler = async (data) => {
    try {
      onSubmit(data);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Income">
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            {...register('category', { required: 'Category is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="">Select a category</option>
            {categories.length > 0 ? (
              categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))
            ) : (
              <option disabled>No categories available</option>
            )}
          </select>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            step="0.01"
            {...register('amount', { required: 'Amount is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Income</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddIncome;

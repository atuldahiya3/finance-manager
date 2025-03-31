import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import Button from '../common/Button';

const AddExpenseModal = ({ isOpen, onClose, categories, onSubmit }) => {
  const [newExpense, setNewExpense] = useState({
    category: '',
    amount: '',
    description: '',
    date: '',
    reference: '',
  });

  const handleSubmit = () => {
    if (!newExpense.category || !newExpense.amount || !newExpense.date) return;
    onSubmit(newExpense);
    setNewExpense({ category: '', amount: '', description: '', date: '', reference: '' });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
      <Dialog.Panel className="relative z-50 w-full max-w-md bg-white rounded-2xl p-6 shadow-xl">
        <Dialog.Title as="h3" className="text-lg font-medium text-gray-900 mb-4">
          Add Expense
        </Dialog.Title>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="">Select a category</option>
              {categories.length > 0 ? (
                categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)
              ) : (
                <option disabled>No categories available</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              step="0.01"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={newExpense.date}
              onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Reference (Optional)</label>
            <input
              type="text"
              value={newExpense.reference}
              onChange={(e) => setNewExpense({ ...newExpense, reference: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <div className='bg-gray-800 rounded-lg'>
            <Button onClick={handleSubmit}>Save Expense</Button>

            </div>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default AddExpenseModal;
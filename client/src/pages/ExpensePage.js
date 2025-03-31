import { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog } from '@headlessui/react';
import ExpenseList from '../components/Expense/ExpenseList';
import AddExpenseModal from '../components/Expense/AddExpenseModal';
import Button from '../components/common/Button';
import { PlusIcon, RefreshIcon, TagIcon } from '@heroicons/react/outline';

const ExpensePage = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [summary, setSummary] = useState({
    total: 0,
    thisMonth: 0,
    lastMonth: 0
  });
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expensesRes, categoriesRes, summaryRes] = await Promise.all([
        axios.get('/api/expense'),
        axios.get('/api/expense/categories'),
        axios.get('/api/expense/summary/data')
      ]);
      
      setExpenses(expensesRes.data);
      setCategories(categoriesRes.data);
      setSummary({
        total: summaryRes.data.totalExpenses || 0,
        thisMonth: expensesRes.data
          .filter((expense) => new Date(expense.date).getMonth() === new Date().getMonth())
          .reduce((sum, expense) => sum + expense.amount, 0),
        lastMonth: expensesRes.data
          .filter((expense) => new Date(expense.date).getMonth() === new Date().getMonth() - 1)
          .reduce((sum, expense) => sum + expense.amount, 0)
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddExpense = async (newExpense) => {
    try {
      const res = await axios.post('/api/expense', newExpense);
      setExpenses([res.data, ...expenses]);
      setIsModalOpen(false);
      fetchData(); // Refetch to update summary
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name) return;

    try {
      const payload = {
        name: newCategory.name,
        description: newCategory.description
      };
      
      const res = await axios.post('/api/expense/categories', payload);
      setCategories([...categories, res.data]);
      setIsCategoryModalOpen(false);
      setNewCategory({ name: '', description: '' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 p-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Expense Records</h1>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={fetchData}>
            <RefreshIcon className="h-5 w-5 mr-2" />
            Refresh
          </Button>

          <Button variant="outline" onClick={() => setIsCategoryModalOpen(true)}>
            <TagIcon className="h-5 w-5 mr-2" />
            Add Category
          </Button>

          <div className='bg-gray-800 text-black rounded-lg'>
            <Button onClick={() => setIsModalOpen(true)}>
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Expense
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <ExpenseList 
          expenses={expenses} 
          categories={categories} 
          loading={loading} 
          onRefresh={fetchData} 
        />
      </div>

      <AddExpenseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        categories={categories} 
        onSubmit={handleAddExpense} 
      />

      {/* Add Category Modal */}
      <Dialog open={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setIsCategoryModalOpen(false)} />
        <Dialog.Panel className="relative z-50 w-full max-w-md bg-white rounded-2xl p-6 shadow-xl">
          <Dialog.Title as="h3" className="text-lg font-medium text-gray-900 mb-4">
            Add Expense Category
          </Dialog.Title>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category Name</label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="e.g. Food, Transportation, Rent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows="3"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Brief description of this expense category"
              ></textarea>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsCategoryModalOpen(false)}>Cancel</Button>
              <div className='bg-gray-800 rounded-xl'>
                <Button onClick={handleAddCategory}>Save Category</Button>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
};

export default ExpensePage;
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog } from '@headlessui/react';
import Button from '../components/common/Button';
import { PlusIcon, RefreshIcon } from '@heroicons/react/outline';
import IncomeSummary from '../components/Income/IncomeSummary';
import IncomeList from '../components/Income/IncomeList';

const IncomePage = () => {
  const [incomes, setIncomes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [summary, setSummary] = useState({ total: 0, thisMonth: 0, lastMonth: 0 });
  const [newIncome, setNewIncome] = useState({
    category: '',
    amount: '',
    description: '',
    date: '',
    reference: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [incomesRes, categoriesRes, summaryRes] = await Promise.all([
        axios.get('/api/income'),
        axios.get('/api/income/categories'),
        axios.get('/api/income/summary/data'),
      ]);

      setIncomes(incomesRes.data || []);
      setCategories(categoriesRes.data || []);
      setSummary({
        total: summaryRes.data.totalIncome || 0,
        thisMonth: incomesRes.data
          .filter((income) => new Date(income.date).getMonth() === new Date().getMonth())
          .reduce((sum, income) => sum + income.amount, 0),
        lastMonth: incomesRes.data
          .filter((income) => new Date(income.date).getMonth() === new Date().getMonth() - 1)
          .reduce((sum, income) => sum + income.amount, 0),
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

  const handleAddIncome = async () => {
    if (!newIncome.category || !newIncome.amount || !newIncome.date) return;

    try {
      const res = await axios.post('/api/income', newIncome);
      setIncomes([res.data, ...incomes]);
      setIsModalOpen(false);
      fetchData();
      setNewIncome({ category: '', amount: '', description: '', date: '', reference: '' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 p-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Income Records</h1>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={fetchData}>
            <RefreshIcon className="h-5 w-5 mr-2" />
            Refresh
          </Button>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gray-100 text-black px-4 py-2 rounded-md shadow hover:bg-primary-600 focus:ring-2 focus:ring-primary-300"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Income
          </Button>
        </div>
      </div>

      <IncomeSummary total={summary.total} thisMonth={summary.thisMonth} lastMonth={summary.lastMonth} />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <IncomeList incomes={incomes} categories={categories} loading={loading} onRefresh={fetchData} />
      </div>

      {/* Add Income Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setIsModalOpen(false)} />
        <Dialog.Panel className="relative z-50 w-full max-w-md bg-white rounded-2xl p-6 shadow-xl">
          <Dialog.Title as="h3" className="text-lg font-medium text-gray-900 mb-4">
            Add Income
          </Dialog.Title>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={newIncome.category}
                onChange={(e) => setNewIncome({ ...newIncome, category: e.target.value })}
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
                value={newIncome.amount}
                onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                value={newIncome.description}
                onChange={(e) => setNewIncome({ ...newIncome, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={newIncome.date}
                onChange={(e) => setNewIncome({ ...newIncome, date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <div className='text-black bg-gray-800'>
              <Button onClick={handleAddIncome}>Save Income</Button>

              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
};

export default IncomePage;

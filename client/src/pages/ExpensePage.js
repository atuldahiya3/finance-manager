import { useState, useEffect } from 'react';
import axios from 'axios';
import ExpenseList from '../components/Expense/ExpenseList';
import AddExpenseModal from '../components/Expense/AddExpenseModal';
// import ExpenseSummary from '../components/Expense/ExpenseSummary';
import Button from '../components/common/Button';
import { PlusIcon, RefreshIcon } from '@heroicons/react/outline';

const ExpensePage = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [summary, setSummary] = useState({
    total: 0,
    thisMonth: 0,
    lastMonth: 0
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

  return (
    <div className="space-y-6 p-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Expense Records</h1>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={fetchData}>
            <RefreshIcon className="h-5 w-5 mr-2" />
            Refresh
          </Button>
          <div className='bg-gray-800 text-black rounded-lg'>
            <Button onClick={() => setIsModalOpen(true)}>
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Expense
            </Button>

          </div>
        </div>
      </div>

      {/* Uncomment when you have ExpenseSummary component */}
      {/* <ExpenseSummary 
        total={summary.total} 
        thisMonth={summary.thisMonth} 
        lastMonth={summary.lastMonth} 
      /> */}

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
    </div>
  );
};

export default ExpensePage;
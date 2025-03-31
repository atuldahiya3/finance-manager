// client/src/pages/DashboardPage.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SummaryCard from '../components/Dashboard/SummaryCard';
import RecentTransactions from '../components/Dashboard/RecentTransactions';
import ActivityChart from '../components/Dashboard/ActivityChart';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardPage = () => {
  const [summary, setSummary] = useState({
    income: 0,
    expenses: 0,
    profit: 0,
    invoices: 0,
    paidInvoices: 0,
    overdueInvoices: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incomeRes, expenseRes, invoiceRes] = await Promise.all([
          axios.get('/api/income/summary/data'),
          axios.get('/api/expense/summary/data'),
          axios.get('/api/invoice/summary/data')
        ]);

        const incomeTotal = incomeRes.data.totalIncome || 0;
        const expenseTotal = expenseRes.data.totalExpenses || 0;

        setSummary({
          income: incomeTotal,
          expenses: expenseTotal,
          profit: incomeTotal - expenseTotal,
          invoices: invoiceRes.data.invoiceCount || 0,
          paidInvoices: invoiceRes.data.paidCount || 0,
          overdueInvoices: invoiceRes.data.overdueCount || 0
        });

        setChartData({
          labels: ['Income', 'Expenses', 'Profit'],
          datasets: [
            {
              data: [incomeTotal, expenseTotal, incomeTotal - expenseTotal],
              backgroundColor: [
                'rgba(74, 222, 128, 0.7)',
                'rgba(248, 113, 113, 0.7)',
                'rgba(59, 130, 246, 0.7)'
              ],
              borderColor: [
                'rgba(74, 222, 128, 1)',
                'rgba(248, 113, 113, 1)',
                'rgba(59, 130, 246, 1)'
              ],
              borderWidth: 1
            }
          ]
        });

        const recentRes = await axios.get('/api/income?limit=5');
        setTransactions(recentRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard 
          title="Total Income" 
          value={summary.income} 
          change="+12.5%" 
          icon="trending-up" 
          color="success" 
          onClick={() => navigate('/income')}
        />
        <SummaryCard 
          title="Total Expenses" 
          value={summary.expenses} 
          change="-3.2%" 
          icon="trending-down" 
          color="danger" 
          onClick={() => navigate('/expense')}
        />
        <SummaryCard 
          title="Net Profit" 
          value={summary.profit} 
          change={summary.profit >= 0 ? "+8.7%" : "-5.2%"} 
          icon="dollar" 
          color={summary.profit >= 0 ? "primary" : "danger"} 
        />
        <SummaryCard 
          title="Active Invoices" 
          value={summary.invoices} 
          change="+5" 
          icon="document" 
          color="info" 
          onClick={() => navigate('/invoice')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Financial Activity</h2>
            <ActivityChart />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Income vs Expenses</h2>
          <div className="h-64">
            {chartData && <Doughnut data={chartData} options={{ maintainAspectRatio: false }} />}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactions 
          transactions={transactions} 
          onViewAll={() => navigate('/income')}
        />
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/income')}
              className="bg-success-50 hover:bg-success-100 text-success-600 p-4 rounded-lg flex flex-col items-center transition-colors duration-200"
            >
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span>Income</span>
            </button>
            <button 
              onClick={() => navigate('/expense')}
              className="bg-danger-50 hover:bg-danger-100 text-danger-600 p-4 rounded-lg flex flex-col items-center transition-colors duration-200"
            >
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
              </svg>
              <span>Expense</span>
            </button>
            <button 
              onClick={() => navigate('/invoice')}
              className="bg-primary-50 hover:bg-primary-100 text-primary-600 p-4 rounded-lg flex flex-col items-center transition-colors duration-200"
            >
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              <span>Invoice</span>
            </button>
            <button 
              onClick={() => navigate('/stock/add')}
              className="bg-info-50 hover:bg-info-100 text-info-600 p-4 rounded-lg flex flex-col items-center transition-colors duration-200"
            >
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span>Add Stock</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
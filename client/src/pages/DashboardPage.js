// client/src/pages/DashboardPage.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../components/common/Card';
import SummaryCard from '../components/Dashboard/SummaryCard';
import RecentTransactions from '../components/Dashboard/RecentTransactions';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

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

        // Fetch recent transactions
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

  const chartData = {
    labels: ['Income', 'Expenses', 'Profit'],
    datasets: [
      {
        data: [summary.income, summary.expenses, summary.profit],
        backgroundColor: [
          'rgba(40, 167, 69, 0.7)',
          'rgba(220, 53, 69, 0.7)',
          'rgba(13, 110, 253, 0.7)'
        ],
        borderColor: [
          'rgba(40, 167, 69, 1)',
          'rgba(220, 53, 69, 1)',
          'rgba(13, 110, 253, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard title="Total Income" value={summary.income} color="success" icon="arrow-up" />
        <SummaryCard title="Total Expenses" value={summary.expenses} color="danger" icon="arrow-down" />
        <SummaryCard title="Net Profit" value={summary.profit} color="primary" icon="dollar" />
        <SummaryCard title="Invoices" value={summary.invoices} color="info" icon="document" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTransactions transactions={transactions} />
        </div>
        <div>
          <Card title="Income vs Expenses">
            <div className="h-64">
              <Doughnut data={chartData} options={{ maintainAspectRatio: false }} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
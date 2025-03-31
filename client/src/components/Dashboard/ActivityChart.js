// client/src/components/Dashboard/ActivityChart.js
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from 'react';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ActivityChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data for the last 7 days
        const [incomeRes, expenseRes] = await Promise.all([
          axios.get('/api/income/summary/data'),
          axios.get('/api/expense/summary/data')
        ]);

        const labels = incomeRes?.data.map(item => 
          new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })
        );

        setChartData({
          labels,
          datasets: [
            {
              label: 'Income',
              data: incomeRes?.data.map(item => item.amount),
              borderColor: 'rgba(74, 222, 128, 1)',
              backgroundColor: 'rgba(74, 222, 128, 0.2)',
              tension: 0.4
            },
            {
              label: 'Expenses',
              data: expenseRes.data.map(item => item.amount),
              borderColor: 'rgba(248, 113, 113, 1)',
              backgroundColor: 'rgba(248, 113, 113, 0.2)',
              tension: 0.4
            }
          ]
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <Line 
      data={chartData}
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              drawBorder: false
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }}
    />
  );
};

export default ActivityChart;
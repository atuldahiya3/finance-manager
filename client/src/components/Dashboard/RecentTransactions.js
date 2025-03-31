// client/src/components/Dashboard/RecentTransactions.js
// import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/outline';

import { ArrowCircleDown, ArrowCircleUp } from "@mui/icons-material";

const RecentTransactions = ({ transactions }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <div key={transaction._id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {transaction.type === 'income' ? (
                    <ArrowCircleUp className="h-5 w-5 text-success-500 mr-3" />
                  ) : (
                    <ArrowCircleDown className="h-5 w-5 text-danger-500 mr-3" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {transaction.description || 'No description'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    }).format(transaction.amount)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {transaction.category?.name || 'Uncategorized'}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-4 text-center text-gray-500">
            No recent transactions
          </div>
        )}
      </div>
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <button className="text-sm font-medium text-primary-600 hover:text-primary-500">
          View all transactions
        </button>
      </div>
    </div>
  );
};

export default RecentTransactions;
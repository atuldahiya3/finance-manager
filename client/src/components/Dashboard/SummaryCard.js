// client/src/components/Dashboard/SummaryCard.js
import { ArrowUpIcon, ArrowDownIcon, CurrencyDollarIcon, DocumentTextIcon } from '@heroicons/react/outline';

const iconMap = {
  'arrow-up': ArrowUpIcon,
  'arrow-down': ArrowDownIcon,
  'dollar': CurrencyDollarIcon,
  'document': DocumentTextIcon
};

const SummaryCard = ({ title, value, color = 'primary', icon }) => {
  const Icon = iconMap[icon] || CurrencyDollarIcon;
  const formattedValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);

  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    success: 'bg-success-100 text-success-600',
    danger: 'bg-danger-100 text-danger-600',
    info: 'bg-info-100 text-info-600'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{formattedValue}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
// client/src/components/Dashboard/SummaryCard.js
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  CurrencyDollarIcon, 
  DocumentTextIcon,
  TrendingUpIcon,
  TrendingDownIcon
} from '@heroicons/react/outline';

const SummaryCard = ({ title, value, change, icon, color = 'primary' }) => {
  const Icon = () => {
    switch (icon) {
      case 'trending-up':
        return <TrendingUpIcon className="h-6 w-6" />;
      case 'trending-down':
        return <TrendingDownIcon className="h-6 w-6" />;
      case 'dollar':
        return <CurrencyDollarIcon className="h-6 w-6" />;
      case 'document':
        return <DocumentTextIcon className="h-6 w-6" />;
      default:
        return <CurrencyDollarIcon className="h-6 w-6" />;
    }
  };

  const colorClasses = {
    primary: {
      bg: 'bg-primary-50',
      text: 'text-primary-600',
      icon: 'bg-primary-100 text-primary-600'
    },
    success: {
      bg: 'bg-success-50',
      text: 'text-success-600',
      icon: 'bg-success-100 text-success-600'
    },
    danger: {
      bg: 'bg-danger-50',
      text: 'text-danger-600',
      icon: 'bg-danger-100 text-danger-600'
    },
    info: {
      bg: 'bg-info-50',
      text: 'text-info-600',
      icon: 'bg-info-100 text-info-600'
    }
  };

  const isPositive = change && change.startsWith('+');

  return (
    <div className={`rounded-xl p-6 ${colorClasses[color].bg}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)}
          </p>
          {change && (
            <div className={`mt-1 flex items-center text-sm ${isPositive ? 'text-success-600' : 'text-danger-600'}`}>
              {isPositive ? (
                <ArrowUpIcon className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 mr-1" />
              )}
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color].icon}`}>
          <Icon />
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
// client/src/components/Layout/Sidebar.js
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  DocumentTextIcon,
  CogIcon
} from '@heroicons/react/outline';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: HomeIcon },
    { name: 'Stock', path: '/stock', icon: ChartBarIcon },
    { name: 'Income', path: '/income', icon: ArrowUpIcon },
    { name: 'Expense', path: '/expense', icon: ArrowDownIcon },
    { name: 'Invoices', path: '/invoice', icon: DocumentTextIcon },
   
  ];

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200">
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-md ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}`
                }
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
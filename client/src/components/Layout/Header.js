// client/src/components/Layout/Header.js
import { useAuth } from '../../context/AuthContext';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, BellIcon, CogIcon, LogoutIcon, UserIcon } from '@heroicons/react/outline';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-9xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-900">Finance Manager</h1>
        
        <div className="flex items-center space-x-4">
          {/* <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
            <BellIcon className="h-6 w-6" />
          </button> */}
          
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center space-x-2 focus:outline-none">
              <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                {user?.name?.charAt(0)}
              </div>
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            </Menu.Button>
            
            <Transition
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                {/* <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${active ? 'bg-gray-100' : ''} w-full px-4 py-2 text-sm text-gray-700 flex items-center`}
                    >
                      <UserIcon className="h-4 w-4 mr-2" />
                      Profile
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${active ? 'bg-gray-100' : ''} w-full px-4 py-2 text-sm text-gray-700 flex items-center`}
                    >
                      <CogIcon className="h-4 w-4 mr-2" />
                      Settings
                    </button>
                  )}
                </Menu.Item> */}
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={logout}
                      className={`${active ? 'bg-gray-100' : ''} w-full px-4 py-2 text-sm text-gray-700 flex items-center`}
                    >
                      <LogoutIcon className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
};

export default Header;
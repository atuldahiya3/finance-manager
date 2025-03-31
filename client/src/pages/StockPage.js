// client/src/pages/StockPage.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StockList from '../components/Stock/StockList';
import AddStockModal from '../components/Stock/AddStockModal';
import Button from '../components/common/Button';
import { PlusIcon, RefreshIcon } from '@heroicons/react/outline';
import { toast } from 'react-toastify';

const StockPage = () => {
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalValue: 0,
    lowStock: 0
  });
  const navigate = useNavigate();

  const fetchStock = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/stock');
      setStockItems(res.data);
      
      const totalValue = res.data.reduce((sum, item) => sum + item.totalAmount, 0);
      const lowStockItems = res.data.filter(item => item.quantity < 10).length;
      
      setStats({
        totalItems: res.data.length,
        totalValue,
        lowStock: lowStockItems
      });
    } catch (err) {
      toast.error('Failed to fetch stock items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const handleAddStock = async (newStock) => {
    try {
      const res = await axios.post('/api/stock', newStock);
      setStockItems([res.data, ...stockItems]);
      toast.success('Stock item added successfully');
      setIsModalOpen(false);
      fetchStock(); // Refresh data
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to add stock item');
    }
  };

  const handleEditStock = (item) => {
    navigate(`/stock/edit/${item._id}`);
  };

  const handleDeleteStock = async (id) => {
    try {
      await axios.delete(`/api/stock/${id}`);
      setStockItems(stockItems.filter(item => item._id !== id));
      toast.success('Stock item deleted successfully');
      fetchStock(); // Refresh data
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to delete stock item');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={fetchStock}>
            <RefreshIcon className="h-5 w-5 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Stock
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Items</h3>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalItems}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Value</h3>
          <p className="mt-1 text-3xl font-semibold text-gray-900">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(stats.totalValue)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">Low Stock Items</h3>
          <p className={`mt-1 text-3xl font-semibold ${
            stats.lowStock > 0 ? 'text-danger-600' : 'text-gray-900'
          }`}>
            {stats.lowStock}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <StockList 
          items={stockItems} 
          loading={loading} 
          onRefresh={fetchStock}
          onEdit={handleEditStock}
          onDelete={handleDeleteStock}
        />
      </div>

      <AddStockModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddStock} 
      />
    </div>
  );
};

export default StockPage;
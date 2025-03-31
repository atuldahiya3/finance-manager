// client/src/pages/InvoicePage.js
import { useState, useEffect } from 'react';
import axios from 'axios';
// import CreateInvoiceModal from '../components/Invoice/CreateInvoiceModal';
import InvoiceStats from '../components/Invoice/InvoiceStats';
import Button from '../components/common/Button';
import { PlusIcon, RefreshIcon } from '@heroicons/react/outline';
import InvoiceList from '../components/Invoice/InvoiceList';
import CreateInvoiceModal from '../components/Invoice/CreateInvoiceModal';
const InvoicePage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    overdue: 0,
    pending: 0
  });

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const [invoicesRes, statsRes] = await Promise.all([
        axios.get('/api/invoice'),
        axios.get('/api/invoice/summary/data')
      ]);
      
      setInvoices(invoicesRes.data);
      setStats({
        total: statsRes.data.totalInvoiced || 0,
        paid: statsRes.data.totalPaid || 0,
        overdue: statsRes.data.totalOverdue || 0,
        pending: statsRes.data.totalPending || 0
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
    
  }, []);

  const handleCreateInvoice = async (newInvoice) => {
    try {
      const res = await axios.post('/api/invoice', newInvoice);
      setInvoices([res.data, ...invoices]);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 p-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Invoice Management</h1>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={fetchInvoices}>
            <RefreshIcon className="h-5 w-5 mr-2" />
            Refresh
          </Button>
          <div className='bg-gray-800 rounded-lg'>
          <Button onClick={() => setIsModalOpen(true)}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Invoice
          </Button>

          </div>
        </div>
      </div>

      <InvoiceStats 
        total={stats.total} 
        paid={stats.paid} 
        overdue={stats.overdue} 
        pending={stats.pending} 
      />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        
        <InvoiceList 
          invoices={invoices} 
          loading={loading} 
          onRefresh={fetchInvoices} 
        />
      </div>

      <CreateInvoiceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateInvoice} 
      />
    </div>
  );
};

export default InvoicePage;
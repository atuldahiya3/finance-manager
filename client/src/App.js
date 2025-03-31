// client/src/App.js
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import DashboardPage from './pages/DashboardPage';
import StockPage from './pages/StockPage';
import IncomePage from './pages/IncomePage';
import ExpensePage from './pages/ExpensePage';
import InvoicePage from './pages/InvoicePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from './components/common/PrivateRoute';
import CreateInvoice from './components/Invoice/CreateInvoiceModal';
import IncomeList from './components/Income/IncomeList';
import AddStockModal from './components/Stock/AddStockModal';
import AddIncome from './components/Income/AddIncomeModal'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="stock" element={<StockPage />} />
        <Route path="stock/add" element={<AddStockModal />} />
        {/* <Route path="stock/edit/:id" element={<AddStockPage />} /> */}
        
        <Route path="income" element={<IncomePage />} />
        
        <Route path="expense" element={<ExpensePage />} />
        
        <Route path="invoice" element={<InvoicePage />} />
        <Route path="invoice/create" element={<CreateInvoice />} />
        {/* <Route path="invoice/edit/:id" element={<CreateInvoicePage />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
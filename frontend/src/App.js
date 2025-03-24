import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/financial/dashboard';
import Sidebar from './components/Financial/slidebar';
import Expense from './pages/financial/expense';

import Invoices from './pages/financial/invoices';//1st
import InvoiceHistory from './pages/financial/invoiceHistory';//2nd

import InvoiceCreate from './pages/financial/invoice-create';//1st
import InvoiceCreate2 from './pages/financial/invoice-create2'; //2nd

import Payment from './pages/financial/Payment';
import InvoiceList from './pages/financial/invoiceDisplay';
//Yeah so, do like this, receptionist can create invoice and click payment button navigate to payment button. 
// while he/she clicks payment button invoice Managment page update it like invoice history. 
// in that page view invoice only can't edit





function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 overflow-auto md:ml-64 transition-all duration-300">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/expense" element={<Expense />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/invoices/create" element={<InvoiceCreate />} />
            <Route path="/invoices/create2" element={<InvoiceCreate2 />} />
            <Route path="/Payment/:invoiceId" element={<Payment />} />
            <Route path="/invoiceHistory" element={<InvoiceHistory />} />
            <Route path="/invoice-list" element={<InvoiceList />} />
            
            
          </Routes>
        </div>
      </div>
    </Router>
  );    
}

export default App;





























/* // src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route ,Navigate} from 'react-router-dom';
import { AuthProvider,useAuth } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import OtpVerify from './pages/OtpVerify';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile'; 
import AdminDashboard from './pages/AdminDashboard';


// Route guard component for admin routes
const AdminRoute = ({ children }) => {
  const { isAuth, user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuth || (user && user.role !== 'Admin')) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/verify-otp" element={<OtpVerify />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
 */
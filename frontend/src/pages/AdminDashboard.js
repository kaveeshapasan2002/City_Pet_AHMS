import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserManagement from '../components/admin/UserManagement';
import AddUserForm from '../components/admin/AddUserForm';
import SecurityLogs from '../components/admin/SecurityLogs';
import BoardingManagement from '../components/admin/BoardingManagement';
import PaymentList from '../components/admin/PaymentList';
import UserStatsSection from '../components/admin/UserStatsSection';

// Import icons from react-icons
import { 
  FaHome, FaUsers, FaShieldAlt, FaPaw, FaMoneyBillWave, 
  FaBox, FaDollarSign, FaCalendarAlt, FaCog, FaChartBar 
} from 'react-icons/fa';

const AdminDashboard = () => {
  const { isAuth, user } = useAuth();
  const [refreshUserList, setRefreshUserList] = useState(false);
  const [activeTab, setActiveTab] = useState('users');

  if (!isAuth) return <Navigate to="/login" />;
  if (user && user.role !== 'Admin') return <Navigate to="/dashboard" />;

  const handleUserAdded = () => setRefreshUserList(prev => !prev);

  // Navigation items with icons
  const navItems = [
    { id: 'users', label: 'User Management', icon: <FaUsers className="mr-2" /> },
    { id: 'security', label: 'Security Logs', icon: <FaShieldAlt className="mr-2" /> },
    { id: 'boarding', label: 'Pet Boarding', icon: <FaPaw className="mr-2" /> },
    { id: 'payment-list', label: 'Payment List', icon: <FaMoneyBillWave className="mr-2" /> },
  ];

  const staticLinks = [
    { to: '/inventory', label: 'Inventory Management', icon: <FaBox className="mr-2" /> },
    { to: '/financial-management', label: 'Financial Management', icon: <FaDollarSign className="mr-2" /> },
  ];

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">PetCare Admin</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin'}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
              alt="Admin"
              className="w-10 h-10 rounded-full border-2 border-blue-200"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-blue-600 rounded-xl shadow-lg sticky top-6 animate-slide-in-left">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <FaHome className="mr-2" /> Dashboard
                </h2>
                <nav className="space-y-1">
                  {navItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center ${
                        activeTab === item.id
                          ? 'bg-blue-800 text-white shadow-md'
                          : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                      } animate-fade-in`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}

                  {staticLinks.map(link => (
                    <Link
                      key={link.label}
                      to={link.to}
                      className="flex items-center px-4 py-3 text-blue-100 hover:bg-blue-700 hover:text-white rounded-lg transition-all duration-300 animate-fade-in"
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="space-y-6">
              {/* User Statistics Section */}
              <UserStatsSection />

              {/* Main Content Area */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fade-in">
                {activeTab === 'users' && (
                  <>
                    <AddUserForm onUserAdded={handleUserAdded} />
                    <UserManagement refreshTrigger={refreshUserList} />
                  </>
                )}
                {activeTab === 'security' && <SecurityLogs />}
                {activeTab === 'boarding' && <BoardingManagement />}
                {activeTab === 'payment-list' && <PaymentList />}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
//updated admin dashboard js with user counts

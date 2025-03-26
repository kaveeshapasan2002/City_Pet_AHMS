import React, { useState } from 'react';
import { LineChart, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  FileText, 
  BarChart2, 
  Users, 
  Calendar, 
  Settings, 
  HelpCircle, 
  Search, 
  Bell, 
  User, 
  DollarSign, 
  TrendingDown, 
  TrendingUp,
  ArrowDown,
  ArrowUp,
  Check,
  Clock
} from 'lucide-react';

const Dashboard = () => {
  // Mock data for the chart
  const chartData = [
    { name: 'Jan', revenue: 8000, expenses: 5500 },
    { name: 'Feb', revenue: 9000, expenses: 6000 },
    { name: 'Mar', revenue: 8500, expenses: 5700 },
    { name: 'Apr', revenue: 9500, expenses: 6000 },
    { name: 'May', revenue: 10000, expenses: 6200 },
    { name: 'Jun', revenue: 12000, expenses: 6500 },
  ];

  // Mock data for recent invoices
  const recentInvoices = [
    { id: 'INV-2301', patient: 'Sarah Johnson', date: '6/1/2023', amount: 120.00, status: 'paid' },
    { id: 'INV-2302', patient: 'Michael Williams', date: '6/2/2023', amount: 85.50, status: 'pending' },
    { id: 'INV-2303', patient: 'Emma Davis', date: '5/25/2023', amount: 195.75, status: 'overdue' },
    { id: 'INV-2304', patient: 'David Miller', date: '6/3/2023', amount: 150.25, status: 'pending' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900">PawFinance</h1>
        </div>
        
        <nav className="mt-6">
          <div className="px-4 mb-2">
            <a href="#" className="flex items-center px-4 py-3 text-gray-700 bg-gray-100 rounded-lg">
              <LayoutDashboard className="w-5 h-5 mr-3" />
              <span className="font-medium">Dashboard</span>
            </a>
          </div>
          
          <div className="px-4 mb-2">
            <a href="#" className="flex items-center px-4 py-3 text-gray-500 hover:bg-gray-100 rounded-lg">
              <ArrowRightLeft className="w-5 h-5 mr-3" />
              <span>Transactions</span>
            </a>
          </div>
          
          <div className="px-4 mb-2">
            <a href="#" className="flex items-center px-4 py-3 text-gray-500 hover:bg-gray-100 rounded-lg">
              <FileText className="w-5 h-5 mr-3" />
              <span>Invoices</span>
            </a>
          </div>
          
          <div className="px-4 mb-2">
            <a href="#" className="flex items-center px-4 py-3 text-gray-500 hover:bg-gray-100 rounded-lg">
              <BarChart2 className="w-5 h-5 mr-3" />
              <span>Reports</span>
            </a>
          </div>
          
          <div className="px-4 mb-2">
            <a href="#" className="flex items-center px-4 py-3 text-gray-500 hover:bg-gray-100 rounded-lg">
              <Users className="w-5 h-5 mr-3" />
              <span>Patients</span>
            </a>
          </div>
          
          <div className="px-4 mb-2">
            <a href="#" className="flex items-center px-4 py-3 text-gray-500 hover:bg-gray-100 rounded-lg">
              <Calendar className="w-5 h-5 mr-3" />
              <span>Calendar</span>
            </a>
          </div>
          
          <div className="px-6 mt-6 mb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">SETTINGS</p>
          </div>
          
          <div className="px-4 mb-2">
            <a href="#" className="flex items-center px-4 py-3 text-gray-500 hover:bg-gray-100 rounded-lg">
              <Settings className="w-5 h-5 mr-3" />
              <span>Settings</span>
            </a>
          </div>
          
          <div className="px-4 mb-2">
            <a href="#" className="flex items-center px-4 py-3 text-gray-500 hover:bg-gray-100 rounded-lg">
              <HelpCircle className="w-5 h-5 mr-3" />
              <span>Help</span>
            </a>
          </div>
        </nav>
        
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-blue-800 font-semibold">
              VH
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Vet Hospital</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center w-64 px-2 py-2 bg-gray-100 rounded-lg">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input 
              type="text" 
              className="w-full bg-transparent border-none outline-none placeholder-gray-400 text-sm"
              placeholder="Search..."
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <User className="w-5 h-5" />
            </button>
          </div>
        </header>
        
        {/* Dashboard content */}
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">Financial overview of your veterinary practice</p>
          </div>
          
          {/* Stats cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {/* Total Revenue */}
            <div className="p-6 bg-white rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <h3 className="text-2xl font-bold mt-1">$24,875.00</h3>
                  <div className="flex items-center mt-1">
                    <span className="text-xs font-medium text-green-500">↑ 12.5% vs last month</span>
                  </div>
                </div>
                <div className="p-2 bg-blue-50 rounded-full">
                  <DollarSign className="w-5 h-5 text-blue-500" />
                </div>
              </div>
            </div>
            
            {/* Expenses */}
            <div className="p-6 bg-white rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Expenses</p>
                  <h3 className="text-2xl font-bold mt-1">$8,942.00</h3>
                  <div className="flex items-center mt-1">
                    <span className="text-xs font-medium text-red-500">↑ 2.7% vs last month</span>
                  </div>
                </div>
                <div className="p-2 bg-blue-50 rounded-full">
                  <TrendingDown className="w-5 h-5 text-blue-500" />
                </div>
              </div>
            </div>
            
            {/* Pending Invoices */}
            <div className="p-6 bg-white rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Pending Invoices</p>
                  <h3 className="text-2xl font-bold mt-1">$6,324.00</h3>
                  <div className="flex items-center mt-1">
                    <span className="text-xs font-medium text-green-500">↑ 4.2% vs last month</span>
                  </div>
                </div>
                <div className="p-2 bg-blue-50 rounded-full">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                </div>
              </div>
            </div>
            
            {/* Monthly Goal */}
            <div className="p-6 bg-white rounded-lg shadow">
              <div>
                <div className="flex justify-between items-start">
                  <p className="text-sm text-gray-500">Monthly Goal</p>
                  <span className="text-xs font-medium text-gray-600">68%</span>
                </div>
                <h3 className="text-2xl font-bold mt-1">$25,000</h3>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">$24,875 of $25,000 monthly target</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Charts and recent invoices */}
          <div className="grid grid-cols-2 gap-6">
            {/* Revenue & Expenses Chart */}
            <div className="p-6 bg-white rounded-lg shadow">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Revenue & Expenses</h3>
                <p className="text-sm text-gray-500">Last 6 months</p>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#3B82F6" name="Revenue" />
                    <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Recent Invoices */}
            <div className="p-6 bg-white rounded-lg shadow">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Invoices</h3>
                <p className="text-sm text-gray-500">Most recent patient invoices</p>
              </div>
              
              <div className="space-y-4">
                {recentInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        invoice.status === 'paid' 
                          ? 'bg-green-100' 
                          : invoice.status === 'overdue' 
                          ? 'bg-red-100' 
                          : 'bg-yellow-100'
                      }`}>
                        {invoice.status === 'paid' ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Clock className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{invoice.patient}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>{invoice.date}</span>
                        </div>
                        <p className="text-xs text-gray-500">{invoice.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${invoice.amount.toFixed(2)}</p>
                      <p className={`text-xs ${
                        invoice.status === 'paid' 
                          ? 'text-green-500' 
                          : invoice.status === 'overdue' 
                          ? 'text-red-500' 
                          : 'text-yellow-500'
                      }`}>
                        {invoice.status === 'paid' ? 'Paid' : invoice.status === 'overdue' ? 'Overdue' : 'Pending'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <button className="w-full py-2 text-sm text-blue-600 hover:text-blue-800">
                  View All Invoices
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
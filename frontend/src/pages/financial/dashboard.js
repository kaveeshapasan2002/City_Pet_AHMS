import React from 'react';
import { DollarSign, CreditCard, FileText, AlertTriangle, TrendingUp, ArrowUpCircle } from 'lucide-react';


const Dashboard = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Financial Dashboard</h1>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded bg-blue-500 text-white">
            Month
          </button>
          <button className="px-3 py-1 rounded bg-gray-200">
            Quarter
          </button>
          <button className="px-3 py-1 rounded bg-gray-200">
            Year
          </button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="p-3 rounded-full bg-green-100 mr-4">
            <DollarSign size={24} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Revenue (MTD)</p>
            <p className="text-2xl font-bold">$37,000</p>
            <p className="text-xs text-green-600 flex items-center">
              <ArrowUpCircle size={12} className="mr-1" /> +8% from last month
            </p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="p-3 rounded-full bg-red-100 mr-4">
            <ArrowUpCircle size={24} className="text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Expenses (MTD)</p>
            <p className="text-2xl font-bold">$21,000</p>
            <p className="text-xs text-red-600 flex items-center">
              <ArrowUpCircle size={12} className="mr-1" /> +5% from last month
            </p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="p-3 rounded-full bg-blue-100 mr-4">
            <TrendingUp size={24} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Net Profit (MTD)</p>
            <p className="text-2xl font-bold">$16,000</p>
            <p className="text-xs text-green-600 flex items-center">
              <ArrowUpCircle size={12} className="mr-1" /> +11% from last month
            </p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 mr-4">
            <AlertTriangle size={24} className="text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Outstanding Amount</p>
            <p className="text-2xl font-bold">$1,740</p>
            <p className="text-xs text-red-600 flex items-center">
              <ArrowUpCircle size={12} className="mr-1" /> 4 overdue invoices
            </p>
          </div>
        </div>
      </div>

      {/* Recent Invoices Table */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Invoices</h2>
          <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient/Owner</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600">#INV-2023-1001</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  <div>Max (Dog)</div>
                  <div className="text-xs">John Smith</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Mar 15, 2023</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium">$450.00</td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Paid
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600">#INV-2023-1002</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  <div>Bella (Cat)</div>
                  <div className="text-xs">Sarah Johnson</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Mar 16, 2023</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium">$275.50</td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600">#INV-2023-1003</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  <div>Rocky (Dog)</div>
                  <div className="text-xs">Mike Thompson</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Mar 17, 2023</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium">$780.00</td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Overdue
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600">#INV-2023-1004</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  <div>Luna (Bird)</div>
                  <div className="text-xs">Emily Wilson</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Mar 18, 2023</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium">$120.75</td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    Partially Paid
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
            <FileText size={24} className="mb-2 text-blue-600" />
            <span className="text-sm">Create Invoice</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
            <CreditCard size={24} className="mb-2 text-green-600" />
            <span className="text-sm">Record Payment</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
            <DollarSign size={24} className="mb-2 text-red-600" />
            <span className="text-sm">Add Expense</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
            <FileText size={24} className="mb-2 text-purple-600" />
            <span className="text-sm">Generate Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
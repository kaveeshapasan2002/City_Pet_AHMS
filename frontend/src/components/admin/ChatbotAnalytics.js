//component to display chatbot analytics and logs


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaChartLine, FaExclamationTriangle, FaComment, 
  FaCalendarAlt, FaDownload, FaFilter, FaSearch,
  FaFilePdf, FaFileAlt
} from 'react-icons/fa';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, BarChart, Bar, 
  PieChart, Pie, Cell
} from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Configure Axios base URL
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const ChatbotAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalInteractions: 0,
    emergencyTriages: 0,
    averageResponseTime: 0,
    topIntents: [],
    interactionsByDay: [],
    satisfactionRate: 0,
    emergencyBreakdown: []
  });
  
  const [chatLogs, setChatLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [timeRange, setTimeRange] = useState('week');
  const [filterOptions, setFilterOptions] = useState({
    emergencyLevel: 'all',
    intent: 'all',
    searchTerm: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [exportType, setExportType] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  const EMERGENCY_COLORS = {
    critical: '#FF0000',
    urgent: '#FFA500',
    moderate: '#FFFF00',
    none: '#00C49F'
  };
  
  useEffect(() => {
    fetchData();
  }, [timeRange]);
  
  useEffect(() => {
    applyFilters();
  }, [chatLogs, filterOptions]);
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    // Check for token presence
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to view analytics.');
      setLoading(false);
      window.location.href = '/login'; // Redirect to login page
      return;
    }

    try {
      // Get analytics data
      const analyticsResponse = await axios.get('/api/admin/chatbot/analytics', {
        params: { timeRange },
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Get chat logs
      const logsResponse = await axios.get('/api/admin/chatbot/logs', {
        params: { timeRange },
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAnalytics(analyticsResponse.data);
      setChatLogs(logsResponse.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching chatbot data:', {
        message: err.message,
        response: err.response ? {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers
        } : null,
        request: err.request ? err.request : null,
        config: err.config
      });

      let errorMessage = 'Failed to load chatbot analytics. Please try again later.';
      if (err.response) {
        switch (err.response.status) {
          case 401:
            errorMessage = 'Unauthorized. Please log in again.';
            localStorage.removeItem('token');
            window.location.href = '/login';
            break;
          case 403:
            errorMessage = 'Admin access required.';
            break;
          case 404:
            errorMessage = 'Analytics endpoint not found.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = err.response.data.message || errorMessage;
        }
      } else if (err.request) {
        errorMessage = 'Unable to reach the server. Please check your network connection.';
      }

      setError(errorMessage);
      setLoading(false);
    }
  };
  
  const applyFilters = () => {
    let filtered = [...chatLogs];
    
    // Filter by emergency level
    if (filterOptions.emergencyLevel !== 'all') {
      filtered = filtered.filter(log => log.emergencyLevel === filterOptions.emergencyLevel);
    }
    
    // Filter by intent
    if (filterOptions.intent !== 'all') {
      filtered = filtered.filter(log => log.intent === filterOptions.intent);
    }
    
    // Filter by search term
    if (filterOptions.searchTerm) {
      const term = filterOptions.searchTerm.toLowerCase();
      filtered = filtered.filter(log => 
        log.userMessage.toLowerCase().includes(term) || 
        log.botResponse.toLowerCase().includes(term)
      );
    }
    
    setFilteredLogs(filtered);
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSearchChange = (e) => {
    setFilterOptions(prev => ({
      ...prev,
      searchTerm: e.target.value
    }));
  };
  
  // Function to export data as CSV
  const exportToCSV = () => {
    setIsExporting(true);
    
    try {
      // Create CSV content
      const headers = "Date,User ID,Intent,Emergency Level,User Message,Bot Response,Satisfaction\n";
      
      const csvContent = filteredLogs.reduce((acc, log) => {
        // Format each row and escape commas, quotes, etc.
        const row = [
          new Date(log.createdAt).toLocaleString(),
          log.userId || 'Anonymous',
          log.intent,
          log.emergencyLevel,
          `"${log.userMessage.replace(/"/g, '""')}"`,
          `"${log.botResponse.replace(/"/g, '""')}"`,
          log.feedbackRating || 'N/A'
        ].join(',');
        
        return acc + row + "\n";
      }, headers);
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `chatbot-logs-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      alert('Failed to export data to CSV. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };
  
  // Function to export data as PDF
  const exportToPDF = () => {
    setIsExporting(true);
    
    try {
      // Initialize jsPDF
      const doc = new jsPDF();
      
      // Add title and hospital logo
      doc.setFontSize(20);
      doc.setTextColor(0, 102, 204);
      doc.text('PetCare Animal Hospital', 105, 20, { align: 'center' });
      
      // Add subtitle
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Chatbot Conversation Logs', 105, 30, { align: 'center' });
      
      // Add report metadata
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 40);
      doc.text(`Time Range: ${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}`, 14, 45);
      
      // Add filter information
      let filterText = 'Filters: ';
      if (filterOptions.emergencyLevel !== 'all') {
        filterText += `Emergency Level: ${filterOptions.emergencyLevel}, `;
      }
      if (filterOptions.intent !== 'all') {
        filterText += `Intent: ${filterOptions.intent}, `;
      }
      if (filterOptions.searchTerm) {
        filterText += `Search: "${filterOptions.searchTerm}", `;
      }
      
      if (filterText !== 'Filters: ') {
        filterText = filterText.slice(0, -2); // Remove trailing comma and space
        doc.text(filterText, 14, 50);
      } else {
        doc.text('Filters: None', 14, 50);
      }
      
      // Add summary statistics
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Summary Statistics', 14, 60);
      
      doc.setFontSize(10);
      doc.text(`Total Conversations: ${filteredLogs.length}`, 20, 65);
      
      // Count emergency levels
      const emergencyCounts = filteredLogs.reduce((counts, log) => {
        counts[log.emergencyLevel] = (counts[log.emergencyLevel] || 0) + 1;
        return counts;
      }, {});
      
      let emergencyText = 'Emergency Levels: ';
      Object.entries(emergencyCounts).forEach(([level, count]) => {
        emergencyText += `${level}: ${count}, `;
      });
      
      if (emergencyText !== 'Emergency Levels: ') {
        emergencyText = emergencyText.slice(0, -2); // Remove trailing comma and space
        doc.text(emergencyText, 20, 70);
      }
      
      // Count intents
      const intentCounts = filteredLogs.reduce((counts, log) => {
        counts[log.intent] = (counts[log.intent] || 0) + 1;
        return counts;
      }, {});
      
      let intentText = 'Top Intents: ';
      Object.entries(intentCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .forEach(([intent, count]) => {
          intentText += `${intent.replace(/_/g, ' ')}: ${count}, `;
        });
      
      if (intentText !== 'Top Intents: ') {
        intentText = intentText.slice(0, -2); // Remove trailing comma and space
        doc.text(intentText, 20, 75);
      }
      
      // Set up the table data
      const tableColumn = ["Date/Time", "User", "Intent", "Emergency", "Message", "Rating"];
      const tableRows = [];
      
      // Add data to rows (limited to prevent overly large PDFs)
      const maxRowsPerPage = 25;
      const maxPages = 10;
      const limitedLogs = filteredLogs.slice(0, maxRowsPerPage * maxPages);
      
      limitedLogs.forEach(log => {
        const tableRow = [
          new Date(log.createdAt).toLocaleString(),
          log.userId ? log.userId.substring(0, 8) : 'Anonymous',
          log.intent.replace(/_/g, ' '),
          log.emergencyLevel,
          log.userMessage.length > 40 ? `${log.userMessage.substring(0, 40)}...` : log.userMessage,
          log.feedbackRating ? `${log.feedbackRating}/5` : 'N/A'
        ];
        tableRows.push(tableRow);
      });
      
      // Generate the table
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 85,
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: {
          0: { cellWidth: 30 }, // Date/Time
          1: { cellWidth: 20 }, // User
          2: { cellWidth: 25 }, // Intent
          3: { cellWidth: 20 }, // Emergency
          4: { cellWidth: 65 }, // Message
          5: { cellWidth: 15 }  // Rating
        },
        headStyles: {
          fillColor: [0, 102, 204],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240]
        },
        didDrawPage: function(data) {
          // Add header to each page
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          doc.text('PetCare Animal Hospital - Chatbot Logs', data.settings.margin.left, 10);
          
          // Add page number
          doc.text(`Page ${doc.internal.getNumberOfPages()}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
          
          // Add generation date on each page
          doc.text(`Generated: ${new Date().toLocaleString()}`, doc.internal.pageSize.width - 60, doc.internal.pageSize.height - 10);
        }
      });
      
      // Add note if logs were limited
      if (filteredLogs.length > limitedLogs.length) {
        const currentY = doc.previousAutoTable.finalY + 10;
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Note: Only showing ${limitedLogs.length} of ${filteredLogs.length} total logs. Export to CSV for complete data.`, 14, currentY);
      }
      
      // Save the PDF
      doc.save(`petcare-chatbot-logs-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('Failed to export data to PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };
  
  // Handle export button click
  const handleExport = (type) => {
    setExportType(type);
    
    if (type === 'csv') {
      exportToCSV();
    } else if (type === 'pdf') {
      exportToPDF();
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading chatbot analytics...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <FaExclamationTriangle className="text-4xl mx-auto mb-4" />
        <p>{error}</p>
        <button 
          onClick={fetchData} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 p-4 text-white">
        <h2 className="text-xl font-semibold flex items-center">
          <FaComment className="mr-2" /> Chatbot Analytics Dashboard
        </h2>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-500 text-sm">Total Interactions</h3>
            <FaComment className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold">{analytics.totalInteractions}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-500 text-sm">Emergency Triages</h3>
            <FaExclamationTriangle className="text-orange-500" />
          </div>
          <p className="text-2xl font-bold">{analytics.emergencyTriages}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-500 text-sm">Avg. Response Time</h3>
            <FaChartLine className="text-green-500" />
          </div>
          <p className="text-2xl font-bold">{analytics.averageResponseTime.toFixed(2)}s</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-500 text-sm">Satisfaction Rate</h3>
            <FaChartLine className="text-purple-500" />
          </div>
          <p className="text-2xl font-bold">{analytics.satisfactionRate}%</p>
        </div>
      </div>
      
      {/* Time Range Selector */}
      <div className="px-4 py-2 flex items-center space-x-2 border-b border-gray-200">
        <FaCalendarAlt className="text-gray-500" />
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          className="border-0 focus:ring-0 text-sm"
        >
          <option value="day">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        {/* Interactions By Day Chart */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h3 className="text-gray-700 font-medium mb-4">Interactions Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={analytics.interactionsByDay}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="interactions" 
                  stroke="#0088FE" 
                  name="Interactions"
                />
                <Line 
                  type="monotone" 
                  dataKey="emergencies" 
                  stroke="#FF8042" 
                  name="Emergencies"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Top Intents Chart */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h3 className="text-gray-700 font-medium mb-4">Top Conversation Intents</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics.topIntents}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#0088FE" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Emergency Breakdown Chart */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h3 className="text-gray-700 font-medium mb-4">Emergency Level Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.emergencyBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {analytics.emergencyBreakdown.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={EMERGENCY_COLORS[entry.name] || COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Satisfaction Trend Chart */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h3 className="text-gray-700 font-medium mb-4">User Satisfaction Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={analytics.interactionsByDay}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="satisfaction" 
                  stroke="#00C49F" 
                  name="Satisfaction (1-5)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Chat Logs Table Section */}
      <div className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h3 className="text-gray-700 font-medium mb-2 md:mb-0">Conversation Logs</h3>
          
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                value={filterOptions.searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            
            {/* Filters */}
            <div className="flex space-x-2">
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  name="emergencyLevel"
                  value={filterOptions.emergencyLevel}
                  onChange={handleFilterChange}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">All Levels</option>
                  <option value="critical">Critical</option>
                  <option value="urgent">Urgent</option>
                  <option value="moderate">Moderate</option>
                  <option value="none">None</option>
                </select>
              </div>
              
              <select
                name="intent"
                value={filterOptions.intent}
                onChange={handleFilterChange}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Intents</option>
                <option value="emergency_help">Emergency Help</option>
                <option value="appointment_booking">Appointment Booking</option>
                <option value="hospital_info">Hospital Info</option>
                <option value="pet_care_info">Pet Care Info</option>
                <option value="service_inquiry">Service Inquiry</option>
                <option value="pricing_inquiry">Pricing Inquiry</option>
                <option value="general_question">General Question</option>
                <option value="other">Other</option>
              </select>
              
              {/* Export Options */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleExport('csv')}
                  disabled={isExporting}
                  className={`px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-sm ${isExporting && exportType === 'csv' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isExporting && exportType === 'csv' ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <FaFileAlt className="mr-2" /> CSV
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  disabled={isExporting}
                  className={`px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center text-sm ${isExporting && exportType === 'pdf' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isExporting && exportType === 'pdf' ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <FaFilePdf className="mr-2" /> PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emergency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.length > 0 ? (
                filteredLogs.map(log => (
                  <tr 
                    key={log._id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedChat(log)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(log.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.userId ? log.userId : 'Anonymous'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {log.intent.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.emergencyLevel === 'critical' ? 'bg-red-100 text-red-800' :
                        log.emergencyLevel === 'urgent' ? 'bg-orange-100 text-orange-800' :
                        log.emergencyLevel === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {log.emergencyLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {log.userMessage.length > 50 ? `${log.userMessage.substring(0, 50)}...` : log.userMessage}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.feedbackRating ? (
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span 
                              key={i} 
                              className={`text-sm ${i < log.feedbackRating ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      ) : (
                        'N/A'
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No chat logs match your current filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Chat Detail Modal */}
      {selectedChat && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center bg-blue-600 text-white p-4">
              <h3 className="font-medium">Chat Conversation Details</h3>
              <button 
                onClick={() => setSelectedChat(null)}
                className="text-white hover:text-blue-200 focus:outline-none"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Date/Time</p>
                  <p className="font-medium">{formatDate(selectedChat.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="font-medium">{selectedChat.userId || 'Anonymous'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Intent</p>
                  <p className="font-medium">{selectedChat.intent.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Emergency Level</p>
                  <p className={`font-medium ${
                    selectedChat.emergencyLevel === 'critical' ? 'text-red-600' :
                    selectedChat.emergencyLevel === 'urgent' ? 'text-orange-600' :
                    selectedChat.emergencyLevel === 'moderate' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {selectedChat.emergencyLevel}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Response Time</p>
                  <p className="font-medium">{selectedChat.responseTime ? `${selectedChat.responseTime}ms` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">User Feedback</p>
                  <div className="flex items-center">
                    {selectedChat.feedbackRating ? (
                      <>
                        <div className="flex mr-2">
                          {[...Array(5)].map((_, i) => (
                            <span 
                              key={i} 
                              className={i < selectedChat.feedbackRating ? 'text-yellow-400' : 'text-gray-300'}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span>({selectedChat.feedbackRating}/5)</span>
                      </>
                    ) : (
                      'No feedback provided'
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">User Message</p>
                <div className="p-4 bg-blue-50 rounded-lg">
                  {selectedChat.userMessage}
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Bot Response</p>
                <div className="p-4 bg-gray-50 rounded-lg">
                  {selectedChat.botResponse}
                </div>
              </div>
              
              {selectedChat.feedbackComment && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Feedback Comment</p>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    {selectedChat.feedbackComment}
                  </div>
                </div>
              )}
              
              <div className="mt-6 text-right">
                <button
                  onClick={() => {
                    // Generate single chat PDF
                    const doc = new jsPDF();
                    
                    // Add title
                    doc.setFontSize(16);
                    doc.setTextColor(0, 102, 204);
                    doc.text('PetCare Animal Hospital', 105, 20, { align: 'center' });
                    doc.text('Chatbot Conversation Details', 105, 30, { align: 'center' });
                    
                    // Add metadata
                    doc.setFontSize(12);
                    doc.setTextColor(0, 0, 0);
                    doc.text('Conversation Details', 14, 45);
                    
                    // Add details
                    doc.setFontSize(10);
                    doc.text(`Date/Time: ${formatDate(selectedChat.createdAt)}`, 20, 55);
                    doc.text(`User ID: ${selectedChat.userId || 'Anonymous'}`, 20, 60);
                    doc.text(`Intent: ${selectedChat.intent.replace(/_/g, ' ')}`, 20, 65);
                    doc.text(`Emergency Level: ${selectedChat.emergencyLevel}`, 20, 70);
                    doc.text(`Response Time: ${selectedChat.responseTime ? `${selectedChat.responseTime}ms` : 'N/A'}`, 20, 75);
                    doc.text(`User Feedback: ${selectedChat.feedbackRating ? `${selectedChat.feedbackRating}/5` : 'None'}`, 20, 80);
                    
                    // Add user message
                    doc.setFontSize(12);
                    doc.text('User Message:', 14, 90);
                    
                    doc.setFontSize(10);
                    const userMessageLines = doc.splitTextToSize(selectedChat.userMessage, 180);
                    doc.text(userMessageLines, 14, 95);
                    
                    // Calculate position for bot response
                    let yPos = 95 + (userMessageLines.length * 5) + 10;
                    
                    // Add bot response
                    doc.setFontSize(12);
                    doc.text('Bot Response:', 14, yPos);
                    
                    doc.setFontSize(10);
                    const botResponseLines = doc.splitTextToSize(selectedChat.botResponse, 180);
                    doc.text(botResponseLines, 14, yPos + 5);
                    
                    // Save PDF
                    doc.save(`petcare-chat-${selectedChat._id}.pdf`);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center text-sm ml-auto"
                >
                  <FaFilePdf className="mr-2" /> Export This Conversation as PDF
                </button>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-2">
              {selectedChat.emergencyLevel !== 'none' && !selectedChat.escalated && (
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Escalate to Staff
                </button>
              )}
              <button 
                onClick={() => setSelectedChat(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotAnalytics;
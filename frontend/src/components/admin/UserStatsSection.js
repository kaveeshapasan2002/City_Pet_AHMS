// src/components/admin/UserStatsSection.js
import React, { useState, useEffect } from 'react';
import { getUserStats } from '../../api/admin';
import CountCard from './CountCard';
import { FaUserMd, FaPaw, FaUserShield, FaUsers } from 'react-icons/fa';

const UserStatsSection = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    roles: {
      "Admin": 0,
      "Veterinarian": 0,
      "Pet Owner": 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getUserStats();
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError(err.message || "Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Calculate percentages
  const calculatePercentage = (count) => {
    if (stats.totalUsers === 0) return 0;
    return Math.round((count / stats.totalUsers) * 100);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-800">
        <p>Error loading statistics: {error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <CountCard 
        title="Total Users" 
        count={stats.totalUsers} 
        icon={<FaUsers size={24} />} 
        color="border-blue-500"
      />
      <CountCard 
        title="Pet Owners" 
        count={stats.roles["Pet Owner"]} 
        icon={<FaPaw size={24} />} 
        color="border-green-500"
        percentage={calculatePercentage(stats.roles["Pet Owner"])}
      />
      <CountCard 
        title="Veterinarians" 
        count={stats.roles["Veterinarian"]} 
        icon={<FaUserMd size={24} />} 
        color="border-purple-500"
        percentage={calculatePercentage(stats.roles["Veterinarian"])}
      />
      <CountCard 
        title="Admins" 
        count={stats.roles["Admin"]} 
        icon={<FaUserShield size={24} />} 
        color="border-red-500"
        percentage={calculatePercentage(stats.roles["Admin"])}
      />
    </div>
  );
};

export default UserStatsSection;
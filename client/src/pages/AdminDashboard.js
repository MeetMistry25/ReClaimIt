import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UsersIcon, 
  ShieldExclamationIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ArrowRightIcon,
  ChartBarIcon,
  UserGroupIcon,
  CubeIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          navigate('/admin/login');
          return;
        }
        throw new Error('Failed to fetch stats');
      }

      const result = await response.json();
      setStats(result.stats);
    } catch (error) {
      setError('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
          <button
            onClick={fetchDashboardStats}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: UsersIcon,
      color: 'bg-blue-500',
      textColor: 'text-blue-500'
    },
    {
      title: 'Active Users',
      value: stats?.activeUsers || 0,
      icon: CheckCircleIcon,
      color: 'bg-green-500',
      textColor: 'text-green-500'
    },
    {
      title: 'Blocked Users',
      value: stats?.blockedUsers || 0,
      icon: ShieldExclamationIcon,
      color: 'bg-red-500',
      textColor: 'text-red-500'
    },
    {
      title: 'Total Items',
      value: (stats?.totalFoundItems || 0) + (stats?.totalLostItems || 0),
      icon: CubeIcon,
      color: 'bg-purple-500',
      textColor: 'text-purple-500'
    },
    {
      title: 'Found Items',
      value: stats?.totalFoundItems || 0,
      icon: CheckCircleIcon,
      color: 'bg-green-500',
      textColor: 'text-green-500'
    },
    {
      title: 'Lost Items',
      value: stats?.totalLostItems || 0,
      icon: ExclamationTriangleIcon,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-500'
    }
  ];

  const quickActions = [
    {
      title: 'Manage Users',
      description: 'View, search, and manage all users',
      icon: UserGroupIcon,
      action: () => navigate('/admin/users'),
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'Manage Items',
      description: 'View and manage all reported items',
      icon: CubeIcon,
      action: () => navigate('/admin/items'),
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      title: 'Manage Claims',
      description: 'Review and process item claims',
      icon: ShieldExclamationIcon,
      action: () => navigate('/admin/claims'),
      color: 'bg-red-600 hover:bg-red-700'
    },
    
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 dark:text-gray-300">
                Welcome, {JSON.parse(localStorage.getItem('adminUser') || '{}').name}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                  <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={action.action}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                      <action.icon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{action.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                    </div>
                  </div>
                  <ArrowRightIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity (Last 7 Days)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats?.recentFoundItems || 0}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">New Found Items</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats?.recentLostItems || 0}</p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">New Lost Items</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

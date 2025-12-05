'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import AdminSidebar from '@/app/components/AdminSidebar';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Shield,
  MessageSquare,
  TrendingUp,
  Activity
} from 'lucide-react';

const AdminDashboard = () => {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is admin
    const userCookie = Cookies.get('user');
    if (userCookie) {
      const userData = JSON.parse(userCookie);
      if (userData.role !== 'admin') {
        router.push('/');
        return;
      }
      setUser(userData);
    } else {
      router.push('/login');
      return;
    }

    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = Cookies.get('token');
      const res = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color, bgColor, trend }) => (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-slate-400 font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
          {trend && (
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className={`w-4 h-4 mr-1 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`} />
              <span className={trend > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
              <span className="text-gray-500 dark:text-slate-400 ml-1">vs last week</span>
            </div>
          )}
        </div>
        <div className={`w-16 h-16 ${bgColor} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950">
      <AdminSidebar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            Here's what's happening with your platform today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            label="Total Users"
            value={stats?.users?.total || 0}
            color="text-blue-600"
            bgColor="bg-blue-100 dark:bg-blue-900/30"
          />
          <StatCard
            icon={UserCheck}
            label="Active Users"
            value={stats?.users?.active || 0}
            color="text-green-600"
            bgColor="bg-green-100 dark:bg-green-900/30"
          />
          <StatCard
            icon={Shield}
            label="Admin Users"
            value={stats?.users?.admins || 0}
            color="text-amber-600"
            bgColor="bg-amber-100 dark:bg-amber-900/30"
          />
          <StatCard
            icon={UserX}
            label="Suspended"
            value={stats?.users?.suspended || 0}
            color="text-red-600"
            bgColor="bg-red-100 dark:bg-red-900/30"
          />
        </div>

        {/* Conversations Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={MessageSquare}
            label="Total Conversations"
            value={stats?.conversations?.total || 0}
            color="text-purple-600"
            bgColor="bg-purple-100 dark:bg-purple-900/30"
          />
          <StatCard
            icon={Activity}
            label="Active Conversations"
            value={stats?.conversations?.active || 0}
            color="text-indigo-600"
            bgColor="bg-indigo-100 dark:bg-indigo-900/30"
          />
          <StatCard
            icon={TrendingUp}
            label="Recent (7 days)"
            value={stats?.conversations?.recent || 0}
            color="text-teal-600"
            bgColor="bg-teal-100 dark:bg-teal-900/30"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/admin/users/create')}
              className="p-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:opacity-90 transition-opacity text-left"
            >
              <Users className="w-6 h-6 mb-2" />
              <h3 className="font-semibold">Add New User</h3>
              <p className="text-sm opacity-90">Create a new user account</p>
            </button>
            <button
              onClick={() => router.push('/admin/users')}
              className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-opacity text-left"
            >
              <Shield className="w-6 h-6 mb-2" />
              <h3 className="font-semibold">Manage Users</h3>
              <p className="text-sm opacity-90">View and edit all users</p>
            </button>
            <button
              onClick={() => router.push('/library')}
              className="p-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:opacity-90 transition-opacity text-left"
            >
              <Activity className="w-6 h-6 mb-2" />
              <h3 className="font-semibold">File Manager</h3>
              <p className="text-sm opacity-90">Manage documents</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

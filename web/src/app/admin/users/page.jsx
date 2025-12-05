'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import AdminSidebar from '@/app/components/AdminSidebar';
import UserTable from '@/app/components/UserTable';
import UserForm from '@/app/components/UserForm';
import EmailForm from '@/app/components/EmailForm';
import { useNotification } from '@/app/components/NotificationProvider';
import { Search, Plus, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminUsers = () => {
  const router = useRouter();
  const { showToast, showConfirm } = useNotification();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showUserForm, setShowUserForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if user is admin
    const userCookie = Cookies.get('user');
    if (userCookie) {
      const userData = JSON.parse(userCookie);
      if (userData.role !== 'admin') {
        router.push('/');
        return;
      }
    } else {
      router.push('/login');
      return;
    }

    fetchUsers();
  }, [searchQuery, roleFilter, statusFilter, pagination.page]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const token = Cookies.get('token');
      const params = new URLSearchParams({
        page: pagination.page,
        limit: 10,
        search: searchQuery,
        role: roleFilter,
        status: statusFilter,
      });

      const res = await fetch(`/api/admin/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
        setPagination(data.pagination);
      } else {
        showToast(data.error || 'Failed to fetch users', 'error');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showToast('Failed to fetch users', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (formData) => {
    try {
      setIsSubmitting(true);
      const token = Cookies.get('token');
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        showToast('User created successfully', 'success');
        setShowUserForm(false);
        fetchUsers();
      } else {
        showToast(data.error || 'Failed to create user', 'error');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      showToast('Failed to create user', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUser = async (formData) => {
    try {
      setIsSubmitting(true);
      const token = Cookies.get('token');
      const res = await fetch(`/api/admin/users/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        showToast('User updated successfully', 'success');
        setShowUserForm(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        showToast(data.error || 'Failed to update user', 'error');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      showToast('Failed to update user', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (user) => {
    const confirmed = await showConfirm({
      title: 'Delete User',
      message: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
    });

    if (!confirmed) return;

    try {
      const token = Cookies.get('token');
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        showToast('User deleted successfully', 'success');
        fetchUsers();
      } else {
        showToast(data.error || 'Failed to delete user', 'error');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showToast('Failed to delete user', 'error');
    }
  };

  const handleSuspendUser = async (user) => {
    // Prevent suspending admin accounts
    if (user.role === 'admin') {
      showToast('Impossible de suspendre un compte administrateur', 'error');
      return;
    }

    const action = user.isActive ? 'suspend' : 'activate';
    const confirmed = await showConfirm({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
      message: `Are you sure you want to ${action} ${user.name}?`,
      confirmText: action.charAt(0).toUpperCase() + action.slice(1),
      cancelText: 'Cancel',
      type: user.isActive ? 'warning' : 'success',
    });

    if (!confirmed) return;

    try {
      const token = Cookies.get('token');
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'toggle-status' }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`User ${action}d successfully`, 'success');
        fetchUsers();
      } else {
        showToast(data.error || `Failed to ${action} user`, 'error');
      }
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      showToast(`Failed to ${action} user`, 'error');
    }
  };

  const handleSendEmail = async (formData) => {
    try {
      setIsSubmitting(true);
      const token = Cookies.get('token');
      const res = await fetch(`/api/admin/users/${selectedUser._id}/email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        showToast('Email sent successfully', 'success');
        setShowEmailForm(false);
        setSelectedUser(null);
      } else {
        showToast(data.error || 'Failed to send email', 'error');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      showToast('Failed to send email', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950">
      <AdminSidebar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Manage Users
            </h1>
            <p className="text-gray-600 dark:text-slate-400">
              {pagination.total} total users
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedUser(null);
              setShowUserForm(true);
            }}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:opacity-90 transition-opacity shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Add New User</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              />
            </div>

            {/* Role Filter */}
            <div>
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              >
                <option value="">All Roles</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <UserTable
              users={users}
              onEdit={(user) => {
                setSelectedUser(user);
                setShowUserForm(true);
              }}
              onDelete={handleDeleteUser}
              onSuspend={handleSuspendUser}
              onEmail={(user) => {
                setSelectedUser(user);
                setShowEmailForm(true);
              }}
            />

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  Page {pagination.page} of {pagination.pages}
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.pages}
                    className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {showUserForm && (
        <UserForm
          user={selectedUser}
          onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
          onCancel={() => {
            setShowUserForm(false);
            setSelectedUser(null);
          }}
          isLoading={isSubmitting}
        />
      )}

      {showEmailForm && selectedUser && (
        <EmailForm
          user={selectedUser}
          onSend={handleSendEmail}
          onCancel={() => {
            setShowEmailForm(false);
            setSelectedUser(null);
          }}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
};

export default AdminUsers;

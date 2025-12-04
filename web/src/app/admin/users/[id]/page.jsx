'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import AdminSidebar from '@/app/components/AdminSidebar';
import { useNotification } from '@/app/components/NotificationProvider';
import { ArrowLeft, Save, Key, Trash2, Ban, CheckCircle } from 'lucide-react';

const EditUser = ({ params }) => {
  const router = useRouter();
  const { showToast, showConfirm } = useNotification();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    isActive: true,
  });
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  useEffect(() => {
    // Check if admin
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

    // Handle async params
    const loadUser = async () => {
      const resolvedParams = await params;
      if (resolvedParams?.id) {
        fetchUser(resolvedParams.id);
      }
    };
    loadUser();
  }, []);

  const fetchUser = async (userId) => {
    try {
      const token = Cookies.get('token');
      const res = await fetch(`/api/admin/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setFormData({
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          isActive: data.user.isActive,
        });
      } else {
        showToast(data.error || 'User not found', 'error');
        router.push('/admin/users');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      showToast('Failed to fetch user', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      const resolvedParams = await params;
      const token = Cookies.get('token');
      const res = await fetch(`/api/admin/users/${resolvedParams.id}`, {
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
        router.push('/admin/users');
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

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    const confirmed = await showConfirm({
      title: 'Reset Password',
      message: 'Are you sure you want to reset this user\'s password?',
      confirmText: 'Reset',
      cancelText: 'Cancel',
      type: 'warning',
    });

    if (!confirmed) return;

    try {
      const resolvedParams = await params;
      const token = Cookies.get('token');
      const res = await fetch(`/api/admin/users/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${resolvedParams.id}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'reset-password', newPassword }),
      });

      const data = await res.json();
      if (data.success) {
        showToast('Password reset successfully', 'success');
        setNewPassword('');
        setShowPasswordReset(false);
      } else {
        showToast(data.error || 'Failed to reset password', 'error');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      showToast('Failed to reset password', 'error');
    }
  };

  const handleToggleStatus = async () => {
    const action = user.isActive ? 'suspend' : 'activate';
    const confirmed = await showConfirm({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
      message: `Are you sure you want to ${action} this user?`,
      confirmText: action.charAt(0).toUpperCase() + action.slice(1),
      cancelText: 'Cancel',
      type: user.isActive ? 'warning' : 'success',
    });

    if (!confirmed) return;

    try {
      const resolvedParams = await params;
      const token = Cookies.get('token');
      const res = await fetch(`/api/admin/users/${resolvedParams.id}`, {
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
        fetchUser(resolvedParams.id);
      } else {
        showToast(data.error || `Failed to ${action} user`, 'error');
      }
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      showToast(`Failed to ${action} user`, 'error');
    }
  };

  const handleDelete = async () => {
    const confirmed = await showConfirm({
      title: 'Delete User',
      message: 'Are you sure you want to delete this user? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
    });

    if (!confirmed) return;

    try {
      const resolvedParams = await params;
      const token = Cookies.get('token');
      const res = await fetch(`/api/admin/users/${resolvedParams.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        showToast('User deleted successfully', 'success');
        router.push('/admin/users');
      } else {
        showToast(data.error || 'Failed to delete user', 'error');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showToast('Failed to delete user', 'error');
    }
  };

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

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin/users')}
            className="flex items-center space-x-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Users</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Edit User: {user?.name}
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            Update user information and settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                User Information
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Role *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-colors"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                  <input
                    type="checkbox"
                    name="isActive"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-5 h-5 text-amber-500 border-gray-300 dark:border-slate-600 rounded focus:ring-amber-500 mt-0.5"
                  />
                  <div>
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-slate-300">
                      Active Account
                    </label>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                      Inactive accounts cannot log in
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => router.push('/admin/users')}
                    className="px-6 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors font-medium"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-medium shadow-lg"
                    disabled={isSubmitting}
                  >
                    <Save className="w-5 h-5" />
                    <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-6">
            {/* Password Reset */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Key className="w-5 h-5 mr-2" />
                Reset Password
              </h3>
              
              {!showPasswordReset ? (
                <button
                  onClick={() => setShowPasswordReset(true)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Reset Password
                </button>
              ) : (
                <div className="space-y-3">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password (min. 6 chars)"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                    minLength={6}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleResetPassword}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => {
                        setShowPasswordReset(false);
                        setNewPassword('');
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Status Actions */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handleToggleStatus}
                  className={`w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                    user?.isActive
                      ? 'bg-orange-600 hover:bg-orange-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {user?.isActive ? (
                    <>
                      <Ban className="w-4 h-4" />
                      <span>Suspend User</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Activate User</span>
                    </>
                  )}
                </button>

                <button
                  onClick={async () => {
                    const resolvedParams = await params;
                    router.push(`/admin/users/${resolvedParams.id}/email`);
                  }}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Send Email
                </button>

                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete User</span>
                </button>
              </div>
            </div>

            {/* User Info */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                User Details
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-slate-400">User ID</p>
                  <p className="text-gray-900 dark:text-white font-mono">{user?._id}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-slate-400">Created</p>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-slate-400">Last Updated</p>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(user?.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditUser;

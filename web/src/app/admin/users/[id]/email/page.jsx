'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import AdminNavbar from '@/app/components/AdminNavbar';
import { useNotification } from '@/app/components/NotificationProvider';
import { ArrowLeft, Send, Mail } from 'lucide-react';

const SendEmailToUser = ({ params }) => {
  const router = useRouter();
  const { showToast } = useNotification();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });

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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      const resolvedParams = await params;
      const token = Cookies.get('token');
      const res = await fetch(`/api/admin/users/${resolvedParams.id}/email`, {
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
        router.push(`/admin/users/${params.id}`);
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

  const applyTemplate = (template) => {
    const templates = {
      welcome: {
        subject: 'Bienvenue sur la plateforme',
        message: `Bonjour ${user?.name},\n\nNous sommes ravis de vous accueillir sur notre plateforme.\n\nVous pouvez maintenant vous connecter et commencer à utiliser tous les outils disponibles.\n\nSi vous avez des questions, n'hésitez pas à nous contacter.\n\nCordialement,\nL'équipe OCP`
      },
      update: {
        subject: 'Mise à jour importante',
        message: `Bonjour ${user?.name},\n\nNous avons une mise à jour importante à vous communiquer concernant votre compte.\n\nVeuillez vous connecter pour plus de détails.\n\nCordialement,\nL'équipe OCP`
      },
      action: {
        subject: 'Votre compte nécessite une action',
        message: `Bonjour ${user?.name},\n\nVotre compte nécessite une action de votre part.\n\nVeuillez vous connecter pour effectuer les actions nécessaires.\n\nCordialement,\nL'équipe OCP`
      },
    };

    if (templates[template]) {
      setFormData(templates[template]);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
        <AdminNavbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <AdminNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push(`/admin/users/${params.id}`)}
            className="flex items-center space-x-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to User</span>
          </button>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Send Email
              </h1>
              <p className="text-gray-600 dark:text-slate-400">
                To: {user?.name} ({user?.email})
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-colors"
                    placeholder="Enter email subject"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={12}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-colors resize-none"
                    placeholder="Enter your message..."
                  />
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                    You can use HTML tags for formatting
                  </p>
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => router.push(`/admin/users/${params.id}`)}
                    className="px-6 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors font-medium"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-medium shadow-lg"
                    disabled={isSubmitting}
                  >
                    <Send className="w-5 h-5" />
                    <span>{isSubmitting ? 'Sending...' : 'Send Email'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Email Templates */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Quick Templates
              </h3>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => applyTemplate('welcome')}
                  className="w-full px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-left"
                >
                  <p className="font-medium text-blue-900 dark:text-blue-300 text-sm">Welcome Email</p>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">Greet new users</p>
                </button>

                <button
                  type="button"
                  onClick={() => applyTemplate('update')}
                  className="w-full px-4 py-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-left"
                >
                  <p className="font-medium text-purple-900 dark:text-purple-300 text-sm">Update Notification</p>
                  <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">Notify about updates</p>
                </button>

                <button
                  type="button"
                  onClick={() => applyTemplate('action')}
                  className="w-full px-4 py-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors text-left"
                >
                  <p className="font-medium text-orange-900 dark:text-orange-300 text-sm">Action Required</p>
                  <p className="text-xs text-orange-700 dark:text-orange-400 mt-1">Request user action</p>
                </button>
              </div>
            </div>

            {/* User Info */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Recipient Info
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-slate-400">Name</p>
                  <p className="text-gray-900 dark:text-white font-medium">{user?.name}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-slate-400">Email</p>
                  <p className="text-gray-900 dark:text-white font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-slate-400">Role</p>
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                    user?.role === 'admin'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {user?.role}
                  </span>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-slate-400">Status</p>
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                    user?.isActive
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {user?.isActive ? 'Active' : 'Suspended'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SendEmailToUser;

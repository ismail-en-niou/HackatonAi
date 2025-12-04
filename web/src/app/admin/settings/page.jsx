'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import AdminNavbar from '@/app/components/AdminNavbar';
import { Settings as SettingsIcon, Bell, Shield, Palette, Globe } from 'lucide-react';

const AdminSettings = () => {
  const router = useRouter();

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
  }, []);

  const settingsSections = [
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Configure email and system notifications',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Manage security settings and permissions',
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
    },
    {
      icon: Palette,
      title: 'Appearance',
      description: 'Customize the look and feel',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      icon: Globe,
      title: 'Localization',
      description: 'Language and region settings',
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            Configure your admin panel settings
          </p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settingsSections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.title}
                className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 hover:shadow-xl transition-shadow cursor-pointer"
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 ${section.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${section.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      {section.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-8 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 text-center">
          <SettingsIcon className="w-12 h-12 text-amber-600 dark:text-amber-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-amber-900 dark:text-amber-300 mb-2">
            Settings Configuration Coming Soon
          </h3>
          <p className="text-amber-700 dark:text-amber-400">
            Advanced settings and configuration options will be available in a future update.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut,
  Shield,
  Library,
  Mail,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Bot
} from 'lucide-react';

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    router.push('/login');
  };

  const menuItems = [
    { 
      id: 'dashboard', 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/admin/dashboard' 
    },
    { 
      id: 'users', 
      icon: Users, 
      label: 'Gérer Utilisateurs', 
      path: '/admin/users' 
    },
    { 
      id: 'emails', 
      icon: Mail, 
      label: 'Envoyer Emails', 
      path: '/admin/emails' 
    },
    { 
      id: 'library', 
      icon: Library, 
      label: 'Bibliothèque', 
      path: '/library' 
    },
    { 
      id: 'settings', 
      icon: Settings, 
      label: 'Paramètres', 
      path: '/admin/settings' 
    },
  ];

  return (
    <nav className={`h-screen flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-80'} bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white border-r border-amber-500/20 shadow-2xl shadow-amber-500/10`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-amber-500/20">
        <div className={`flex items-center space-x-3 ${isCollapsed ? 'hidden' : 'flex'}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Admin Panel</h1>
            <p className="text-xs text-amber-400">OCP Management</p>
          </div>
        </div>

        {/* Collapsed Logo */}
        <div className={`${isCollapsed ? 'flex' : 'hidden'} justify-center w-full`}>
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-lg hover:bg-slate-700/50 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-amber-400" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-amber-400" />
          )}
        </button>
      </div>

      {/* Back to Chat Button */}
      {!isCollapsed && (
        <div className="p-4 border-b border-amber-500/20">
          <Link
            href="/chats"
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-900/40"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">Retour au Chat</span>
          </Link>
        </div>
      )}

      {/* Navigation Menu */}
      <div className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path || pathname?.startsWith(item.path + '/');

            return (
              <li key={item.id}>
                <Link
                  href={item.path}
                  className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-green-600 text-white shadow-lg shadow-green-500/50'
                      : 'text-slate-300 hover:bg-green-600/80 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span 
                    className={`ml-3 font-medium transition-opacity duration-200 ${
                      isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'
                    }`}
                  >
                    {item.label}
                  </span>
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-green-600 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 border border-green-500/30">
                      {item.label}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>


      {/* Logout Button */}
      <div className="p-4 border-t border-amber-500/20">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-start space-x-2'} px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-lg transition-colors border border-red-500/30`}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium">Déconnexion</span>}
        </button>
      </div>
    </nav>
  );
};

export default AdminSidebar;

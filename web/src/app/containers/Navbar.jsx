"use client";

import React, { useEffect } from "react";
import styles from "./Navbar.module.css";
import { useState } from "react";
import { useRouter, usePathname } from 'next/navigation';
import Cookies from "js-cookie";
import Link from "next/link";
import { useNotification } from "../components/NotificationProvider";
import {
  Home,
  MessageSquare,
  Search,
  FileText,
  BookOpen,
  ChevronLeft,
  History,
  ChevronRight,
  Bot,
  Plus,
  Library,
  FolderOpen,
  User,
  Zap,
  Trash,
  Shield
} from "lucide-react";

const Navbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoginedIn, setIsLoggedIn] = useState(false);
  const { showToast, showConfirm } = useNotification();
  const pathname = usePathname();
  const menuItems = [
    { id: "home", icon: Home, label: "Accueil", path: "/" },
    { id: "chat", icon: MessageSquare, label: "Chatbot", path: "/chats" },
  ];

  const [chatHistory, setChatHistory] = useState([]);
  const [user, setUser] = useState(null);
  const [hoveredChat, setHoveredChat] = useState(null);
  function readLocalChats() {
    try {
      const raw = localStorage.getItem('local_chats');
      const parsed = JSON.parse(raw || '[]');
      return Array.isArray(parsed) ? parsed.map(c => ({ ...c, isLocal: true })) : [];
    } catch (e) { return []; }
  }

  function deleteLocalChat(localId) {
    try {
      const key = 'local_chats';
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : [];
      const updated = (parsed || []).filter(c => c._id !== localId);
      localStorage.setItem(key, JSON.stringify(updated));
      setChatHistory(prev => prev.filter(c => c._id !== localId));
    } catch (e) { console.error('Failed to delete local chat', e); }
  }


  const router = useRouter();
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    let token = Cookies.get("token");
    setIsLoggedIn(!!token);

    const rawUser = Cookies.get('user');
    if (rawUser) {
      try {
        setUser(JSON.parse(rawUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }

    // Fetch chat history (if user logged in, token will be sent via cookie header by the browser automatically)
    async function fetchHistory() {
      try {
        const res = await fetch('/api/chats', { credentials: 'same-origin' });
        const data = await res.json();
        if (data?.success) {
          // ensure conversation.user is a string (if available) for easy comparison
          const list = (data.conversations || []).map((c) => ({ ...c, user: c.user ? String(c.user) : null }));
          const local = readLocalChats();
          // Merge local chats with server conversations while ensuring no duplicates (_id differs for local)
          const merged = [...list, ...local];
          setChatHistory(merged);
        } else {
          setChatHistory([]);
        }
      } catch (error) {
        console.error('Failed to fetch chat history', error);
      }
    }

    fetchHistory();
  }, [isCollapsed]);

  return (
    <nav className={`navbar h-screen flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-80'} bg-white/95 dark:bg-slate-950/85 text-gray-900 dark:text-slate-100 border-r border-gray-200 dark:border-white/10 backdrop-blur-xl shadow-2xl shadow-gray-200/60 dark:shadow-black/60`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10">
        <div className={`flex items-center space-x-3 ${isCollapsed ? 'hidden' : 'flex'}`}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">KnowledgeHub</h1>
            <p className="text-xs text-gray-600 dark:text-slate-400">Savoir Opérationnel</p>
          </div>
        </div>

        {/* Collapsed Logo */}
        <div className={`${isCollapsed ? 'flex' : 'hidden'} justify-center w-full`}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
        </div>

        <button
          onClick={toggleSidebar}
          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>

      {/* New Chat Button */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200 dark:border-white/10">
          <button 
            onClick={async () => {
              const token = Cookies.get('token');
              if (!token) {
                // Guests keep their chats locally; just redirect to the home chat surface.
                router.push('/');
                return;
              }

              try {
                const res = await fetch('/api/chats', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                  credentials: 'same-origin',
                  body: JSON.stringify({ messages: [] }),
                });
                const data = await res.json();
                if (data?.success && data.conversation?._id) {
                  router.push(`/chats/${data.conversation._id}`);
                }
              } catch (err) {
                console.error('Failed to create new chat', err);
              }
            }} 
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-colors shadow-lg shadow-purple-900/40"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">New chat</span>
          </button>
        </div>
      )}

      {/* Search Bar */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200 dark:border-white/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search chats"
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-slate-900/70 border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <div className="py-4 border-b border-gray-200 dark:border-white/10">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path || (item.id === 'chat' && pathname?.startsWith('/chats'));

            return (
              <li key={item.id}>
                <Link
                  href={item.path}
                  className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-indigo-100 dark:bg-indigo-600/20 text-indigo-700 dark:text-white border-r-2 border-indigo-500'
                      : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-900/70 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon 
                    className={`w-5 h-5 ${
                      isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-slate-500 group-hover:text-gray-700 dark:group-hover:text-slate-200'
                    }`} 
                  />
                  <span 
                    className={`ml-3 font-medium transition-opacity duration-200 ${
                      isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'
                    }`}
                  >
                    {item.label}
                  </span>
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Library Section */}
      {!isCollapsed && (
        <div className="py-4 border-b border-gray-200 dark:border-white/10">
          <div className="px-3 space-y-1">
            <Link href="/library" className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 group ${
                    pathname === '/library'
                      ? 'bg-indigo-100 dark:bg-indigo-600/20 text-indigo-700 dark:text-white border-r-2 border-indigo-500'
                      : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-900/70 hover:text-gray-900 dark:hover:text-white'
                  }`}>
              <Library className={`w-5 h-5 ${
                pathname === '/library' 
                  ? 'text-indigo-600 dark:text-indigo-400' 
                  : 'text-gray-500 dark:text-slate-500'
              }`} />
              <span className="ml-3 font-medium">Bibliothèque</span>
            </Link>
            <Link href="/projects" className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 group ${
                      pathname === '/projects'
                      ? 'bg-indigo-100 dark:bg-indigo-600/20 text-indigo-700 dark:text-white border-r-2 border-indigo-500'
                      : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-900/70 hover:text-gray-900 dark:hover:text-white'
                  }`}>
              <FolderOpen className="w-5 h-5 text-gray-500 dark:text-slate-500" />
              <span className="ml-3 font-medium">Projets</span>
            </Link>
          </div>
        </div>
      )}

      {/* Chat History Section */}
      <div className={`flex-1 overflow-x-auto overflow-y-auto ${styles['hide-scrollbar']}`}> 
        {!isCollapsed && (
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-200 mb-3">Vos conversations</h3>
            <ul className="space-y-1">
              {chatHistory.map((chat) => (
                <li key={chat._id || chat.id} className="border-b last:border-b-0">
                  <div
                    className="group relative flex items-center justify-between px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-900/70 rounded-lg transition-colors"
                    onMouseEnter={() => setHoveredChat(chat)}
                    onMouseLeave={() => setHoveredChat(null)}
                  >
                    <Link href={chat._id ? `/chats/${chat._id}` : '/chats'} className="flex items-center flex-1">
                      <div className={`flex-1 overflow-hidden ${chat.isLocal ? 'pl-2 border-l-4 border-emerald-400 bg-emerald-500/10' : (chat.user && user?.id && chat.user === String(user.id) ? 'pl-2 border-l-4 border-indigo-400 bg-indigo-500/10' : '')}`}>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm truncate block ${
                            chat.user && user?.id && chat.user === String(user.id) 
                              ? 'font-semibold text-gray-900 dark:text-white' 
                              : 'text-gray-700 dark:text-slate-200'
                          }`}>
                            {chat.title ? (chat.title.length > 10 ? chat.title.slice(0, 10) + '…' : chat.title) : 'Untitled chat'}
                          </span>
                           {chat.isLocal ? (
                             <span className="ml-2 text-xs bg-emerald-500/20 text-emerald-200 px-2 py-0.5 rounded-full">Local</span>
                           ) : (chat.user && user?.id && chat.user === String(user.id) && (
                             <span className="ml-2 text-xs bg-indigo-500/20 text-indigo-200 px-2 py-0.5 rounded-full">Vous</span>
                           ))}
                        </div>
                        {chat.updatedAt && (
                          <div className="text-xs text-gray-500 dark:text-slate-400">
                            {new Date(chat.updatedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="flex items-center space-x-2 ml-2">
                      <button
                        title="Preview"
                        onMouseEnter={(e) => { e.stopPropagation(); setHoveredChat(chat); }}
                        onMouseLeave={() => setHoveredChat(null)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-slate-900 rounded"
                      >
                        <Zap className={`w-3 h-3 ${
                          chat.user && user?.id && chat.user === String(user.id) 
                            ? 'text-indigo-600 dark:text-indigo-400' 
                            : 'text-gray-500 dark:text-slate-500'
                        }`} />
                      </button>
                      {/* delete button */}
                      <button
                        title="Delete"
                        onClick={async (e) => {
                          e.stopPropagation();
                          const confirmed = await showConfirm({
                            title: 'Supprimer la conversation',
                            message: 'Êtes-vous sûr de vouloir supprimer cette conversation ? Cette action est irréversible.',
                            confirmText: 'Supprimer',
                            cancelText: 'Annuler',
                            type: 'danger'
                          });
                          if (!confirmed) return;
                          try {
                            if (chat.isLocal) {
                              deleteLocalChat(chat._id);
                              showToast('Conversation supprimée avec succès', 'success');
                              return;
                            }
                            const token = Cookies.get('token');
                            const headers = {};
                            if (token) headers['Authorization'] = `Bearer ${token}`;
                            const res = await fetch(`/api/chats/${chat._id}`, { 
                              method: 'DELETE', 
                              headers, 
                              credentials: 'same-origin' 
                            });
                            const data = await res.json();
                            if (data?.success) {
                              setChatHistory((prev) => prev.filter((c) => c._id !== chat._id));
                              showToast('Conversation supprimée avec succès', 'success');
                            } else {
                              console.error(data?.error || 'Delete failed');
                              showToast(data?.error || 'Échec de la suppression', 'error');
                            }
                          } catch (err) {
                            console.error('Failed to delete conversation', err);
                            showToast('Erreur lors de la suppression', 'error');
                          }
                        }}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-slate-900 rounded text-red-600 dark:text-red-400"
                      >
                        <Trash className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {isLoginedIn ? (
        <div className="p-4 border-t border-gray-200 dark:border-white/10">
          <div className="flex items-center space-x-3">
            <Link href="/profile" className="w-10 h-10 bg-gray-200 dark:bg-slate-800 rounded-full flex items-center justify-center relative">
              <User className="w-5 h-5 text-gray-700 dark:text-slate-200" />
              {user?.role === 'admin' && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                  <Shield className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </Link>
            {isCollapsed ? null : (
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'John Doe'}</p>
                {user?.role === 'admin' && (
                  <span className="px-2 py-0.5 text-xs bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-full font-semibold flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Admin
                  </span>
                )}
              </div>
              <a href="/profile" className="text-xs text-indigo-600 dark:text-indigo-300 hover:underline">
                Voir le profil
              </a>
            </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 border-t border-gray-200 dark:border-white/10">
          <Link 
            href="/login" 
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-colors"
          >
            <span className="font-medium">Se connecter</span>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
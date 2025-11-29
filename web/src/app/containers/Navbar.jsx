"use client";

import React from "react";
import { useState } from "react";
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
  Zap
} from "lucide-react";

const Navbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("home");

  const menuItems = [
    { id: "home", icon: Home, label: "Accueil", path: "/" },
    { id: "chat", icon: MessageSquare, label: "Chatbot", path: "/chat" },
  ];

  const chatHistory = [
    { id: 2, title: "GPA meaning explanation", date: "2024-11-27" },
    { id: 3, title: "Java packages explained", date: "2024-11-27" },
    { id: 4, title: "Install JDK on Linux", date: "2024-11-26" },
    { id: 5, title: "Message correction request", date: "2024-11-26" },
    { id: 6, title: "Self-introduction for intent...", date: "2024-11-25" },
    { id: 7, title: "Install .dmg in Linux", date: "2024-11-25" },
    { id: 8, title: "Correction de message", date: "2024-11-24" },
    { id: 9, title: "Relationship advice response", date: "2024-11-24" },
    { id: 10, title: "Message correction", date: "2024-11-23" },
    { id: 11, title: "Reply to Joseph", date: "2024-11-23" },
    { id: 12, title: "24-hour front-end prep", date: "2024-11-22" },
    { id: 13, title: "Suggestions événement cul...", date: "2024-11-22" },
    { id: 14, title: "Message correction request", date: "2024-11-21" },
    { id: 15, title: "Async function explained", date: "2024-11-21" },
    { id: 16, title: "Write discord message", date: "2024-11-20" },
    { id: 17, title: "Important React hooks", date: "2024-11-20" },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <nav className={`navbar bg-white shadow-lg h-screen flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-100'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className={`flex items-center space-x-3 ${isCollapsed ? 'hidden' : 'flex'}`}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">KnowledgeHub</h1>
            <p className="text-xs text-gray-500">Savoir Opérationnel</p>
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
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* New Chat Button */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200">
          <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <Plus className="w-5 h-5" />
            <span className="font-medium">New chat</span>
          </button>
        </div>
      )}

      {/* Search Bar */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <div className="py-4 border-b border-gray-200">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <li key={item.id}>
                <a
                  href={item.path}
                  onClick={() => setActiveItem(item.id)}
                  className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon 
                    className={`w-5 h-5 ${
                      isActive ? 'text-indigo-700' : 'text-gray-500 group-hover:text-gray-700'
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
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Library Section */}
      {!isCollapsed && (
        <div className="py-4 border-b border-gray-200">
          <div className="px-3 space-y-1">
            <button className="flex items-center w-full px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200">
              <Library className="w-5 h-5 text-gray-500" />
              <span className="ml-3 font-medium">Library</span>
            </button>
            <button className="flex items-center w-full px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200">
              <FolderOpen className="w-5 h-5 text-gray-500" />
              <span className="ml-3 font-medium">Projects</span>
            </button>
          </div>
        </div>
      )}

      {/* Chat History Section */}
      <div className="flex-1 overflow-y-auto">
        {!isCollapsed && (
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Your chats</h3>
            <div className="space-y-1">
              {chatHistory.map((chat) => (
                <button
                  key={chat.id}
                  className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm truncate flex-1">{chat.title}</span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                      <button className="p-1 hover:bg-gray-200 rounded">
                        <Zap className="w-3 h-3 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Section */}
      <div className="border-t border-gray-200 p-4">
        <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          
          <div className={`${isCollapsed ? 'hidden' : 'block'}`}>
            <p className="text-sm font-medium text-gray-900">Ismail Enniou</p>
            <p className="text-xs text-gray-500">Free</p>
          </div>
        </div>
        
        {!isCollapsed && (
          <button className="w-full mt-3 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors duration-200 font-medium">
            Upgrade
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
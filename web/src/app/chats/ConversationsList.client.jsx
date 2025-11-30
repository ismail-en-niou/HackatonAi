"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { Trash } from 'lucide-react';

export default function ConversationsList({ initialConversations }) {
  const [conversations, setConversations] = useState(initialConversations || []);
  const token = Cookies.get('token');
  const userRaw = Cookies.get('user');
  let currentUserId = null;
  try { currentUserId = userRaw ? JSON.parse(userRaw)?.id ?? JSON.parse(userRaw)?._id : null; } catch (e) {}

  const handleDelete = async (id) => {
    if (!id) return;
    if (!confirm('Supprimer cette conversation ?')) return;
    try {
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`/api/chats/${id}`, { method: 'DELETE', headers, credentials: 'same-origin' });
      const data = await res.json();
      if (data?.success) {
        setConversations(prev => prev.filter(c => c._id !== id));
      } else {
        alert(data?.error || 'Échec de la suppression');
      }
    } catch (e) {
      console.error('Failed to delete conversation', e);
      alert('Erreur réseau');
    }
  };

  if (!conversations || conversations.length === 0) {
    return <div className="p-4 text-gray-500 dark:text-gray-400">No conversations yet.</div>;
  }

  return (
    <ul>
      {conversations.map((c) => {
        const owned = c.user && currentUserId && String(c.user) === String(currentUserId);
        return (
          <li key={c._id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Link href={`/chats/${c._id}`} className="flex-1 min-w-0">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate flex items-center">
                    {c.title || 'Untitled chat'}
                    {owned && <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-600 dark:bg-indigo-600/30 dark:text-indigo-200">Vous</span>}
                  </h4>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{(c.messages?.length || 0)} messages • Updated {new Date(c.updatedAt || c.createdAt).toLocaleString()}</div>
                </div>
              </Link>
              {owned && (
                <button
                  onClick={() => handleDelete(c._id)}
                  className="ml-3 inline-flex items-center p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                  title="Supprimer"
                >
                  <Trash className="w-4 h-4" />
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

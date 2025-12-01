"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { Trash, Trash2 } from 'lucide-react';
import { useNotification } from '../components/NotificationProvider';

export default function ConversationsList({ initialConversations }) {
  const [conversations, setConversations] = useState(initialConversations || []);
  const { showToast, showConfirm } = useNotification();
  const token = Cookies.get('token');
  const userRaw = Cookies.get('user');
  let currentUserId = null;
  try { currentUserId = userRaw ? JSON.parse(userRaw)?.id ?? JSON.parse(userRaw)?._id : null; } catch (e) {}

  const handleDelete = async (id) => {
    if (!id) return;
    const confirmed = await showConfirm({
      title: 'Supprimer la conversation',
      message: 'Êtes-vous sûr de vouloir supprimer cette conversation ?',
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      type: 'danger'
    });
    if (!confirmed) return;
    try {
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`/api/chats/${id}`, { method: 'DELETE', headers, credentials: 'same-origin' });
      const data = await res.json();
      if (data?.success) {
        setConversations(prev => prev.filter(c => c._id !== id));
        showToast('Conversation supprimée avec succès', 'success');
      } else {
        showToast(data?.error || 'Échec de la suppression', 'error');
      }
    } catch (e) {
      console.error('Failed to delete conversation', e);
      showToast('Erreur réseau', 'error');
    }
  };

  const handleDeleteAll = async () => {
    const ownedConversations = conversations.filter(c => c.user && currentUserId && String(c.user) === String(currentUserId));
    if (ownedConversations.length === 0) {
      showToast('Aucune conversation à supprimer', 'info');
      return;
    }
    const confirmed = await showConfirm({
      title: 'Supprimer toutes les conversations',
      message: `Êtes-vous sûr de vouloir supprimer ${ownedConversations.length} conversation(s) ? Cette action est irréversible.`,
      confirmText: 'Tout supprimer',
      cancelText: 'Annuler',
      type: 'danger'
    });
    if (!confirmed) return;
    
    try {
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      let successCount = 0;
      let failCount = 0;
      
      for (const conv of ownedConversations) {
        try {
          const res = await fetch(`/api/chats/${conv._id}`, { method: 'DELETE', headers, credentials: 'same-origin' });
          const data = await res.json();
          if (data?.success) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (e) {
          failCount++;
        }
      }
      
      // Update local state
      setConversations(prev => prev.filter(c => {
        const isOwned = c.user && currentUserId && String(c.user) === String(currentUserId);
        return !isOwned; // Keep only non-owned conversations
      }));
      
      if (failCount === 0) {
        showToast(`${successCount} conversation(s) supprimée(s) avec succès`, 'success');
      } else {
        showToast(`${successCount} supprimée(s), ${failCount} échec(s)`, 'warning');
      }
    } catch (e) {
      console.error('Failed to delete all conversations', e);
      showToast('Erreur lors de la suppression', 'error');
    }
  };

  if (!conversations || conversations.length === 0) {
    return <div className="p-4 text-gray-500 dark:text-gray-400">No conversations yet.</div>;
  }

  const ownedCount = conversations.filter(c => c.user && currentUserId && String(c.user) === String(currentUserId)).length;

  return (
    <div>
      {ownedCount > 0 && (
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {ownedCount} conversation(s) vous appartenant
          </p>
          <button
            onClick={handleDeleteAll}
            className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors text-sm"
            title="Supprimer toutes mes conversations"
          >
            <Trash2 className="w-4 h-4" />
            <span>Tout supprimer</span>
          </button>
        </div>
      )}
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
    </div>
  );
}

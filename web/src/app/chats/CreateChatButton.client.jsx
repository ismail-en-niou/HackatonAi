'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Plus } from 'lucide-react';
import { useNotification } from '../components/NotificationProvider';

export default function CreateChatButton() {
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const { showToast } = useNotification();

  const handleCreateChat = async () => {
    setIsCreating(true);
    try {
      const token = Cookies.get('token');
      
      if (!token) {
        // For guests, redirect to home page to create a local chat
        showToast('Redirection vers le chat...', 'info');
        router.push('/');
        return;
      }

      // Create new conversation for logged-in users
      const res = await fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'same-origin',
        body: JSON.stringify({ messages: [] }),
      });

      const data = await res.json();

      if (data?.success && data.conversation?._id) {
        showToast('Nouvelle conversation créée', 'success');
        router.push(`/chats/${data.conversation._id}`);
      } else {
        showToast(data?.error || 'Échec de la création', 'error');
      }
    } catch (err) {
      console.error('Failed to create chat', err);
      showToast('Erreur lors de la création', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <button
      onClick={handleCreateChat}
      disabled={isCreating}
      className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isCreating ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Création...</span>
        </>
      ) : (
        <>
          <Plus className="w-4 h-4" />
          <span>Nouvelle conversation</span>
        </>
      )}
    </button>
  );
}

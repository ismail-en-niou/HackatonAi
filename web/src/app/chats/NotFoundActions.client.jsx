"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function NotFoundActions({ className }) {
  const router = useRouter();

  const goToHistory = () => {
    const token = Cookies.get('token');
    router.push(token ? '/chats' : '/');
  };

  async function handleNewChat() {
    const token = Cookies.get('token');
    if (!token) {
      // Guest users remain on the main chat surface with their local history only.
      router.push('/');
      return;
    }

    try {
      const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
      const res = await fetch('/api/chats', { method: 'POST', headers, credentials: 'same-origin', body: JSON.stringify({ messages: [] }) });
      const data = await res.json();
      if (data?.success && data.conversation?._id) {
        router.push(`/chats/${data.conversation._id}`);
      } else {
        router.push('/chats');
      }
    } catch (e) {
      console.error('Failed to create new chat', e);
      router.push('/chats');
    }
  }

  return (
    <div className={className || ''}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center mt-6">
        <button onClick={goToHistory} className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          Retourner à l&apos;historique
        </button>
        <button onClick={handleNewChat} className="px-4 py-2 rounded-md bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors">
          Commencer un nouveau chat
        </button>
      </div>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { listConversations } from '../lib/controllers/conversationController';
import ConversationsList from './ConversationsList.client';
import CreateChatButton from './CreateChatButton.client';

export default async function Page() {
  let conversations = [];
  try {
    const raw = await listConversations(null, 50, 0);
    // Serialize Mongoose documents to plain objects safe for Client Components
    // Filter out deactivated conversations
    conversations = (raw || [])
      .filter((c) => c.isActive !== false)
      .map((c) => ({
        _id: c._id?.toString?.() ?? (typeof c._id === 'string' ? c._id : ''),
        title: c.title ?? 'Untitled chat',
        user: c.user ? String(c.user) : null,
        messages: Array.isArray(c.messages) ? c.messages.map(m => ({
          role: m.role ?? 'user',
          content: m.content ?? m.text ?? '',
        })) : [],
        createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : null,
        updatedAt: c.updatedAt ? new Date(c.updatedAt).toISOString() : null,
      }));
  } catch (err) {
    console.error('Failed to load conversations', err);
  }

  return (
    <main className="p-6 min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Conversations</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Accédez à vos échanges récents avec le chatbot</p>
          </div>
          <CreateChatButton />
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors">
          <ConversationsList initialConversations={conversations} />
        </div>
      </div>
    </main>
  );
}

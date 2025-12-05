'use client';

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useNotification } from "../components/NotificationProvider";
import { Send, Paperclip, Mic, Bot, User, ThumbsUp, ThumbsDown, Copy, RotateCw, Trash, Eraser, FileText, Download } from "lucide-react";

export const ChatContainer = ({ initialMessages = null, conversationId = null }) => {
  // initialize messages from initialMessages prop if provided
  const { showToast, showConfirm } = useNotification();
  const parseIncoming = (incoming) => {
    try {
      return incoming.map((m, idx) => ({
        id: m.id ?? (idx + 1),
        text: m.text ?? m.content ?? '',
        sender: (m.sender ?? (m.role === 'assistant' ? 'bot' : 'user')),
        timestamp: m.timestamp ? new Date(m.timestamp) : new Date(),
        file: m.file ?? null,
        sources: m.sources ?? null,
        liked: m.liked ?? null
      }));
    } catch (e) {
      return [];
    }
  };

  const [messages, setMessages] = useState(() => {
    if (initialMessages && Array.isArray(initialMessages) && initialMessages.length > 0) {
      return parseIncoming(initialMessages);
    }

    return [
      {
        id: 1,
        text: "Bonjour ! Je suis votre assistant KnowledgeHub. Comment puis-je vous aider à trouver des informations aujourd'hui ?",
        sender: "bot",
        timestamp: new Date(),
        liked: null
      }
    ];
  });
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [savedConversationId, setSavedConversationId] = useState(conversationId || null);
  const router = useRouter();
  const [attachedFile, setAttachedFile] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateChatTitle = async (firstMessage) => {
    try {
      const res = await fetch('/api/chats/namechat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: firstMessage }),
      });
      const data = await res.json();
      if (data?.success && data.name) {
        return data.name;
      }
      // Fallback to simple title generation
      return firstMessage.split(' ').slice(0, 6).join(' ') + (firstMessage.length > 50 ? '...' : '');
    } catch (err) {
      console.error('Failed to generate chat title', err);
      return firstMessage.split(' ').slice(0, 6).join(' ') + (firstMessage.length > 50 ? '...' : '');
    }
  };

  const persistMessages = async (messagesToPersist) => {
    try {
      if (!messagesToPersist || !messagesToPersist.length) return null;
      const payload = messagesToPersist.map((m) => ({ role: m.sender === 'bot' ? 'assistant' : 'user', content: m.text }));
      const token = Cookies.get('token');
      const isLoggedIn = !!token;
      // If user is not logged in, store in localStorage
      if (!isLoggedIn) {
        // operate on local storage
        const key = 'local_chats';
        let localChats = [];
        try { localChats = JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) { localChats = []; }
        // create local id if needed
        let localId = savedConversationId;
        if (!localId || !String(localId).startsWith('local:')) {
          // Generate unique ID with timestamp and random string
          const newId = `local:${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
          localId = newId;
        }

        // Create or update conversation in local storage
        let conv = localChats.find((c) => c._id === localId);
        const isNewConversation = !conv;
        if (!conv) {
          // Generate title for new chat
          const firstUserMessage = messagesToPersist.find(m => m.sender === 'user');
          const titleText = firstUserMessage?.text || messagesToPersist[0]?.text || 'Local chat';
          const generatedTitle = await generateChatTitle(titleText);
          conv = { _id: localId, title: generatedTitle, messages: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isLocal: true };
          localChats.push(conv);
        }
        conv.messages = conv.messages.concat(payload.map(m => ({ role: m.role, content: m.content }))) ;
        conv.updatedAt = new Date().toISOString();
        try { localStorage.setItem(key, JSON.stringify(localChats)); } catch (e) { console.error('Failed to save local chats', e); }
        setSavedConversationId(localId);
        
        // Trigger storage event to update Navbar
        if (isNewConversation) {
          window.dispatchEvent(new Event('local-chat-created'));
        }
        
        return conv;
      }
      if (savedConversationId && !String(savedConversationId).startsWith('local:')) {
        const token = Cookies.get('token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch(`/api/chats/${savedConversationId}`, {
          method: 'PATCH',
          headers,
          credentials: 'same-origin',
          body: JSON.stringify({ messages: payload }),
        });
        const data = await res.json();
        return data?.conversation || null;
      } else {
        // Generate title for new chat
        const firstUserMessage = messagesToPersist.find(m => m.sender === 'user');
        const titleText = firstUserMessage?.text || messagesToPersist[0]?.text;
        const generatedTitle = titleText ? await generateChatTitle(titleText) : undefined;
        
        const token = Cookies.get('token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch('/api/chats', {
          method: 'POST',
          headers,
          credentials: 'same-origin',
          body: JSON.stringify({ messages: payload, title: generatedTitle }),
        });
        const data = await res.json();
        if (data?.success && data.conversation?._id) {
          setSavedConversationId(data.conversation._id);
          
          // Trigger event to update Navbar with new conversation
          window.dispatchEvent(new CustomEvent('chat-created', { 
            detail: { conversation: data.conversation } 
          }));
          
          // push route to the new conversation if we're not already in a detail view
          if (!conversationId) {
            router.push(`/chats/${data.conversation._id}`);
          }
        }
        return data?.conversation || null;
      }
    } catch (err) {
      console.error('Failed to persist messages', err);
      return null;
    }
  };
  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !attachedFile) return;

    const userMessageText = inputMessage;
    const userMessage = {
      id: messages.length + 1,
      text: userMessageText,
      sender: "user",
      timestamp: new Date(),
      file: attachedFile
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setAttachedFile(null);
    setIsLoading(true);

    // Call AI proxy endpoint
    try {
      const token = Cookies.get('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/chats/query', {
        method: 'POST',
        headers,
        credentials: 'same-origin',
        body: JSON.stringify({ query: userMessageText }),
      });

      const data = await res.json();
      const text = typeof data === 'string' ? data : (data.text || data.answer || data.response || JSON.stringify(data));

      const botResponse = {
        id: messages.length + 2,
        text,
        sender: 'bot',
        timestamp: new Date(),
        sources: data.sources || null,
        liked: null
      };

      setMessages(prev => [...prev, botResponse]);
      
      // Persist both messages together after getting bot response
      try {
        await persistMessages([userMessage, botResponse]);
      } catch (err) {
        console.error('Persist messages failed', err);
      }
    } catch (err) {
      console.error('AI query failed', err);
      const botResponse = {
        id: messages.length + 2,
        text: "Désolé, une erreur est survenue lors de la requête au modèle.",
        sender: 'bot',
        timestamp: new Date(),
        liked: null
      };
      setMessages(prev => [...prev, botResponse]);
      // Persist error response too
      try {
        await persistMessages([userMessage, botResponse]);
      } catch (err) {
        console.error('Persist messages failed', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachedFile({
        name: file.name,
        type: file.type,
        size: file.size
      });
    }
  };

  const handleFeedback = (messageId, feedback) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, liked: feedback } : msg
    ));
  };

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleSourceClick = async (e, source) => {
    e.preventDefault();
    
    const filename = source.filename || source.title || '';
    const url = source.url || source.link || `${process.env.NEXT_PUBLIC_AI_URL || 'http://localhost:8000/files/'}${encodeURIComponent(filename)}`;
    
    try {
      // Try to open the file
      const response = await fetch(url, { method: 'HEAD' });
      
      if (response.ok) {
        // File exists, open in new tab
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        // File not accessible, download it
        handleDownloadSource(filename);
      }
    } catch (error) {
      // On error, try to download
      console.error('Error accessing file:', error);
      handleDownloadSource(filename);
    }
  };

  const handleDownloadSource = (filename) => {
    if (!filename) return;
    
    const url = `${process.env.NEXT_PUBLIC_AI_URL || 'http://localhost:8000/files/'}${encodeURIComponent(filename)}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const suggestedQuestions = [
  ];

  const handleDeleteConversation = async () => {
    if (!savedConversationId) return;
    const confirmed = await showConfirm({
      title: 'Supprimer la conversation',
      message: 'Êtes-vous sûr de vouloir supprimer cette conversation ? Cette action est définitive.',
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      type: 'danger'
    });
    if (!confirmed) return;
    try {
      // Local conversation deletion
      if (String(savedConversationId).startsWith('local:')) {
        const key = 'local_chats';
        let localChats = [];
        try { localChats = JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) { localChats = []; }
        const filtered = localChats.filter(c => c._id !== savedConversationId);
        try { localStorage.setItem(key, JSON.stringify(filtered)); } catch (e) { /* ignore */ }
        showToast('Conversation supprimée avec succès', 'success');
        // Redirect to generic chat list/home
        router.push('/chats');
        return;
      }
      // Server-side deletion (soft delete - sets isActive to false)
      const token = Cookies.get('token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`/api/chats/${savedConversationId}`, { method: 'DELETE', headers, credentials: 'same-origin' });
      const data = await res.json();
      if (data?.success) {
        showToast('Conversation supprimée avec succès', 'success');
        router.push('/chats');
      } else {
        showToast(data?.error || 'Échec de la suppression', 'error');
      }
    } catch (e) {
      console.error('Delete failed', e);
      showToast('Erreur lors de la suppression', 'error');
    }
  };

  const handleClearChat = async () => {
    const confirmed = await showConfirm({
      title: 'Effacer la conversation',
      message: 'Voulez-vous effacer tous les messages de cette conversation ?',
      confirmText: 'Effacer',
      cancelText: 'Annuler',
      type: 'warning'
    });
    if (!confirmed) return;
    
    // Reset to initial message
    setMessages([
      {
        id: 1,
        text: "Bonjour ! Je suis votre assistant de connaissances ocp. Comment puis-je vous aider à trouver des informations aujourd'hui ?",
        sender: "bot",
        timestamp: new Date(),
        liked: null
      }
    ]);
    showToast('Conversation effacée', 'success');
  };

  return (
    <div className="flex flex-col h-[100vh] w-full bg-gradient-to-b from-green-50/30 via-white to-green-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-gray-200 dark:border-white/10 shadow-2xl shadow-gray-200/40 dark:shadow-green-900/40 backdrop-blur">
      {/* Chat Header */}
      <div className="bg-white/80 dark:bg-slate-900/70 border-b border-gray-200 dark:border-white/10 px-6 py-4 ">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Assistant OCP KnowledgeHub</h2>
              <p className="text-sm text-gray-600 dark:text-slate-400">En ligne • Prêt à vous aider</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleClearChat}
              className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-sm"
              title="Effacer la conversation"
            >
              <Eraser className="w-4 h-4" />
              <span className="hidden sm:inline">Effacer</span>
            </button>
            {savedConversationId && (
              <button
                onClick={handleDeleteConversation}
                className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors text-sm"
                title="Supprimer la conversation"
              >
                <Trash className="w-4 h-4" />
                <span className="hidden sm:inline">Supprimer</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-6 overflow-y-auto bg-transparent">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex max-w-xl ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}
              >
                {/* Avatar */}
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'user' 
                      ? 'bg-green-600' 
                      : 'bg-gray-300 dark:bg-slate-700'
                  }`}
                >
                  {message.sender === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-gray-700 dark:text-white" />
                  )}
                </div>

                {/* Message Content */}
                <div
                  className={`flex-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <div
                    className={`inline-block px-4 py-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                        : 'bg-white dark:bg-slate-800/70 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-white/10 backdrop-blur'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    
                    {/* File Attachment */}
                    {message.file && (
                      <div className="mt-2 p-2 bg-blue-700 rounded-lg">
                        <div className="flex items-center space-x-2 text-blue-100">
                          <Paperclip className="w-4 h-4" />
                          <span className="text-sm">{message.file.name}</span>
                        </div>
                      </div>
                    )}

                    {/* Sources */}
                    {message.sources && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-medium text-gray-600 dark:text-slate-300 mb-2">Sources pertinentes :</p>
                        {message.sources.map((source, index) => (
                          <div
                            key={index}
                            onClick={(e) => handleSourceClick(e, source)}
                            className="block p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 rounded-lg border-2 border-green-200 dark:border-green-700/50 hover:border-green-400 dark:hover:border-green-500 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
                                  {source.title || source.filename || 'Document'}
                                </p>
                                {source.excerpt && (
                                  <p className="text-xs text-gray-600 dark:text-slate-300 mt-1 line-clamp-2">{source.excerpt}</p>
                                )}
                              </div>
                              <Download className="w-4 h-4 text-green-600 dark:text-green-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Message Actions */}
                  <div className={`flex items-center space-x-2 mt-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-xs text-gray-500 dark:text-slate-400">
                      {formatTime(message.timestamp)}
                    </span>
                    
                    {message.sender === 'bot' && (
                      <>
                        <button
                          onClick={() => handleCopyText(message.text)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          title="Copier le texte"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleFeedback(message.id, true)}
                          className={`p-1 transition-colors ${
                            message.liked === true 
                              ? 'text-green-600' 
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                          title="Réponse utile"
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleFeedback(message.id, false)}
                          className={`p-1 transition-colors ${
                            message.liked === false 
                              ? 'text-red-600' 
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                          title="Réponse peu utile"
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3 max-w-xl">
                <div className="w-8 h-8 bg-gray-300 dark:bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-gray-700 dark:text-white" />
                </div>
                <div className="bg-white dark:bg-slate-800/70 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 dark:bg-slate-300 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 dark:bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 dark:bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested Questions */}
      {messages.length === 1 && (
        <div className="px-6 pb-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-gray-700 dark:text-slate-300 mb-3">Questions suggérées :</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(question)}
                  className="px-3 py-2 bg-gray-100 dark:bg-slate-900/70 border border-gray-300 dark:border-white/10 rounded-full text-sm text-gray-700 dark:text-slate-200 hover:border-green-500 hover:text-green-700 dark:hover:text-white transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-white/5 bg-white/80 dark:bg-slate-950/60 p-6 rounded-b-2xl">
        <div className="max-w-4xl mx-auto">
          {/* File Attachment Preview */}
          {attachedFile && (
            <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/30 border border-green-300 dark:border-green-500/40 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Paperclip className="w-4 h-4 text-green-600 dark:text-green-300" />
                <span className="text-sm text-green-900 dark:text-green-100">{attachedFile.name}</span>
              </div>
              <button
                onClick={() => setAttachedFile(null)}
                className="text-green-600 dark:text-green-200 hover:text-green-900 dark:hover:text-white"
              >
                ×
              </button>
            </div>
          )}

          <div className="flex space-x-4">

            {/* Text Input */}
            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Posez votre question sur les procédures, documents ou savoir-faire de l'entreprise..."
                className="w-full bg-white dark:bg-slate-900/70 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-slate-500 px-4 py-3 pr-12 border border-gray-300 dark:border-white/10 rounded-xl resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                rows="1"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={(!inputMessage.trim() && !attachedFile) || isLoading}
              className="px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:opacity-90 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isLoading ? (
                <RotateCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
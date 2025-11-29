'use client';

import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Mic, Bot, User, ThumbsUp, ThumbsDown, Copy, RotateCw } from "lucide-react";

export const ChatContainer = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Bonjour ! Je suis votre assistant KnowledgeHub. Comment puis-je vous aider à trouver des informations aujourd'hui ?",
      sender: "bot",
      timestamp: new Date(),
      liked: null
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !attachedFile) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
      file: attachedFile
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setAttachedFile(null);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: "Je recherche les informations dans notre base de connaissances... Voici ce que j'ai trouvé concernant votre demande.",
        sender: "bot",
        timestamp: new Date(),
        sources: [
          { title: "Procédure Opérationnelle Standard", excerpt: "Section 4.2 - Gestion des documents techniques" },
          { title: "Guide d'Utilisation", excerpt: "Chapitre 3 - Bonnes pratiques métier" }
        ],
        liked: null
      };
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 2000);
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

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const suggestedQuestions = [
    "Quelles sont les procédures de sécurité ?",
    "Comment créer un nouveau projet ?",
    "Où trouver les rapports techniques ?",
    "Qui contacter pour les formations ?"
  ];

  return (
    <div className="flex flex-col h-[100vh] w-full bg-gray-50 rounded-lg shadow-sm border border-gray-200">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Assistant KnowledgeHub</h2>
            <p className="text-sm text-gray-500">En ligne • Prêt à vous aider</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-6 overflow-y-auto">
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
                      ? 'bg-blue-600' 
                      : 'bg-indigo-600'
                  }`}
                >
                  {message.sender === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Message Content */}
                <div
                  className={`flex-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <div
                    className={`inline-block px-4 py-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
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
                        <p className="text-xs font-medium text-gray-500 mb-2">Sources pertinentes :</p>
                        {message.sources.map((source, index) => (
                          <div key={index} className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-sm font-medium text-gray-900">{source.title}</p>
                            <p className="text-xs text-gray-600 mt-1">{source.excerpt}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Message Actions */}
                  <div className={`flex items-center space-x-2 mt-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-xs text-gray-500">
                      {formatTime(message.timestamp)}
                    </span>
                    
                    {message.sender === 'bot' && (
                      <>
                        <button
                          onClick={() => handleCopyText(message.text)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
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
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
            <p className="text-sm text-gray-500 mb-3">Questions suggérées :</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(question)}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-6">
        <div className="max-w-4xl mx-auto">
          {/* File Attachment Preview */}
          {attachedFile && (
            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Paperclip className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-900">{attachedFile.name}</span>
              </div>
              <button
                onClick={() => setAttachedFile(null)}
                className="text-blue-600 hover:text-blue-800"
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
                className="w-full text-red-500 px-4 py-3 pr-12 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows="1"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={(!inputMessage.trim() && !attachedFile) || isLoading}
              className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isLoading ? (
                <RotateCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Helper Text */}
          <p className="text-xs text-gray-500 mt-2 text-center">
            KnowledgeHub peut faire des erreurs. Vérifiez les informations importantes.
          </p>
        </div>
      </div>
    </div>
  );
};
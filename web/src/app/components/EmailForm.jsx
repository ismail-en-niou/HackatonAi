'use client';

import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

const EmailForm = ({ user, onSend, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Send Email
            </h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              To: {user.name} ({user.email})
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Subject *
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-colors"
              placeholder="Enter email subject"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-colors resize-none"
              placeholder="Enter your message..."
            />
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
              You can use HTML tags for formatting
            </p>
          </div>

          {/* Quick Templates */}
          <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Quick Templates:
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFormData({
                  subject: 'Bienvenue sur la plateforme',
                  message: `Bonjour ${user.name},\n\nNous sommes ravis de vous accueillir sur notre plateforme.\n\nCordialement,\nL'équipe OCP`
                })}
                className="px-3 py-1 text-xs bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
              >
                Welcome
              </button>
              <button
                type="button"
                onClick={() => setFormData({
                  subject: 'Mise à jour importante',
                  message: `Bonjour ${user.name},\n\nNous avons une mise à jour importante à vous communiquer.\n\nCordialement,\nL'équipe OCP`
                })}
                className="px-3 py-1 text-xs bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
              >
                Update
              </button>
              <button
                type="button"
                onClick={() => setFormData({
                  subject: 'Votre compte nécessite une action',
                  message: `Bonjour ${user.name},\n\nVotre compte nécessite une action de votre part.\n\nCordialement,\nL'équipe OCP`
                })}
                className="px-3 py-1 text-xs bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
              >
                Action Required
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              disabled={isLoading}
            >
              <Send className="w-4 h-4" />
              <span>{isLoading ? 'Sending...' : 'Send Email'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailForm;

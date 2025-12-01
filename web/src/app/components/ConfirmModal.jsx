'use client';

import { AlertTriangle } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirmer', cancelText = 'Annuler', type = 'danger' }) => {
  if (!isOpen) return null;

  const buttonStyles = {
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    info: 'bg-blue-600 hover:bg-blue-700 text-white'
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 p-6 max-w-md w-full mx-4 animate-scale-in">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              type === 'danger' ? 'bg-red-100 dark:bg-red-900/30' : 
              type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30' : 
              'bg-blue-100 dark:bg-blue-900/30'
            }`}>
              <AlertTriangle className={`w-6 h-6 ${
                type === 'danger' ? 'text-red-600 dark:text-red-400' : 
                type === 'warning' ? 'text-yellow-600 dark:text-yellow-400' : 
                'text-blue-600 dark:text-blue-400'
              }`} />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg ${buttonStyles[type]} transition-colors font-medium shadow-lg`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

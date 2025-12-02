'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from './Toast';
import ConfirmModal from './ConfirmModal';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false });

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showConfirm = useCallback(({ title, message, onConfirm, confirmText, cancelText, type = 'danger' }) => {
    return new Promise((resolve) => {
      setConfirmModal({
        isOpen: true,
        title,
        message,
        confirmText,
        cancelText,
        type,
        onConfirm: () => {
          setConfirmModal({ isOpen: false });
          if (onConfirm) onConfirm();
          resolve(true);
        },
        onCancel: () => {
          setConfirmModal({ isOpen: false });
          resolve(false);
        }
      });
    });
  }, []);

  return (
    <NotificationContext.Provider value={{ showToast, showConfirm }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9998] space-y-2 max-w-md">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      {/* Confirm Modal */}
      <ConfirmModal {...confirmModal} />
    </NotificationContext.Provider>
  );
};

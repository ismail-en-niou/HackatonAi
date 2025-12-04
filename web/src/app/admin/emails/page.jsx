'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import AdminSidebar from '@/app/components/AdminSidebar';
import { useNotification } from '@/app/components/NotificationProvider';
import { 
  Mail, 
  Send, 
  Users, 
  User, 
  CheckSquare, 
  Square,
  Search,
  Sparkles,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const EmailManagement = () => {
  const router = useRouter();
  const { showToast } = useNotification();
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sendToAll, setSendToAll] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });
  const [sendResult, setSendResult] = useState(null);

  useEffect(() => {
    // Check if user is admin
    const userCookie = Cookies.get('user');
    if (userCookie) {
      const userData = JSON.parse(userCookie);
      if (userData.role !== 'admin') {
        router.push('/');
        return;
      }
    } else {
      router.push('/login');
      return;
    }

    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const token = Cookies.get('token');
      const res = await fetch('/api/admin/users?limit=1000', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
      } else {
        showToast(data.error || 'Failed to fetch users', 'error');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showToast('Failed to fetch users', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
    setSendToAll(false);
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u._id));
    }
    setSendToAll(false);
  };

  const handleSendToAll = () => {
    setSendToAll(!sendToAll);
    if (!sendToAll) {
      setSelectedUsers([]);
    }
  };

  const handleSendEmail = async () => {
    if (!formData.subject || !formData.message) {
      showToast('Veuillez remplir tous les champs', 'error');
      return;
    }

    if (!sendToAll && selectedUsers.length === 0) {
      showToast('Veuillez sélectionner au moins un utilisateur', 'error');
      return;
    }

    try {
      setIsSending(true);
      setSendResult(null);
      const token = Cookies.get('token');
      
      const payload = {
        subject: formData.subject,
        message: formData.message,
        sendToAll,
        userIds: sendToAll ? [] : selectedUsers,
      };

      const res = await fetch('/api/admin/emails/broadcast', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSendResult({
          success: true,
          sent: data.sent,
          failed: data.failed,
          total: data.total,
        });
        showToast(`Emails envoyés avec succès: ${data.sent}/${data.total}`, 'success');
        
        // Reset form
        setFormData({ subject: '', message: '' });
        setSelectedUsers([]);
        setSendToAll(false);
      } else {
        showToast(data.error || 'Échec de l\'envoi', 'error');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      showToast('Erreur lors de l\'envoi', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const applyTemplate = (template) => {
    const templates = {
      welcome: {
        subject: 'Bienvenue sur la plateforme OCP',
        message: `Bonjour,\n\nNous sommes ravis de vous accueillir sur notre plateforme.\n\nVous pouvez maintenant vous connecter et commencer à utiliser tous les outils disponibles.\n\nSi vous avez des questions, n'hésitez pas à nous contacter.\n\nCordialement,\nL'équipe OCP`
      },
      update: {
        subject: 'Mise à jour importante de la plateforme',
        message: `Bonjour,\n\nNous avons effectué une mise à jour importante de la plateforme.\n\nNouvelles fonctionnalités:\n- Amélioration de l'interface utilisateur\n- Nouvelles options de personnalisation\n- Performances optimisées\n\nConnectez-vous pour découvrir les nouveautés!\n\nCordialement,\nL'équipe OCP`
      },
      maintenance: {
        subject: 'Maintenance planifiée',
        message: `Bonjour,\n\nNous vous informons qu'une maintenance planifiée aura lieu:\n\nDate: [À préciser]\nDurée estimée: [À préciser]\n\nPendant cette période, la plateforme sera temporairement indisponible.\n\nNous vous remercions de votre compréhension.\n\nCordialement,\nL'équipe OCP`
      },
      newsletter: {
        subject: 'Newsletter OCP - Nouveautés du mois',
        message: `Bonjour,\n\nDécouvrez les nouveautés de ce mois:\n\n📊 Statistiques:\n- [À compléter]\n\n🎯 Objectifs atteints:\n- [À compléter]\n\n🚀 Prochaines fonctionnalités:\n- [À compléter]\n\nRestez connectés pour plus d'actualités!\n\nCordialement,\nL'équipe OCP`
      },
    };

    if (templates[template]) {
      setFormData(templates[template]);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recipientCount = sendToAll ? users.filter(u => u.isActive).length : selectedUsers.length;

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950">
      <AdminSidebar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gestion des Emails
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            Envoyez des emails à vos utilisateurs individuellement ou en masse
          </p>
        </div>

        {/* Send Result */}
        {sendResult && (
          <div className={`mb-6 p-4 rounded-xl border ${
            sendResult.success 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-center gap-3">
              {sendResult.success ? (
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              )}
              <div>
                <p className={`font-semibold ${
                  sendResult.success 
                    ? 'text-green-900 dark:text-green-300' 
                    : 'text-red-900 dark:text-red-300'
                }`}>
                  {sendResult.success ? 'Emails envoyés avec succès!' : 'Échec de l\'envoi'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Envoyés: {sendResult.sent} | Échoués: {sendResult.failed} | Total: {sendResult.total}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Email Composer */}
          <div className="lg:col-span-2 space-y-6">
            {/* Email Form */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Mail className="w-6 h-6 text-green-600 dark:text-green-400" />
                Composer l'Email
              </h2>

              <div className="space-y-4">
                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Sujet *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Entrez le sujet de l'email"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
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
                    rows={12}
                    placeholder="Entrez votre message..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white resize-none"
                  />
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                    Vous pouvez utiliser du HTML pour la mise en forme
                  </p>
                </div>

                {/* Recipients Info */}
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-green-900 dark:text-green-300">
                        Destinataires: {recipientCount}
                      </span>
                    </div>
                    {sendToAll && (
                      <span className="text-xs bg-green-600 text-white px-3 py-1 rounded-full">
                        Tous les utilisateurs actifs
                      </span>
                    )}
                  </div>
                </div>

                {/* Send Button */}
                <button
                  onClick={handleSendEmail}
                  disabled={isSending || recipientCount === 0}
                  className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold shadow-lg"
                >
                  <Send className="w-5 h-5" />
                  <span>{isSending ? 'Envoi en cours...' : `Envoyer à ${recipientCount} utilisateur${recipientCount > 1 ? 's' : ''}`}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Templates */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400" />
                Modèles
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => applyTemplate('welcome')}
                  className="w-full px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-left"
                >
                  <p className="font-medium text-blue-900 dark:text-blue-300 text-sm">Bienvenue</p>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">Message d'accueil</p>
                </button>

                <button
                  onClick={() => applyTemplate('update')}
                  className="w-full px-4 py-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-left"
                >
                  <p className="font-medium text-purple-900 dark:text-purple-300 text-sm">Mise à jour</p>
                  <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">Nouvelles fonctionnalités</p>
                </button>

                <button
                  onClick={() => applyTemplate('maintenance')}
                  className="w-full px-4 py-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors text-left"
                >
                  <p className="font-medium text-orange-900 dark:text-orange-300 text-sm">Maintenance</p>
                  <p className="text-xs text-orange-700 dark:text-orange-400 mt-1">Information maintenance</p>
                </button>

                <button
                  onClick={() => applyTemplate('newsletter')}
                  className="w-full px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-left"
                >
                  <p className="font-medium text-green-900 dark:text-green-300 text-sm">Newsletter</p>
                  <p className="text-xs text-green-700 dark:text-green-400 mt-1">Actualités du mois</p>
                </button>
              </div>
            </div>

            {/* User Selection */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                Destinataires
              </h3>

              {/* Send to All */}
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <button
                  onClick={handleSendToAll}
                  className="w-full flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    {sendToAll ? (
                      <CheckSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400" />
                    )}
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Tous les utilisateurs actifs
                    </span>
                  </div>
                  <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                    {users.filter(u => u.isActive).length}
                  </span>
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm"
                />
              </div>

              {/* Select All */}
              <button
                onClick={toggleSelectAll}
                disabled={sendToAll}
                className="w-full mb-3 px-3 py-2 text-sm bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {selectedUsers.length === filteredUsers.length ? 'Tout désélectionner' : 'Tout sélectionner'}
              </button>

              {/* User List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredUsers.map(user => (
                  <button
                    key={user._id}
                    onClick={() => toggleUserSelection(user._id)}
                    disabled={sendToAll}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-3">
                      {selectedUsers.includes(user._id) ? (
                        <CheckSquare className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">{user.email}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      user.isActive
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {user.isActive ? 'Actif' : 'Suspendu'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmailManagement;

"use client";

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '../ThemeProvider';
import { useNotification } from '../components/NotificationProvider';
import { User, Mail, Shield, Moon, Sun, Bell, BellOff, Lock, MessageSquare, Library, LogOut, RefreshCw, Settings, Users } from 'lucide-react';

export default function ProfilePage() {
	const [user, setUser] = useState(null);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [role, setRole] = useState('user');
	const [settings, setSettings] = useState({ notifications: true });
	const [isSaving, setIsSaving] = useState(false);
	const [stats, setStats] = useState({ 
		conversations: 0, 
		messages: 0, 
		filesUploaded: 0,
		averageResponseTime: 0,
		lastActive: null,
		mostUsedFeature: 'Chat'
	});
	const [showPasswordChange, setShowPasswordChange] = useState(false);
	const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
	const { theme, setTheme } = useTheme();
	const { showToast } = useNotification();
	const router = useRouter();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		try {
			const raw = Cookies.get('user');
			if (raw) {
				const parsed = JSON.parse(raw);
				setUser(parsed);
				setName(parsed.name || '');
				setEmail(parsed.email || '');
				setRole(parsed.role || 'user');
			}
		} catch (err) {
			console.error('Failed to parse user cookie', err);
		}

		const rawSettings = Cookies.get('settings');
		if (rawSettings) {
			try {
				const parsedSettings = JSON.parse(rawSettings);
				setSettings(prev => ({ ...prev, ...parsedSettings }));
			} catch (e) {
				// ignore malformed cookie
			}
		}

		// Fetch user stats
		const fetchStats = async () => {
			try {
				const token = Cookies.get('token');
				if (token) {
					const [chatsRes, filesRes] = await Promise.all([
						fetch('/api/chats', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }),
						fetch('/api/library', { credentials: 'same-origin', cache: 'no-store' })
					]);
					
					let conversations = 0;
					let messages = 0;
					let filesUploaded = 0;
					let averageResponseTime = 0;
					let lastActive = null;
					let mostUsedFeature = 'Chat';

					if (chatsRes.ok) {
						const chatsData = await chatsRes.json();
						conversations = chatsData.conversations?.length || 0;
						const allMessages = (chatsData.conversations || []).reduce((sum, c) => sum + (c.messages?.length || 0), 0);
						messages = allMessages;
						
						// Calculate average response time (simulated for now)
						averageResponseTime = conversations > 0 ? Math.floor(Math.random() * 3) + 1 : 0;
						
						// Get last active timestamp
						if (chatsData.conversations && chatsData.conversations.length > 0) {
							const sorted = [...chatsData.conversations].sort((a, b) => 
								new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
							);
							lastActive = sorted[0]?.updatedAt || null;
						}
					}

					if (filesRes.ok) {
						const filesData = await filesRes.json();
						filesUploaded = filesData.files?.length || 0;
						
						// Determine most used feature
						if (filesUploaded > conversations) {
							mostUsedFeature = 'Bibliothèque';
						} else if (conversations > 0) {
							mostUsedFeature = 'Chat';
						}
					}

					setStats({ 
						conversations, 
						messages, 
						filesUploaded,
						averageResponseTime,
						lastActive,
						mostUsedFeature
					});
				}
			} catch (err) {
				console.error('Failed to fetch stats', err);
			}
		};

		fetchStats();
		setLoading(false);
	}, [setTheme]);

	// Sync theme from ThemeProvider context (which reads from localStorage)
	useEffect(() => {
		setSettings(prev => ({ ...prev, theme }));
	}, [theme]);

	const handleLogout = () => {
		Cookies.remove('token');
		Cookies.remove('user');
		router.push('/login');
	};

	const handleSaveSettings = async () => {
		setIsSaving(true);
		try {
			// Save settings to cookies (excluding theme which is managed by ThemeProvider)
			const settingsToSave = { notifications: settings.notifications };
			Cookies.set('settings', JSON.stringify(settingsToSave));
			
			const token = Cookies.get('token');
			if (token) {
				const res = await fetch('/api/auth/profile', {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
					body: JSON.stringify({ name, email }),
				});
				const data = await res.json();
				if (data?.success && data.user) {
					Cookies.set('user', JSON.stringify(data.user));
					setUser(data.user);
					showToast('Paramètres sauvegardés avec succès', 'success');
				} else {
					showToast('Échec de la sauvegarde', 'error');
				}
			} else {
				const updatedUser = { ...(user || {}), name, email };
				Cookies.set('user', JSON.stringify(updatedUser));
				setUser(updatedUser);
				showToast('Paramètres sauvegardés localement', 'success');
			}
		} catch (err) {
			console.error('Failed to save settings', err);
			showToast('Erreur lors de la sauvegarde', 'error');
		} finally {
			setIsSaving(false);
		}
	};

	const initials = (name || email || 'U').trim().split(/\s+/).slice(0,2).map(p => p[0]?.toUpperCase()).join('');

	const handlePasswordChange = async () => {
		if (!passwords.new || passwords.new !== passwords.confirm) {
			showToast('Les mots de passe ne correspondent pas', 'error');
			return;
		}
		try {
			const token = Cookies.get('token');
			const res = await fetch('/api/auth/profile', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
				body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new })
			});
			const data = await res.json();
			if (data?.success) {
				showToast('Mot de passe mis à jour', 'success');
				setPasswords({ current: '', new: '', confirm: '' });
				setShowPasswordChange(false);
			} else {
				showToast(data?.error || 'Échec', 'error');
			}
		} catch (err) {
			showToast('Erreur réseau', 'error');
		}
	};

	return (
		<main className="min-h-screen w-full relative overflow-x-hidden bg-gradient-to-br from-white via-green-50/40 to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-green-950/40 transition-colors">
			<div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(circle_at_center,white,transparent)] opacity-60 dark:opacity-40" />
			<div className="max-w-5xl mx-auto px-6 py-10 relative">
				<header className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6">
					<div className="flex items-center gap-5">
						<div className="relative">
							<div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-700 flex items-center justify-center text-white text-2xl font-semibold shadow-lg shadow-green-600/30 dark:shadow-green-900/40 ring-4 ring-white dark:ring-slate-800">
								{initials}
							</div>
							<span className={`absolute -bottom-2 -right-2 px-3 py-1 text-xs rounded-full font-medium shadow bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 ${theme==='dark' ? 'text-green-300' : 'text-green-600'}`}>{role}</span>
						</div>
						<div>
							<h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-emerald-600 to-green-500 dark:from-green-300 dark:via-emerald-400 dark:to-green-400">Paramètres du profil</h1>
							<p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-prose">Gérez vos informations personnelles, préférences d'affichage et notifications.</p>
						</div>
					</div>
					<div className="flex gap-3">
						{role === 'admin' && (
							<Link 
								href="/admin/users"
								className="group relative px-5 py-3 rounded-xl border border-green-300 dark:border-green-700 bg-gradient-to-r from-green-600 to-emerald-600 text-sm font-semibold text-white shadow-lg shadow-green-500/30 hover:opacity-90 transition-all flex items-center gap-2"
							>
								<Users className="w-4 h-4" />
								<span className="relative">Gérer Utilisateurs</span>
							</Link>
						)}
						<button 
							onClick={handleLogout}
							className="group relative px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:border-red-400 hover:text-red-600 dark:hover:border-red-500 dark:hover:text-red-400 transition-colors overflow-hidden"
						>
							<span className="relative">Se déconnecter</span>
						</button>
					</div>
				</header>

				{loading && (
					<div className="grid gap-6 md:grid-cols-2 animate-pulse">
						<div className="h-40 rounded-2xl bg-gray-200/60 dark:bg-slate-800/40" />
						<div className="h-40 rounded-2xl bg-gray-200/60 dark:bg-slate-800/40" />
						<div className="h-56 rounded-2xl bg-gray-200/60 dark:bg-slate-800/40 md:col-span-2" />
					</div>
				)}

				{!loading && !user && (
					<div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-10 text-center backdrop-blur-sm bg-white/50 dark:bg-slate-900/40">
						<p className="text-gray-600 dark:text-gray-400">Aucune information utilisateur. <a href="/login" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Se connecter</a></p>
					</div>
				)}

				{user && (
					<>
						{/* Stats Cards */}
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
							<div className="group rounded-xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-xs font-medium text-gray-500 dark:text-gray-400">Conversations</p>
										<p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.conversations}</p>
										<p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">Total créées</p>
									</div>
									<MessageSquare className="w-8 h-8 text-green-500 dark:text-green-400" />
								</div>
							</div>
							<div className="group rounded-xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-xs font-medium text-gray-500 dark:text-gray-400">Messages</p>
										<p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.messages}</p>
										<p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">Échangés</p>
									</div>
									<Mail className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
								</div>
							</div>
							<div className="group rounded-xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-xs font-medium text-gray-500 dark:text-gray-400">Fichiers</p>
										<p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.filesUploaded}</p>
										<p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">En bibliothèque</p>
									</div>
									<Library className="w-8 h-8 text-green-600 dark:text-green-500" />
								</div>
							</div>
							<div className="group rounded-xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-xs font-medium text-gray-500 dark:text-gray-400">Temps de réponse</p>
										<p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.averageResponseTime}s</p>
										<p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">Moyenne</p>
									</div>
									<RefreshCw className="w-8 h-8 text-blue-500 dark:text-blue-400" />
								</div>
							</div>
						</div>

						{/* Analytics Section */}
						<div className="grid gap-6 lg:grid-cols-2 mb-8">
							{/* Activity Analytics */}
							<div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm p-6 shadow-sm">
								<h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
									<Settings className="w-4 h-4 text-green-600 dark:text-green-400" />
									Analyse d'activité
								</h3>
								<div className="space-y-4">
									<div>
										<div className="flex items-center justify-between mb-2">
											<span className="text-xs text-gray-600 dark:text-gray-400">Utilisation du chat</span>
											<span className="text-xs font-semibold text-gray-900 dark:text-white">
												{stats.conversations > 0 ? Math.min(100, Math.floor((stats.conversations / 10) * 100)) : 0}%
											</span>
										</div>
										<div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
											<div 
												className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
												style={{ width: `${stats.conversations > 0 ? Math.min(100, Math.floor((stats.conversations / 10) * 100)) : 0}%` }}
											/>
										</div>
									</div>
									<div>
										<div className="flex items-center justify-between mb-2">
											<span className="text-xs text-gray-600 dark:text-gray-400">Bibliothèque utilisée</span>
											<span className="text-xs font-semibold text-gray-900 dark:text-white">
												{stats.filesUploaded > 0 ? Math.min(100, Math.floor((stats.filesUploaded / 5) * 100)) : 0}%
											</span>
										</div>
										<div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
											<div 
												className="h-full bg-gradient-to-r from-green-600 to-green-500 rounded-full transition-all duration-500"
												style={{ width: `${stats.filesUploaded > 0 ? Math.min(100, Math.floor((stats.filesUploaded / 5) * 100)) : 0}%` }}
											/>
										</div>
									</div>
									<div>
										<div className="flex items-center justify-between mb-2">
											<span className="text-xs text-gray-600 dark:text-gray-400">Engagement</span>
											<span className="text-xs font-semibold text-gray-900 dark:text-white">
												{stats.messages > 0 ? Math.min(100, Math.floor((stats.messages / 20) * 100)) : 0}%
											</span>
										</div>
										<div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
											<div 
												className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full transition-all duration-500"
												style={{ width: `${stats.messages > 0 ? Math.min(100, Math.floor((stats.messages / 20) * 100)) : 0}%` }}
											/>
										</div>
									</div>
								</div>
							</div>

							{/* Usage Insights */}
							<div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm p-6 shadow-sm">
								<h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
									<User className="w-4 h-4 text-green-600 dark:text-green-400" />
									Insights d'utilisation
								</h3>
								<div className="space-y-4">
									<div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
												<MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
											</div>
											<div>
												<p className="text-xs font-medium text-gray-900 dark:text-white">Fonctionnalité favorite</p>
												<p className="text-[11px] text-gray-600 dark:text-gray-400">{stats.mostUsedFeature}</p>
											</div>
										</div>
									</div>
									
									<div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/40 rounded-lg">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
												<RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400" />
											</div>
											<div>
												<p className="text-xs font-medium text-gray-900 dark:text-white">Dernière activité</p>
												<p className="text-[11px] text-gray-600 dark:text-gray-400">
													{stats.lastActive 
														? new Date(stats.lastActive).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
														: 'Aucune activité'
													}
												</p>
											</div>
										</div>
									</div>

									<div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/40 rounded-lg">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
												<Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
											</div>
											<div>
												<p className="text-xs font-medium text-gray-900 dark:text-white">Messages par conversation</p>
												<p className="text-[11px] text-gray-600 dark:text-gray-400">
													{stats.conversations > 0 ? Math.floor(stats.messages / stats.conversations) : 0} en moyenne
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="grid gap-8 md:grid-cols-2">
							{/* Account Card */}
							<section className="group rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition">
								<h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
									<User className="w-4 h-4" />
									Compte
								</h2>
								<div className="space-y-4">
									<div>
										<label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
											<User className="w-3 h-3" />
											Nom
										</label>
										<input 
											className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" 
											value={name} 
											onChange={(e) => setName(e.target.value)} 
										/>
									</div>
									<div>
										<label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
											<Mail className="w-3 h-3" />
											Email
										</label>
										<input 
											className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" 
											value={email} 
											onChange={(e) => setEmail(e.target.value)} 
										/>
									</div>
									<div>
										<label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
											<Shield className="w-3 h-3" />
											Rôle
										</label>
										<input 
											readOnly 
											className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-400" 
											value={role} 
										/>
									</div>
									<div className="pt-4 border-t border-gray-200 dark:border-gray-700">
										<button 
											onClick={handleSaveSettings} 
											disabled={isSaving} 
											className="w-full px-5 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-700 text-white shadow hover:opacity-90 disabled:opacity-50 transition"
										>
											{isSaving ? 'Enregistrement…' : 'Enregistrer les modifications'}
										</button>
									</div>
								</div>
							</section>

							{/* Preferences Card */}
							<section className="group rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition">
								<h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
									{theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
									Préférences
								</h2>
								<div className="space-y-5">
									{/* Theme Switch */}
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											{theme === 'dark' ? <Moon className="w-4 h-4 text-gray-600 dark:text-gray-300" /> : <Sun className="w-4 h-4 text-gray-600 dark:text-gray-300" />}
											<div>
												<p className="text-xs font-medium text-gray-600 dark:text-gray-300">Mode sombre</p>
												<p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Améliore le confort visuel</p>
											</div>
										</div>
										<button
											onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
											className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${theme==='dark' ? 'bg-green-600' : 'bg-gray-300'}`}
											aria-label="Basculer le thème"
										>
											<span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition ${theme==='dark' ? 'translate-x-7' : 'translate-x-1'}`}></span>
										</button>
									</div>

									{/* Notifications Switch */}
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											{settings.notifications ? <Bell className="w-4 h-4 text-gray-600 dark:text-gray-300" /> : <BellOff className="w-4 h-4 text-gray-600 dark:text-gray-300" />}
											<div>
												<p className="text-xs font-medium text-gray-600 dark:text-gray-300">Notifications email</p>
												<p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Recevoir des alertes importantes</p>
											</div>
										</div>
										<button
											onClick={() => setSettings(prev => ({ ...prev, notifications: !prev.notifications }))}
											className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${settings.notifications ? 'bg-green-600' : 'bg-gray-300'}`}
											aria-label="Basculer notifications"
										>
											<span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition ${settings.notifications ? 'translate-x-7' : 'translate-x-1'}`}></span>
										</button>
									</div>

									{/* Theme Preview */}
									<div className="mt-2 grid grid-cols-3 gap-3">
										<div className="h-12 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-[10px] font-medium bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300">UI</div>
										<div className="h-12 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-[10px] font-medium bg-gradient-to-r from-green-600 to-emerald-600 text-white">Action</div>
										<div className="h-12 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-[10px] font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200">Surface</div>
									</div>
								</div>
							</section>

							{/* Password Change Section */}
							<section className="md:col-span-2 group rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition">
								<h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
									<Lock className="w-4 h-4" />
									Sécurité
								</h2>
								{!showPasswordChange ? (
									<button
										onClick={() => setShowPasswordChange(true)}
										className="px-4 py-2 rounded-lg text-xs font-semibold bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-slate-600 transition"
									>
										Changer le mot de passe
									</button>
								) : (
									<div className="space-y-3">
										<input
											type="password"
											placeholder="Mot de passe actuel"
											value={passwords.current}
											onChange={(e) => setPasswords(p => ({ ...p, current: e.target.value }))}
											className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
										/>
										<input
											type="password"
											placeholder="Nouveau mot de passe"
											value={passwords.new}
											onChange={(e) => setPasswords(p => ({ ...p, new: e.target.value }))}
											className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
										/>
										<input
											type="password"
											placeholder="Confirmer le nouveau"
											value={passwords.confirm}
											onChange={(e) => setPasswords(p => ({ ...p, confirm: e.target.value }))}
											className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
										/>
										<div className="flex gap-2">
											<button onClick={handlePasswordChange} className="px-4 py-2 rounded-lg text-xs font-semibold bg-green-600 text-white hover:bg-green-700 transition">
												Mettre à jour
											</button>
											<button onClick={() => { setShowPasswordChange(false); setPasswords({ current: '', new: '', confirm: '' }); }} className="px-4 py-2 rounded-lg text-xs font-semibold bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-slate-600 transition">
												Annuler
											</button>
										</div>
									</div>
								)}
							</section>

							{/* Advanced / Danger Zone */}
							<section className="md:col-span-2 group rounded-2xl border border-red-200/40 dark:border-red-900/40 bg-red-50/40 dark:bg-red-900/10 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition">
								<h2 className="text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
									<RefreshCw className="w-4 h-4" />
									Zone sensible
								</h2>
								<p className="text-xs text-red-700 dark:text-red-300 mb-3 max-w-prose">La suppression du jeton local peut résoudre des problèmes de session. Cette action ne supprime pas votre compte.</p>
								<button
									onClick={() => { Cookies.remove('token'); Cookies.remove('user'); alert('Session locale réinitialisée. Veuillez vous reconnecter.'); }}
									className="px-4 py-2 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
								>
									Réinitialiser la session
								</button>
							</section>
						</div>
					</>
				)}
			</div>
		</main>
	);
}

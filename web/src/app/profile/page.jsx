"use client";

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useTheme } from '../ThemeProvider';

export default function ProfilePage() {
	const [user, setUser] = useState(null);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [role, setRole] = useState('user');
	const [settings, setSettings] = useState({ theme: 'dark', notifications: true });
	const [isSaving, setIsSaving] = useState(false);
	const { theme, setTheme } = useTheme();
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
				if (parsedSettings?.theme) {
					setTheme(parsedSettings.theme);
				}
			} catch (e) {
				// ignore malformed cookie
			}
		}
		setLoading(false);
	}, [setTheme]);

	useEffect(() => {
		setSettings(prev => (prev.theme === theme ? prev : { ...prev, theme }));
	}, [theme]);

	const handleLogout = () => {
		Cookies.remove('token');
		Cookies.remove('user');
		router.push('/login');
	};

	const handleSaveSettings = async () => {
		setIsSaving(true);
		try {
			const newSettings = { ...settings, theme };
			Cookies.set('settings', JSON.stringify(newSettings));
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
				}
			} else {
				const updatedUser = { ...(user || {}), name, email };
				Cookies.set('user', JSON.stringify(updatedUser));
				setUser(updatedUser);
			}
		} catch (err) {
			console.error('Failed to save settings', err);
		} finally {
			setIsSaving(false);
		}
	};

	const initials = (name || email || 'U').trim().split(/\s+/).slice(0,2).map(p => p[0]?.toUpperCase()).join('');

	return (
		<main className="min-h-screen w-full relative overflow-x-hidden bg-gradient-to-br from-white via-indigo-50/40 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/40 transition-colors">
			<div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(circle_at_center,white,transparent)] opacity-60 dark:opacity-40" />
			<div className="max-w-5xl mx-auto px-6 py-10 relative">
				<header className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6">
					<div className="flex items-center gap-5">
						<div className="relative">
							<div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-700 flex items-center justify-center text-white text-2xl font-semibold shadow-lg shadow-indigo-600/30 dark:shadow-indigo-900/40 ring-4 ring-white dark:ring-slate-800">
								{initials}
							</div>
							<span className={`absolute -bottom-2 -right-2 px-3 py-1 text-xs rounded-full font-medium shadow bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 ${theme==='dark' ? 'text-indigo-300' : 'text-indigo-600'}`}>{role}</span>
						</div>
						<div>
							<h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-300 dark:via-purple-400 dark:to-pink-400">Paramètres du profil</h1>
							<p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-prose">Gérez vos informations personnelles, préférences d'affichage et notifications.</p>
						</div>
					</div>
					<div className="flex gap-3">
						<button 
							onClick={handleLogout}
							className="group relative px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:border-red-400 hover:text-red-600 dark:hover:border-red-500 dark:hover:text-red-400 transition-colors overflow-hidden"
						>
							<span className="relative">Se déconnecter</span>
						</button>
						<button 
							onClick={handleSaveSettings} 
							disabled={isSaving} 
							className="px-5 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-700 text-white shadow hover:opacity-90 disabled:opacity-50 transition"
						>
							{isSaving ? 'Enregistrement…' : 'Enregistrer'}
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
					<div className="grid gap-8 md:grid-cols-2">
						{/* Account Card */}
						<section className="group rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition">
							<h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">Compte</h2>
							<div className="space-y-4">
								<div>
									<label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Nom</label>
									<input 
										className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" 
										value={name} 
										onChange={(e) => setName(e.target.value)} 
									/>
								</div>
								<div>
									<label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Email</label>
									<input 
										className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" 
										value={email} 
										onChange={(e) => setEmail(e.target.value)} 
									/>
								</div>
								<div>
									<label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Rôle</label>
									<input 
										readOnly 
										className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-400" 
										value={role} 
									/>
								</div>
							</div>
						</section>

						{/* Preferences Card */}
						<section className="group rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition">
							<h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">Préférences</h2>
							<div className="space-y-5">
								{/* Theme Switch */}
								<div className="flex items-center justify-between">
									<div>
										<p className="text-xs font-medium text-gray-600 dark:text-gray-300">Mode sombre</p>
										<p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Améliore le confort visuel</p>
									</div>
									<button
										onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
										className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${theme==='dark' ? 'bg-indigo-600' : 'bg-gray-300'}`}
										aria-label="Basculer le thème"
									>
										<span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition ${theme==='dark' ? 'translate-x-7' : 'translate-x-1'}`}></span>
									</button>
								</div>

								{/* Notifications Switch */}
								<div className="flex items-center justify-between">
									<div>
										<p className="text-xs font-medium text-gray-600 dark:text-gray-300">Notifications email</p>
										<p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Recevoir des alertes importantes</p>
									</div>
									<button
										onClick={() => setSettings(prev => ({ ...prev, notifications: !prev.notifications }))}
										className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${settings.notifications ? 'bg-indigo-600' : 'bg-gray-300'}`}
										aria-label="Basculer notifications"
									>
										<span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition ${settings.notifications ? 'translate-x-7' : 'translate-x-1'}`}></span>
									</button>
								</div>

								{/* Theme Preview */}
								<div className="mt-2 grid grid-cols-3 gap-3">
									<div className="h-12 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-[10px] font-medium bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300">UI</div>
									<div className="h-12 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-[10px] font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white">Action</div>
									<div className="h-12 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-[10px] font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200">Surface</div>
								</div>
							</div>
						</section>

						{/* Advanced / Danger Zone */}
						<section className="md:col-span-2 group rounded-2xl border border-red-200/40 dark:border-red-900/40 bg-red-50/40 dark:bg-red-900/10 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition">
							<h2 className="text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400 mb-4">Zone sensible</h2>
							<p className="text-xs text-red-700 dark:text-red-300 mb-3 max-w-prose">La suppression du jeton local peut résoudre des problèmes de session. Cette action ne supprime pas votre compte.</p>
							<button
								onClick={() => { Cookies.remove('token'); Cookies.remove('user'); alert('Session locale réinitialisée. Veuillez vous reconnecter.'); }}
								className="px-4 py-2 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
							>
								Réinitialiser la session
							</button>
						</section>
					</div>
				)}
			</div>
		</main>
	);
}


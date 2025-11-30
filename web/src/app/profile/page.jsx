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

	return (
		<main className="w-full min-h-screen bg-gray-100 dark:bg-gray-900 p-6 transition-colors">
			<div className="max-w-3xl mx-auto">
				<div className="dark:bg-gray-800 shadow rounded-lg p-6 transition-colors">
					<h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Profile</h2>

					{user ? (
						<div className="w-full space-y-4 h-full">
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
								<input 
									className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors" 
									value={name} 
									onChange={(e) => setName(e.target.value)} 
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
								<input 
									className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors" 
									value={email} 
									onChange={(e) => setEmail(e.target.value)} 
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
								<input 
									readOnly 
									className="mt-1 block w-full border border-gray-200 dark:border-gray-600 rounded-md p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-400 transition-colors" 
									value={role} 
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Preferences</label>
								<div className="mt-2 space-y-2">
									<div className="flex items-center space-x-2">
										<input
											id="dark"
											type="checkbox"
											checked={theme === 'dark'}
											onChange={(e) => {
												const nextTheme = e.target.checked ? 'dark' : 'light';
												setTheme(nextTheme);
											}}
											className="w-4 h-4 text-indigo-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500"
										/>
										<label htmlFor="dark" className="text-gray-700 dark:text-gray-300">Dark Mode</label>
									</div>
									<div className="flex items-center space-x-2">
										<input 
											id="notif" 
											type="checkbox" 
											checked={settings.notifications} 
											onChange={(e) => setSettings(prev => ({ ...prev, notifications: e.target.checked }))} 
											className="w-4 h-4 text-indigo-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500"
										/>
										<label htmlFor="notif" className="text-gray-700 dark:text-gray-300">Email notifications</label>
									</div>
								</div>
							</div>

							<div className="flex items-center space-x-3 mt-4">
								<button 
									onClick={handleSaveSettings} 
									disabled={isSaving} 
									className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors disabled:opacity-50"
								>
									{isSaving ? 'Saving...' : 'Save'}
								</button>
								<button 
									onClick={handleLogout} 
									className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
								>
									Logout
								</button>
							</div>
						</div>
					) : (
						<div className="text-gray-500 dark:text-gray-400">
							No user information available. <a href="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline">Sign in</a>
						</div>
					)}
				</div>
			</div>
		</main>
	);
}


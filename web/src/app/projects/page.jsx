'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Navbar from '../containers/Navbar';
import { FolderPlus, FolderOpen, FileText, PlusCircle, Search, RefreshCw, Settings, ChevronRight, X } from 'lucide-react';
import { useNotification } from '../components/NotificationProvider';
import Cookies from 'js-cookie';

export default function ProjectsPage() {
	const [projects, setProjects] = useState([]);
	const [filter, setFilter] = useState('all');
	const [query, setQuery] = useState('');
	const [loading, setLoading] = useState(false);
	const [creating, setCreating] = useState(false);
	const { showToast, showConfirm } = useNotification();

	// Load projects from API (fallback to local if unauthenticated)
	useEffect(() => {
		const load = async () => {
			setLoading(true);
			try {
				const token = Cookies.get('token');
				if (token) {
					const res = await fetch('/api/projects', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
					const data = await res.json();
					if (res.ok && data.success) {
						setProjects((data.projects || []).map(p => ({ ...p, id: p._id })));
					} else {
						// fallback to local
						const raw = localStorage.getItem('kh-projects');
						const list = raw ? JSON.parse(raw) : [];
						setProjects(Array.isArray(list) ? list : []);
					}
				} else {
					const raw = localStorage.getItem('kh-projects');
					const list = raw ? JSON.parse(raw) : [];
					setProjects(Array.isArray(list) ? list : []);
				}
			} catch {
				const raw = localStorage.getItem('kh-projects');
				const list = raw ? JSON.parse(raw) : [];
				setProjects(Array.isArray(list) ? list : []);
			} finally {
				setLoading(false);
			}
		};
		load();
	}, []);

	const saveProjects = (next) => {
		setProjects(next);
		try { localStorage.setItem('kh-projects', JSON.stringify(next)); } catch {}
	};

	const filtered = useMemo(() => {
		const byQuery = projects.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
		if (filter === 'all') return byQuery;
		return byQuery.filter(p => p.type === filter);
	}, [projects, filter, query]);

	const [showNameModal, setShowNameModal] = useState(false);
	const [newProjectName, setNewProjectName] = useState('');

	const handleCreate = async () => {
		setShowNameModal(true);
	};

	const submitCreate = async () => {
		const name = newProjectName.trim();
		if (!name) { showToast('Nom requis', 'error'); return; }
		setCreating(true);
		try {
			const token = Cookies.get('token');
			if (token) {
				const res = await fetch('/api/projects', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
					body: JSON.stringify({ name, type: 'general' })
				});
				const data = await res.json();
				if (res.ok && data.success) {
					setProjects(prev => [{ ...data.project, id: data.project._id }, ...prev]);
					showToast('Projet créé', 'success');
				} else {
					showToast(data?.error || 'Échec de la création', 'error');
				}
			} else {
				const id = Math.random().toString(36).slice(2, 10);
				const now = new Date().toISOString();
				const next = [{ id, name, type: 'general', files: 0, updatedAt: now }, ...projects];
				saveProjects(next);
				showToast('Projet créé (local)', 'success');
			}
		} catch (e) {
			showToast('Erreur réseau', 'error');
		} finally {
			setCreating(false);
			setShowNameModal(false);
			setNewProjectName('');
		}
	};

	const handleDelete = async (id) => {
		const ok = await showConfirm({
			title: 'Supprimer le projet',
			message: 'Êtes-vous sûr ? Cette action est irréversible.',
			confirmText: 'Supprimer',
			cancelText: 'Annuler',
			type: 'danger'
		});
		if (!ok) return;
		try {
			const token = Cookies.get('token');
			if (token && id?.length === 24) {
				const res = await fetch(`/api/projects?id=${encodeURIComponent(id)}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
				const data = await res.json();
				if (!(res.ok && data.success)) throw new Error(data?.error || 'Delete failed');
			}
		} catch (e) {
			// proceed to local update anyway
		}
		const next = projects.filter(p => (p._id ? p._id !== id : p.id !== id));
		saveProjects(next);
		showToast('Projet supprimé', 'success');
	};

	return (
		<main className="min-h-screen flex flex-row w-full relative overflow-x-hidden bg-gradient-to-br from-white via-indigo-50/40 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/40 transition-colors">
			<Navbar />
			<div className="max-w-7xl p-6 mx-auto w-full">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projets</h1>
						<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Organisez vos fichiers et contextes par projet</p>
					</div>
					<div className="flex items-center gap-2">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
							<input
								value={query}
								onChange={e => setQuery(e.target.value)}
								placeholder="Rechercher un projet…"
								className="pl-10 pr-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm"
							/>
						</div>
						<select
							value={filter}
							onChange={e => setFilter(e.target.value)}
							className="px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm"
						>
							<option value="all">Tous</option>
							<option value="general">Général</option>
						</select>
						<button
							onClick={handleCreate}
							disabled={creating}
							className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition disabled:opacity-50"
						>
							<PlusCircle className={`w-4 h-4 ${creating ? 'animate-spin' : ''}`} />
							Nouveau projet
						</button>
					</div>
				</div>

				{filtered.length === 0 ? (
					<div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-200 dark:border-white/10 p-12 text-center">
						<FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
						<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Aucun projet</h3>
						<p className="text-gray-600 dark:text-gray-400 mb-4">Créez votre premier projet pour organiser vos fichiers.</p>
						<button
							onClick={handleCreate}
							disabled={creating}
							className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition disabled:opacity-50"
						>
							<FolderPlus className="w-4 h-4" />
							Créer un projet
						</button>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
						{filtered.map(project => (
							  <div key={project._id || project.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-white/10 p-4 hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
								<div className="flex items-start justify-between mb-3">
									<div className="flex items-center gap-2">
										<FolderOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
										<h3 className="text-sm font-semibold text-gray-900 dark:text-white" title={project.name}>{project.name}</h3>
									</div>
									<div className="flex items-center gap-2">
										<button
											onClick={() => handleDelete(project.id)}
											className="px-2 py-1 text-xs rounded-md bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50"
										>
											Supprimer
										</button>
									</div>
								</div>
								<div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
									<FileText className="w-3.5 h-3.5" />
									<span>{project.files || 0} fichier(s)</span>
									<span>•</span>
									  <span>{project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : '—'}</span>
								</div>
								<div className="mt-3 flex items-center justify-between">
									<Link href={`/library`} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1">
										Ouvrir la bibliothèque
										<ChevronRight className="w-3 h-3" />
									</Link>
									<Link href={`/chats`} className="text-xs text-gray-600 dark:text-gray-400 hover:underline inline-flex items-center gap-1">
										Discuter
										<ChevronRight className="w-3 h-3" />
									</Link>
								</div>
							</div>
						))}
					</div>
				)}

				{/* Name modal */}
				{showNameModal && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
						<div className="w-full max-w-md rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 p-4 shadow-xl">
							<div className="flex items-center justify-between mb-2">
								<h3 className="text-sm font-semibold text-gray-900 dark:text-white">Nouveau projet</h3>
								<button onClick={() => { setShowNameModal(false); setNewProjectName(''); }} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-800">
									<X className="w-4 h-4 text-gray-500" />
								</button>
							</div>
							<p className="text-xs text-gray-600 dark:text-gray-400 mb-3">Entrez un nom pour votre projet.</p>
							<input
								autoFocus
								value={newProjectName}
								onChange={e => setNewProjectName(e.target.value)}
								placeholder="Ex: Support Client Q1"
								className="w-full kh-input rounded-lg px-3 py-2 text-sm"
							/>
							<div className="mt-3 flex items-center justify-end gap-2">
								<button onClick={() => { setShowNameModal(false); setNewProjectName(''); }} className="px-3 py-2 text-xs rounded-lg bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-gray-200">Annuler</button>
								<button onClick={submitCreate} disabled={creating} className="px-3 py-2 text-xs rounded-lg bg-indigo-600 text-white disabled:opacity-50">Créer</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</main>
	);
}

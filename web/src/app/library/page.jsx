'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useNotification } from '../components/NotificationProvider';
import { FileText, Download, Trash2, RefreshCw, File, FileSpreadsheet, FileImage, FileVideo, FileAudio, Shield, Search, Sparkles } from 'lucide-react';
import Navbar from '../containers/Navbar';

export default function LibraryPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [uploading, setUploading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchMode, setSearchMode] = useState('simple'); // 'simple' or 'semantic'
  const [semanticSearching, setSemanticSearching] = useState(false);
  const [semanticResults, setSemanticResults] = useState(null);
  const { showToast, showConfirm } = useNotification();

  useEffect(() => {
    // Check if user is admin
    const rawUser = Cookies.get('user');
    if (rawUser) {
      try {
        const user = JSON.parse(rawUser);
        setIsAdmin(user.role === 'admin');
      } catch (e) {
        setIsAdmin(false);
      }
    }
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/library', {
        credentials: 'same-origin',
        cache: 'no-store',
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error('API error:', errorData);
        showToast(errorData?.error || 'Échec du chargement des fichiers', 'error');
        setFiles([]);
        return;
      }
      
      const data = await res.json();
      
      if (data?.success) {
        setFiles(data.files || []);
        if (data.files && data.files.length > 0) {
          showToast(`${data.files.length} fichier(s) chargé(s)`, 'success');
        }
      } else {
        showToast(data?.error || 'Échec du chargement des fichiers', 'error');
        setFiles([]);
      }
    } catch (err) {
      console.error('Failed to fetch files', err);
      showToast('Erreur de connexion au serveur AI', 'error');
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleSemanticSearch = async () => {
    if (!query.trim()) {
      showToast('Veuillez entrer un terme de recherche', 'warning');
      return;
    }

    setSemanticSearching(true);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data = await res.json();
      
      if (data?.success) {
        const resultFiles = data.files || [];
        setSemanticResults(resultFiles);
        showToast(`${resultFiles.length} fichier(s) trouvé(s)`, 'success');
      } else {
        showToast(data?.error || 'Échec de la recherche', 'error');
        setSemanticResults([]);
      }
    } catch (err) {
      console.error('Semantic search failed', err);
      showToast('Erreur lors de la recherche sémantique', 'error');
      setSemanticResults([]);
    } finally {
      setSemanticSearching(false);
    }
  };

  const handleSearchModeChange = (mode) => {
    setSearchMode(mode);
    setSemanticResults(null);
    if (mode === 'simple') {
      setQuery('');
    }
  };

  const filteredFiles = files.filter((f) => {
    if (filter === 'all') return true;
    const ext = f.name.split('.').pop()?.toLowerCase();
    const typeGroups = {
      docs: ['pdf', 'doc', 'docx', 'txt', 'md'],
      sheets: ['xlsx', 'xls', 'csv'],
      images: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'],
      videos: ['mp4', 'avi', 'mov', 'mkv'],
      audio: ['mp3', 'wav', 'ogg'],
    };
    return (typeGroups[filter] || []).includes(ext);
  });

  const searchedFiles = searchMode === 'semantic' && semanticResults !== null
    ? filteredFiles.filter((f) => semanticResults.includes(f.name))
    : filteredFiles.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()));

  const sortedFiles = [...searchedFiles].sort((a, b) => {
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
    if (sortBy === 'size-asc') return (a.size || 0) - (b.size || 0);
    if (sortBy === 'size-desc') return (b.size || 0) - (a.size || 0);
    if (sortBy === 'date-desc') return new Date(b.modified || 0) - new Date(a.modified || 0);
    if (sortBy === 'date-asc') return new Date(a.modified || 0) - new Date(b.modified || 0);
    return 0;
  });

  const handleDelete = async (filename) => {
    if (!isAdmin) {
      showToast('Accès refusé. Privilèges administrateur requis.', 'error');
      return;
    }

    const confirmed = await showConfirm({
      title: 'Supprimer le fichier',
      message: `Êtes-vous sûr de vouloir supprimer "${filename}" ? Cette action est irréversible.`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      type: 'danger'
    });
    
    if (!confirmed) return;

    setDeleting(filename);
    try {
      const token = Cookies.get('token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const res = await fetch(`/api/library?filename=${encodeURIComponent(filename)}`, {
        method: 'DELETE',
        headers,
        credentials: 'same-origin',
      });
      const data = await res.json();
      
      if (data?.success) {
        setFiles(prev => prev.filter(f => f.name !== filename));
        showToast('Fichier supprimé avec succès', 'success');
      } else {
        showToast(data?.error || 'Échec de la suppression', 'error');
      }
    } catch (err) {
      console.error('Failed to delete file', err);
      showToast('Erreur lors de la suppression', 'error');
    } finally {
      setDeleting(null);
    }
  };

  const handleDownload = (filename) => {
    const link = document.createElement('a');
    link.href = `/api/library/${encodeURIComponent(filename)}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Téléchargement démarré', 'info');
  };
  const Linkfiles = process.env.AI_URL || 'http://localhost:8000/files/';
  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    
    if (['pdf', 'doc', 'docx', 'txt', 'md'].includes(ext)) {
      return <FileText className="w-8 h-8 text-blue-500" />;
    } else if (['xlsx', 'xls', 'csv'].includes(ext)) {
      return <FileSpreadsheet className="w-8 h-8 text-green-500" />;
    } else if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) {
      return <FileImage className="w-8 h-8 text-purple-500" />;
    } else if (['mp4', 'avi', 'mov', 'mkv'].includes(ext)) {
      return <FileVideo className="w-8 h-8 text-red-500" />;
    } else if (['mp3', 'wav', 'ogg'].includes(ext)) {
      return <FileAudio className="w-8 h-8 text-yellow-500" />;
    }
    return <File className="w-8 h-8 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleUpload = async (event) => {
    if (!isAdmin) {
      showToast('Accès refusé. Privilèges administrateur requis.', 'error');
      return;
    }

    try {
      const files = Array.from(event.target.files || []);
      if (files.length === 0) return;
      setUploading(true);
      
      const token = Cookies.get('token');
      
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        const res = await fetch('/api/library', {
          method: 'POST',
          headers,
          body: formData,
          credentials: 'same-origin',
        });
        const data = await res.json();
        if (!(res.ok && data.success)) {
          showToast(data?.error || `Échec de l'upload: ${file.name}`, 'error');
        }
      }
      showToast('Upload terminé', 'success');
      await fetchFiles();
    } catch (e) {
      showToast("Erreur lors de l'upload", 'error');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <main className="min-h-screen flex flex-row w-full relative overflow-x-hidden bg-gradient-to-br from-white via-indigo-50/40 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/40 transition-colors">
        <Navbar/>
      <div className="max-w-7xl p-6 mx-auto">
        {/* Admin Banner */}
        {isAdmin && (
          <div className="mb-4 p-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-medium text-amber-900 dark:text-amber-100">
              Mode Administrateur - Vous pouvez gérer les fichiers
            </span>
          </div>
        )}
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bibliothèque</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Fichiers disponibles dans la base de connaissances
            </p>
          </div>
          <div className="flex items-center gap-3 ">
            {/* Search Mode Toggle */}
           
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm"
            >
              <option value="all">Tous les types</option>
              <option value="docs">Documents</option>
              <option value="sheets">Feuilles</option>
              <option value="images">Images</option>
              <option value="videos">Vidéos</option>
              <option value="audio">Audio</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm"
            >
              <option value="name-asc">Nom ▲</option>
              <option value="name-desc">Nom ▼</option>
              <option value="size-asc">Taille ▲</option>
              <option value="size-desc">Taille ▼</option>
              <option value="date-desc">Récents</option>
              <option value="date-asc">Anciens</option>
            </select>
            {isAdmin && (
              <label className="inline-flex items-center px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors cursor-pointer">
                <input type="file" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
                <span>{uploading ? 'Upload…' : 'Uploader'}</span>
              </label>
            )}
            <button
              onClick={fetchFiles}
              disabled={loading}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Actualiser</span>
            </button>
          </div>
        </div>
          <div className='flex w-full items-center gap-3 mb-4'>
             <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-slate-800 rounded-lg">
              <button
                onClick={() => handleSearchModeChange('simple')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  searchMode === 'simple'
                    ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Search className="w-3 h-3 inline mr-1" />
                Simple
              </button>
              <button
                onClick={() => handleSearchModeChange('semantic')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  searchMode === 'semantic'
                    ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Sparkles className="w-3 h-3 inline mr-1" />
                Sémantique
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full max-w-sm">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && searchMode === 'semantic') {
                    handleSemanticSearch();
                  }
                }}
                placeholder={searchMode === 'semantic' ? 'Recherche sémantique...' : 'Rechercher par nom…'}
                className="px-3 py-2 pr-10 rounded-lg w-full border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm min-w-[200px]"
              />
              {searchMode === 'semantic' && (
                <button
                  onClick={handleSemanticSearch}
                  disabled={semanticSearching || !query.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded transition-colors disabled:opacity-50"
                  title="Rechercher"
                >
                  {semanticSearching ? (
                    <RefreshCw className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  ) : (
                    <Search className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              )}
            </div>
          </div>

        {/* Semantic Search Results Info */}
        {searchMode === 'semantic' && semanticResults !== null && (
          <div className="mb-6 space-y-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm text-indigo-900 dark:text-indigo-100">
                  Résultats sémantiques pour "<strong>{query}</strong>" : {semanticResults.length} fichier(s) pertinent(s)
                </span>
              </div>
              <button
                onClick={() => {
                  setSemanticResults(null);
                  setQuery('');
                }}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Effacer
              </button>
            </div>

            {/* Display Semantic Search Results as Cards */}
            {semanticResults.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {semanticResults.map((filename) => {
                  const file = files.find(f => f.name === filename);
                  if (!file) return null;
                  
                  return (
                    <div 
                      key={file.name}
                      className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 rounded-xl shadow-lg border-2 border-indigo-300 dark:border-indigo-700 p-4 hover:shadow-xl transition-all duration-200 hover:-translate-y-1 cursor-pointer"
                      onClick={() => window.open(`${Linkfiles}${encodeURIComponent(file.name)}`, '_blank')}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                          {getFileIcon(file.name)}
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDownload(file.name); }}
                            className="p-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-colors"
                            title="Télécharger"
                          >
                            <Download className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          </button>
                          {isAdmin && (
                            <button
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(file.name); }}
                              disabled={deleting === file.name}
                              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                              title="Supprimer (Admin uniquement)"
                            >
                              {deleting === file.name ? (
                                <RefreshCw className="w-4 h-4 text-red-600 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                        <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-100 truncate" title={file.name}>
                          {file.name}
                        </h3>
                      </div>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                        Résultat pertinent
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {semanticResults.length === 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8 text-center">
                <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Aucun fichier pertinent trouvé pour "<strong>{query}</strong>"
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  Essayez une recherche différente ou utilisez la recherche simple
                </p>
              </div>
            )}
          </div>
        )}

        {/* Show regular file list only if not in semantic search mode with results */}
        {!(searchMode === 'semantic' && semanticResults !== null) && (
          <>
            {/* Loading State */}
        {loading && files.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Chargement des fichiers...</p>
            </div>
          </div>
        ) : files.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-200 dark:border-white/10 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Aucun fichier disponible
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              La bibliothèque est actuellement vide
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedFiles.map((file) => (
              <div 
                key={file.name}
                className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-white/10 p-4 hover:shadow-xl transition-all duration-200 hover:-translate-y-1 cursor-pointer"
                onClick={() => window.open(`${Linkfiles}${encodeURIComponent(file.name)}`, '_blank')}
              >
                <div className="flex items-start justify-between mb-3">
                  {getFileIcon(file.name)}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDownload(file.name); }}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="Télécharger"
                    >
                      <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    {isAdmin && (
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(file.name); }}
                        disabled={deleting === file.name}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                        title="Supprimer (Admin uniquement)"
                      >
                        {deleting === file.name ? (
                          <RefreshCw className="w-4 h-4 text-red-600 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 truncate" title={file.name}>
                  {file.name}
                </h3>
              </div>
            ))}
          </div>
        )}
      </>
        )}
      </div>
    </main>
  );
}

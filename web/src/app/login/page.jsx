"use client";

import React, { useState } from "react";
import { useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, Bot, User, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { useNotification } from "../components/NotificationProvider";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useNotification();
  const router = useRouter();
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'same-origin'
        });
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          if (data?.success) {
            router.replace('/');
          } else {
            Cookies.remove('token');
            Cookies.remove('user');
          }
        } else {
          Cookies.remove('token');
          Cookies.remove('user');
        }
      } catch (e) {
        if (!cancelled) {
          Cookies.remove('token');
          Cookies.remove('user');
        }
      }
    })();
    return () => { cancelled = true; };
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }

    if (!formData.password) {
      setError("Password is required");
      return false;
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Cookies.set('token', data.token, { expires: 1 });
        Cookies.set('user', JSON.stringify(data.user));
        showToast('Connexion réussie !', 'success');
        router.push('/');
      } else {
        setError(data.error || 'Login failed. Please check your credentials.');
        showToast(data.error || 'Échec de la connexion', 'error');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      showToast('Erreur réseau', 'error');
    } finally {
      setIsLoading(false);
    }
  };



  const handleQuickRegister = () => {
    router.push('/register');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors">
      <div className="max-w-6xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row transition-colors">
        {/* Left Side - OCP Branding */}
        <div className="md:w-1/2 bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 p-12 flex flex-col justify-center items-center text-white relative overflow-hidden">
          {/* Decorative Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 text-center space-y-6">
            {/* OCP Logo */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-3xl p-6 shadow-2xl">
                <img 
                  src="/ocp-logo.png" 
                  alt="OCP Logo" 
                  className="w-32 h-32 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="w-32 h-32 hidden flex-col items-center justify-center">
                  <div className="text-6xl font-bold text-green-600">OCP</div>
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold mb-4">
              OCP KnowledgeHub
            </h1>
            
            {/* Description */}
            <p className="text-lg text-green-50 mb-6">
              Votre assistant intelligent pour la gestion des connaissances opérationnelles
            </p>

            {/* Features */}
            <div className="space-y-4 text-left max-w-sm mx-auto">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-green-50">Recherche alimentée par l'IA dans toute la documentation OCP</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-green-50">Réponses instantanées aux questions opérationnelles</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-green-50">Accès sécurisé à la base de connaissances de l'entreprise</p>
              </div>
            </div>

            {/* Decorative Icon */}
            <div className="mt-8 pt-8 border-t border-green-400/30">
              <Bot className="w-16 h-16 mx-auto opacity-80" />
              <p className="mt-4 text-sm text-green-100">
                Propulsé par une technologie IA avancée
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center transition-colors">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
              Bon retour
            </h2>
            <p className="text-gray-600 dark:text-gray-400 transition-colors">
              Connectez-vous pour accéder à votre compte
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                Adresse e-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="votre.email@ocp.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Entrez votre mot de passe"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  disabled={isLoading}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300 transition-colors">
                  Se souvenir de moi
                </label>
              </div>

              <div className="text-sm">
                <a 
                  href="/forgot-password" 
                  className="font-medium text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 disabled:opacity-50 transition-colors"
                >
                  Mot de passe oublié ?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Connexion en cours...
                </div>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>


          {/* Quick Register Section */}
          <div className="mt-4">
            <button
              onClick={handleQuickRegister}
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Créer un nouveau compte
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
              Vous n'avez pas de compte ?{" "}
              <Link 
                href="/register" 
                className="font-medium text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 disabled:opacity-50 transition-colors"
              >
                S'inscrire
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
              © 2024 OCP Group. All rights reserved.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 transition-colors">
              Operational knowledge management system
            </p>
          </div>
        </div>


      </div>
    </div>
  );
};

export default LoginPage;
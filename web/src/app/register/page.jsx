"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useNotification } from "../components/NotificationProvider";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { showToast } = useNotification();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (error) setError("");
    if (success) setSuccess("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Le nom est requis");
      return false;
    }

    if (!formData.email.trim()) {
      setError("L'adresse e-mail est requise");
      return false;
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Veuillez entrer une adresse e-mail valide");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess("Compte créé avec succès ! En attente de l'activation par un administrateur.");
        showToast('Inscription réussie ! Votre compte sera activé par un administrateur.', 'success');
        
        // Clear form
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        // Redirect to login after delay
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError(data.error || 'Échec de l\'inscription. Veuillez réessayer.');
        showToast(data.error || 'Échec de l\'inscription', 'error');
      }
    } catch (err) {
      setError('Erreur réseau. Veuillez vérifier votre connexion et réessayer.');
      showToast('Erreur réseau', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoRegister = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: "Utilisateur Démo",
          email: `demo${Date.now()}@company.com`,
          password: "demo123",
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Note: Demo users also need admin activation
        showToast('Compte démo créé. En attente d\'activation.', 'info');
        setSuccess("Compte démo créé avec succès ! En attente de l'activation par un administrateur.");
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError(data.error || 'Échec de la création du compte démo');
      }
    } catch (err) {
      setError('Erreur réseau. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors">
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
              Rejoignez OCP
            </h1>
            
            {/* Description */}
            <p className="text-lg text-green-50 mb-6">
              Créez votre compte pour accéder à la plateforme de gestion des connaissances
            </p>

            {/* Features */}
            <div className="space-y-4 text-left max-w-sm mx-auto">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                <p className="text-green-50">Accès à la documentation complète OCP</p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                <p className="text-green-50">Assistant IA personnalisé</p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                <p className="text-green-50">Collaboration en équipe</p>
              </div>
            </div>

            {/* Note */}
            <div className="mt-8 pt-8 border-t border-green-400/30">
              <div className="bg-green-500/20 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-sm text-green-50">
                  <strong>Note :</strong> Votre compte sera activé par un administrateur après inscription.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center transition-colors">
          {/* Header */}
          <div className="mb-8">
            <Link href="/login" className="inline-flex items-center text-sm text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Retour à la connexion
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
              Créer un compte
            </h2>
            <p className="text-gray-600 dark:text-gray-400 transition-colors">
              Remplissez le formulaire pour rejoindre OCP KnowledgeHub
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                {success}
              </div>
            )}

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                Nom complet
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Entrez votre nom complet"
                  disabled={isLoading}
                />
              </div>
            </div>

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
                  placeholder="Au moins 6 caractères"
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

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Confirmez votre mot de passe"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  )}
                </button>
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
                  Création du compte...
                </div>
              ) : (
                "Créer un compte"
              )}
            </button>

            {/* Info Notice */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                <strong>Information :</strong> Votre compte sera soumis à l'approbation d'un administrateur avant activation.
              </p>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
              Vous avez déjà un compte ?{" "}
              <Link href="/login" className="font-medium text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 transition-colors">
                Se connecter
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
              © 2024 OCP Group. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

const PUBLIC_ROUTES = ['/login', '/register'];

export default function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateAuth = async () => {
      const token = Cookies.get('token');
      
      // Allow access to public routes without authentication
      if (PUBLIC_ROUTES.includes(pathname)) {
        setIsValidating(false);
        setIsAuthenticated(false);
        return;
      }

      // If no token, redirect to login
      if (!token) {
        router.push('/login');
        setIsValidating(false);
        setIsAuthenticated(false);
        return;
      }

      // Validate token with backend
      try {
        const res = await fetch('/api/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          credentials: 'same-origin'
        });

        if (res.ok) {
          const data = await res.json();
          if (data?.success) {
            // Token is valid
            setIsAuthenticated(true);
            setIsValidating(false);
            
            // Update user cookie if needed
            if (data.user) {
              Cookies.set('user', JSON.stringify(data.user), { expires: 7 });
            }
          } else {
            // Token invalid
            Cookies.remove('token');
            Cookies.remove('user');
            router.push('/login');
            setIsValidating(false);
            setIsAuthenticated(false);
          }
        } else {
          // Unauthorized - token expired or invalid
          Cookies.remove('token');
          Cookies.remove('user');
          router.push('/login');
          setIsValidating(false);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth validation error:', error);
        // On network error, still allow access but log the issue
        setIsAuthenticated(true);
        setIsValidating(false);
      }
    };

    validateAuth();
  }, [pathname, router]);

  // Show loading state while validating
  if (isValidating) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-slate-400">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

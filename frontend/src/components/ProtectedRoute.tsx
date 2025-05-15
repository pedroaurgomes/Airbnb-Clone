'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: 'guest' | 'host';
};

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, userRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // If not authenticated, redirect to login
        router.push('/login');
      } else if (requiredRole && userRole !== requiredRole) {
        // If role is required and user doesn't have it, redirect to home
        router.push('/');
      }
    }
  }, [isAuthenticated, isLoading, userRole, requiredRole, router]);

  // Show nothing while checking authentication
  if (isLoading) {
    return null;
  }

  // If not authenticated or wrong role, don't render children
  if (!isAuthenticated || (requiredRole && userRole !== requiredRole)) {
    return null;
  }

  // If authenticated and has correct role, render children
  return <>{children}</>;
}

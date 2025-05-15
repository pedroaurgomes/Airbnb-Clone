'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const { isAuthenticated, isLoading, userRole, logout } = useAuth();

  const getHomeLink = () => {
    if (!isAuthenticated || !userRole) return '/';
    return userRole === 'host' ? '/host' : '/';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href={getHomeLink()} className="text-[#FF5A5F] text-2xl font-bold">
              airbnb-clone
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            {!isLoading && (
              isAuthenticated ? (
                <>
                  {userRole === 'host' ? (
                    <Link href="/host" className="text-gray-700 hover:text-rose-500 font-medium">
                      My Properties
                    </Link>
                  ) : (
                    <Link href="/" className="text-gray-700 hover:text-rose-500 font-medium">
                      Browse
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="text-gray-700 hover:text-rose-500 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-rose-500 font-medium">
                    Log In
                  </Link>
                  <Link href="/signup" className="text-gray-700 hover:text-rose-500 font-medium">
                    Sign Up
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

'use client';

import { useState, useEffect } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only run this on the client side
    const storedToken = localStorage.getItem('token');
    setIsAuthenticated(!!storedToken);
    setIsLoading(false);
  }, []);

  function logout() {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  }

  return { isAuthenticated, isLoading, logout };
}
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: string | null;
  login: (token: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Validate token and set initial state
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('userRole');

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp && decoded.exp > currentTime) {
          setIsAuthenticated(true);
          setUserRole(storedRole);
        } else {
          // Token expired
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } catch (error) {
        console.error('Error validating token:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        setIsAuthenticated(false);
        setUserRole(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, role: string) => {
    try {
      if (!token || typeof token !== 'string') {
        throw new Error('Invalid token provided');
      }

      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp && decoded.exp > currentTime) {
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', role);
        setIsAuthenticated(true);
        setUserRole(role);
      } else {
        throw new Error('Token has expired');
      }
    } catch (error) {
      console.error('Error during login:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      setIsAuthenticated(false);
      setUserRole(null);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
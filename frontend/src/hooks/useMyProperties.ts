'use client';
import { apiGet } from '@/lib/api';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { jwtDecode } from 'jwt-decode';

type Property = {
    property_id: number;
    title: string;
    address: string;
    city: string;
    state: string;
    picture_urls: string[];
    host_name: string;
};

interface JWTPayload {
    sub: string;
    role: 'guest' | 'host';
    exp: number;
}

export function useMyProperties() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const { isAuthenticated, userRole } = useAuth();
    const mountedRef = useRef(true);
    const fetchTimeoutRef = useRef<NodeJS.Timeout>();
    const lastFetchRef = useRef<number>(0);
    const propertiesRef = useRef<Property[]>([]);
  
    useEffect(() => {
      mountedRef.current = true;
      
      return () => {
        mountedRef.current = false;
        if (fetchTimeoutRef.current) {
          clearTimeout(fetchTimeoutRef.current);
        }
      };
    }, []);

    useEffect(() => {
      if (!isAuthenticated || userRole !== 'host') {
        setProperties([]);
        propertiesRef.current = [];
        setLoading(false);
        return;
      }

      const validateToken = (token: string): boolean => {
        try {
          const decoded = jwtDecode<JWTPayload>(token);
          const currentTime = Math.floor(Date.now() / 1000);
          return decoded.exp > currentTime;
        } catch {
          return false;
        }
      };

      async function fetchMyProperties() {
        try {
          const token = localStorage.getItem('token');
          if (!token || !validateToken(token)) {
            throw new Error('Not authenticated');
          }

          // Prevent multiple fetches within 2 seconds
          const now = Date.now();
          if (now - lastFetchRef.current < 2000) {
            return;
          }
          lastFetchRef.current = now;

          console.log('Fetching host properties...');
          const data = await apiGet<Property[]>('/v1/properties/mine', token);
          console.log('Received host properties:', data);
          
          if (mountedRef.current) {
            // Deduplicate properties by property_id
            const uniqueProperties = Array.from(
              new Map(data.map(property => [property.property_id, property])).values()
            );
            
            // Only update if the properties have actually changed
            if (JSON.stringify(uniqueProperties) !== JSON.stringify(propertiesRef.current)) {
              propertiesRef.current = uniqueProperties;
              setProperties(uniqueProperties);
            }
          }
        } catch (err) {
          console.error('Error fetching host properties:', err);
          if (mountedRef.current) {
            setError(err as Error);
          }
        } finally {
          if (mountedRef.current) {
            setLoading(false);
          }
        }
      }

      // Clear any existing timeout
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }

      // Add a small delay to prevent multiple rapid fetches
      fetchTimeoutRef.current = setTimeout(fetchMyProperties, 500);

    }, [isAuthenticated, userRole]);
  
    return { properties, loading, error };
} 
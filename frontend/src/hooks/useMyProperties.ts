'use client';
import { apiGet } from '@/lib/api';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

type Property = {
    property_id: number;
    title: string;
    address: string;
    city: string;
    state: string;
    picture_urls: string[];
    host_name: string;
};

export function useMyProperties() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const { isAuthenticated } = useAuth();
  
    useEffect(() => {
      async function fetchMyProperties() {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('Not authenticated');
          }

          console.log('Fetching host properties...');
          const data = await apiGet<Property[]>('/v1/properties/mine', token);
          console.log('Received host properties:', data);
          setProperties(data);
        } catch (err) {
          console.error('Error fetching host properties:', err);
          setError(err as Error);
        } finally {
          setLoading(false);
        }
      }

      if (isAuthenticated) {
        fetchMyProperties();
      } else {
        setLoading(false);
        setError(new Error('Not authenticated'));
      }
    }, [isAuthenticated]);
  
    return { properties, loading, error };
} 
'use client';
import { apiGet } from '@/lib/api';
import { useState, useEffect } from 'react';

type Property = {
    property_id: number;
    title: string;
    address: string;
    city: string;
    state: string;
    picture_urls: string[];
    host_name: string;
  };

export function useProperties() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
  
    useEffect(() => {
      async function fetchProperties() {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('Not authenticated');
          }
          const data = await apiGet<Property[]>('/v1/properties', token);
          setProperties(data);
        } catch (err) {
          setError(err as Error);
        } finally {
          setLoading(false);
        }
      }
      fetchProperties();
    }, []);
  
    return { properties, loading, error };
  }
  
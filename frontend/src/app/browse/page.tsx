'use client';

import { useProperties } from '@/hooks/useProperties';
import PropertyCard from '@/components/PropertyCard';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function BrowsePage() {
  const { properties, loading, error } = useProperties();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (loading) {
    return <p className="text-center text-gray-600 mt-8">Loading properties...</p>;
  }

  if (error) {
    return <p className="text-center text-rose-500 mt-8">Error loading properties: {error.message}</p>;
  }

  if (properties.length === 0) {
    return <p className="text-center text-gray-600 mt-8">No properties found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse Properties</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.property_id}
              id={property.property_id}
              title={property.title}
              address={property.address}
              city={property.city}
              state={property.state}
              picture_urls={property.picture_urls}
              host_name={property.host_name}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 
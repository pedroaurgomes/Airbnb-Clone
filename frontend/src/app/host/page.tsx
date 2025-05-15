'use client';

import { useMyProperties } from '@/hooks/useMyProperties';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';
import { apiDelete } from '@/lib/api';

export default function HostDashboard() {
  const { properties, loading, error, refetch } = useMyProperties();
  const { userRole, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated or not a host
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (userRole !== 'host') {
      router.push('/');
    }
  }, [isAuthenticated, userRole, router]);

  const handleDelete = async (propertyId: number) => {
    if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      await apiDelete(`/v1/properties/${propertyId}`, token);
      // Refresh the properties list without reloading the page
      await refetch();
    } catch (err: any) {
      alert(err.message || 'Failed to delete property');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <p className="text-center text-gray-600">Loading your properties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <p className="text-center text-rose-500">Error loading properties: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
          <Link 
            href="/host/add" 
            className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition"
          >
            Add New Property
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No properties yet</h2>
            <p className="text-gray-600 mb-4">Start by adding your first property!</p>
            <Link 
              href="/host/add" 
              className="inline-block bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition"
            >
              Add Your First Property
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div 
                key={property.property_id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
              >
                <Link href={`/properties/${property.property_id}`}>
                  {property.picture_urls && property.picture_urls.length > 0 && (
                    <div className="relative h-48 w-full">
                      <img
                        src={property.picture_urls[0]}
                        alt={property.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{property.title}</h2>
                    <p className="text-gray-600 mb-1">{property.address}</p>
                    <p className="text-gray-600 mb-1">{property.city}, {property.state}</p>
                  </div>
                </Link>
                <div className="px-6 pb-4">
                  <button
                    onClick={() => handleDelete(property.property_id)}
                    className="text-sm text-rose-500 hover:text-rose-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
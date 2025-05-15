'use client';

import { useProperties } from '@/hooks/useProperties';
import PropertyCard from '@/components/PropertyCard';

export default function GuestDashboard() {
  const { properties, loading, error } = useProperties();

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.property_id}
          title={property.title}
          address={property.address}
          city={property.city}
          state={property.state}
          picture_urls={property.picture_urls}
          host_name={property.host_name}
        />
      ))}
    </div>
  );
}

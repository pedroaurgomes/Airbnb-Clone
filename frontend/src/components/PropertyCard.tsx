'use client';

import Link from 'next/link';

type PropertyCardProps = {
    id: number;
    title: string;
    address: string;
    city: string;
    state: string;
    picture_urls: string[];
    host_name: string;
    // Add other property fields as needed
  };

export default function PropertyCard({ id, title, address, city, state, host_name}: PropertyCardProps) {
  return (
    <Link href={`/properties/${id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg p-4 transition">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <p className="text-gray-600">{address}</p>
        <p className="text-gray-600">{city}</p>
        <p className="text-gray-600">{state}</p>
        <p className="text-rose-500 font-semibold">${host_name}</p>
      </div>
    </Link>
  );
}

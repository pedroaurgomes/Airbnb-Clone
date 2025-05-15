'use client';

import Link from 'next/link';
import Image from 'next/image';

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

export default function PropertyCard({ id, title, address, city, state, picture_urls, host_name }: PropertyCardProps) {
  return (
    <Link href={`/properties/${id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
        {picture_urls && picture_urls.length > 0 && (
          <div className="relative h-48 w-full">
            <img
              src={picture_urls[0]}
              alt={title}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <div className="p-4">
          <h2 className="text-lg font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600 mb-1">{address}</p>
          <p className="text-gray-600 mb-1">{city}, {state}</p>
          <p className="text-gray-600">Hosted by {host_name}</p>
        </div>
      </div>
    </Link>
  );
}

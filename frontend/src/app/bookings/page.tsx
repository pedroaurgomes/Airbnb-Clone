'use client';

import { useMyBookings } from '@/hooks/useMyBookings';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function MyBookingsPage() {
  const { bookings, loading, error } = useMyBookings();
  const { userRole, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated or not a guest
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (userRole !== 'guest') {
      router.push('/');
    }
  }, [isAuthenticated, userRole, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <p className="text-center text-gray-600">Loading your bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <p className="text-center text-rose-500">Error loading bookings: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h2>
            <p className="text-gray-600 mb-4">Start exploring properties to make your first booking!</p>
            <Link 
              href="/browse" 
              className="inline-block bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <Link 
                key={booking.booking_id}
                href={`/properties/${booking.property.property_id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
              >
                {booking.property.picture_urls && booking.property.picture_urls.length > 0 && (
                  <div className="relative h-48 w-full">
                    <img
                      src={booking.property.picture_urls[0]}
                      alt={booking.property.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{booking.property.title}</h2>
                  <p className="text-gray-600 mb-1">{booking.property.city}, {booking.property.state}</p>
                  <p className="text-gray-600 mb-2">Hosted by {booking.property.host_name}</p>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      Check-in: {new Date(booking.date_in).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Check-out: {new Date(booking.date_out).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
import { useState, useEffect } from 'react';
import { apiGet } from '@/lib/api';

type BookingWithProperty = {
  booking_id: number;
  date_in: string;
  date_out: string;
  property: {
    property_id: number;
    title: string;
    city: string;
    state: string;
    picture_urls: string[];
    host_name: string;
  };
};

export function useMyBookings() {
  const [bookings, setBookings] = useState<BookingWithProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const data = await apiGet<BookingWithProperty[]>('/v1/bookings/my-bookings', token);
      setBookings(data);
      setError(null);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return { bookings, loading, error, refetch: fetchBookings };
} 
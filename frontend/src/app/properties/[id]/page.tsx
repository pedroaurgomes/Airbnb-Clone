'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiGet, apiPost, apiDelete } from '@/lib/api';
import Image from 'next/image';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

type Property = {
  property_id: number;
  title: string;
  address: string;
  city: string;
  state: string;
  picture_urls: string[];
  host_name: string;
};

type Booking = {
  booking_id: number;
  date_in: string;
  date_out: string;
};

const MIN_STAY_NIGHTS = 1;
const MAX_STAY_NIGHTS = 30;

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, userRole } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [dateIn, setDateIn] = useState('');
  const [dateOut, setDateOut] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    async function fetchPropertyAndBookings() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Not authenticated');
        }

        const propertyId = parseInt(params.id as string, 10);
        if (isNaN(propertyId)) {
          throw new Error('Invalid property ID');
        }

        // Fetch property details
        const propertyData = await apiGet<Property>(`/v1/properties/${propertyId}`, token);
        setProperty(propertyData);

        // Fetch existing bookings for this property
        const bookingsData = await apiGet<Booking[]>(`/v1/properties/${propertyId}/bookings`, token);
        setBookings(bookingsData);
      } catch (err: any) {
        setError(err.message || 'Failed to load property details');
      } finally {
        setLoading(false);
      }
    }

    fetchPropertyAndBookings();
  }, [params.id, isAuthenticated, router]);

  const isDateBooked = (date: string): boolean => {
    const checkDate = new Date(date);
    return bookings.some(booking => {
      const bookingStart = new Date(booking.date_in);
      const bookingEnd = new Date(booking.date_out);
      return checkDate >= bookingStart && checkDate < bookingEnd;
    });
  };

  const validateDates = (checkIn: string, checkOut: string): string | null => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate < today) {
      return 'Check-in date cannot be in the past';
    }

    if (checkInDate >= checkOutDate) {
      return 'Check-out date must be after check-in date';
    }

    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    if (nights < MIN_STAY_NIGHTS) {
      return `Minimum stay is ${MIN_STAY_NIGHTS} night${MIN_STAY_NIGHTS > 1 ? 's' : ''}`;
    }
    if (nights > MAX_STAY_NIGHTS) {
      return `Maximum stay is ${MAX_STAY_NIGHTS} nights`;
    }

    // Check if any dates in the range are already booked
    const currentDate = new Date(checkInDate);
    while (currentDate < checkOutDate) {
      if (isDateBooked(currentDate.toISOString().split('T')[0])) {
        return 'Selected dates overlap with existing bookings';
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return null;
  };

  const handleDateChange = (type: 'in' | 'out', value: string) => {
    if (type === 'in') {
      setDateIn(value);
      // If check-out date is before new check-in date, update it
      if (dateOut && value >= dateOut) {
        const newDateOut = new Date(value);
        newDateOut.setDate(newDateOut.getDate() + MIN_STAY_NIGHTS);
        setDateOut(newDateOut.toISOString().split('T')[0]);
      }
    } else {
      setDateOut(value);
    }
    setError(null);
  };

  const getBookedDates = () => {
    const bookedDates: Date[] = [];
    bookings.forEach(booking => {
      const start = new Date(booking.date_in);
      const end = new Date(booking.date_out);
      const current = new Date(start);
      
      while (current < end) {
        bookedDates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    });
    return bookedDates;
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateIn || !dateOut) {
      setError('Please select both check-in and check-out dates');
      return;
    }

    const validationError = validateDates(dateIn, dateOut);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setBookingLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const propertyId = parseInt(params.id as string, 10);
      if (isNaN(propertyId)) {
        throw new Error('Invalid property ID');
      }

      const bookingData = {
        property_id: propertyId,
        date_in: dateIn,
        date_out: dateOut,
      };

      await apiPost('/v1/bookings', bookingData, token);
      setBookingSuccess(true);
      
      // Refresh bookings after successful booking
      const bookingsData = await apiGet<Booking[]>(`/v1/properties/${propertyId}/bookings`, token);
      setBookings(bookingsData);
      
      setTimeout(() => {
        router.push('/bookings');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const propertyId = parseInt(params.id as string, 10);
      if (isNaN(propertyId)) {
        throw new Error('Invalid property ID');
      }

      await apiDelete(`/v1/properties/${propertyId}`, token);
      router.push('/host');
    } catch (err: any) {
      setError(err.message || 'Failed to delete property');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <p className="text-center text-gray-600">Loading property details...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <p className="text-center text-rose-500">{error || 'Property not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Image Gallery */}
        <div className="mb-8">
          <div className="relative h-[400px] w-full mb-4">
            <img
              src={property.picture_urls[selectedImage]}
              alt={property.title}
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
          {property.picture_urls.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {property.picture_urls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-24 rounded-lg overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-rose-500' : ''
                  }`}
                >
                  <img
                    src={url}
                    alt={`${property.title} - Image ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
              {userRole === 'host' && (
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-600 transition disabled:opacity-50"
                >
                  {deleteLoading ? 'Deleting...' : 'Delete Property'}
                </button>
              )}
            </div>
            <p className="text-gray-600 mb-2">{property.address}</p>
            <p className="text-gray-600 mb-4">{property.city}, {property.state}</p>
            <p className="text-gray-600">Hosted by {property.host_name}</p>
          </div>

          {/* Booking Form - Only show for guests */}
          {userRole === 'guest' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Book this property</h2>
              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label htmlFor="dateIn" className="block text-sm font-medium text-gray-700 mb-1">
                    Check-in Date
                  </label>
                  <DatePicker
                    selected={dateIn ? new Date(dateIn) : null}
                    onChange={(date: Date | null) => date && handleDateChange('in', date.toISOString().split('T')[0])}
                    minDate={new Date()}
                    excludeDates={getBookedDates()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholderText="Select check-in date"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="dateOut" className="block text-sm font-medium text-gray-700 mb-1">
                    Check-out Date
                  </label>
                  <DatePicker
                    selected={dateOut ? new Date(dateOut) : null}
                    onChange={(date: Date | null) => date && handleDateChange('out', date.toISOString().split('T')[0])}
                    minDate={dateIn ? new Date(dateIn) : new Date()}
                    excludeDates={getBookedDates()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholderText="Select check-out date"
                    required
                  />
                </div>
                {dateIn && dateOut && (
                  <p className="text-sm text-gray-600">
                    {Math.ceil((new Date(dateOut).getTime() - new Date(dateIn).getTime()) / (1000 * 60 * 60 * 24))} nights
                  </p>
                )}
                {error && (
                  <p className="text-rose-500 text-sm">{error}</p>
                )}
                {bookingSuccess && (
                  <p className="text-green-500 text-sm">Booking successful! Redirecting to your bookings...</p>
                )}
                <button
                  type="submit"
                  disabled={bookingLoading || bookingSuccess}
                  className="w-full bg-rose-500 text-white py-2 px-4 rounded-md hover:bg-rose-600 transition disabled:opacity-50"
                >
                  {bookingLoading ? 'Booking...' : bookingSuccess ? 'Booked!' : 'Book Now'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
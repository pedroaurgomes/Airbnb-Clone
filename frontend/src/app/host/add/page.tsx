'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import InputField from '@/components/InputField';
import Button from '@/components/Button';
import { apiPost } from '@/lib/api';
import ImageUpload from '@/components/ImageUpload';

type PropertyFormData = {
  title: string;
  address: string;
  city: string;
  state: string;
  picture_urls: string[];
};

export default function AddPropertyPage() {
  const router = useRouter();
  const { isAuthenticated, userRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    address: '',
    city: '',
    state: '',
    picture_urls: [],
  });

  // Redirect if not authenticated or not a host
  if (!isAuthenticated || userRole !== 'host') {
    router.push('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      // Validate form data
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.address.trim()) {
        throw new Error('Address is required');
      }
      if (!formData.city.trim()) {
        throw new Error('City is required');
      }
      if (!formData.state.trim()) {
        throw new Error('State is required');
      }
      if (formData.picture_urls.length === 0) {
        throw new Error('At least one image is required');
      }

      // Send data to API
      const dataToSend = {
        title: formData.title.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        picture_urls: formData.picture_urls
      };

      console.log('Sending data to API:', dataToSend);

      const response = await apiPost('/v1/properties', dataToSend, token);
      console.log('API Response:', response);
      
      router.push('/host');
    } catch (err: any) {
      console.error('Error creating property:', err);
      // If the error is a validation error from the API, show it directly
      if (err.message && err.message !== '[object Object]') {
        setError(err.message);
      } else {
        setError('Failed to create property. Please check all fields and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImagesUploaded = (urls: string[]) => {
    console.log('Received uploaded URLs:', urls);
    setFormData(prev => ({
      ...prev,
      picture_urls: [...prev.picture_urls, ...urls]
    }));
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Property</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleInputChange}
            required
          />

          <InputField
            label="Address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleInputChange}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="City"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleInputChange}
              required
            />

            <InputField
              label="State"
              name="state"
              type="text"
              value={formData.state}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Images
            </label>
            <ImageUpload onImagesUploaded={handleImagesUploaded} />
            {formData.picture_urls.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  {formData.picture_urls.length} image(s) uploaded
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {formData.picture_urls.map((url, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={url}
                        alt={`Property image ${index + 1}`}
                        className="object-cover w-full h-full rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Button
              label="Cancel"
              onClick={() => router.push('/host')}
            />
            <Button
              label={loading ? 'Creating...' : 'Create Property'}
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
} 
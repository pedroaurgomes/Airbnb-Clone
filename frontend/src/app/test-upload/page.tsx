'use client';

import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';

export default function TestUploadPage() {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const handleImagesUploaded = (urls: string[]) => {
    setUploadedUrls(prev => [...prev, ...urls]);
    console.log('Uploaded URLs:', urls);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Image Upload</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <ImageUpload onImagesUploaded={handleImagesUploaded} />
          
          {uploadedUrls.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Uploaded Images:</h2>
              <div className="grid grid-cols-2 gap-4">
                {uploadedUrls.map((url, index) => (
                  <div key={index} className="space-y-2">
                    <img
                      src={url}
                      alt={`Test upload ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <p className="text-sm text-gray-600 break-all">{url}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
'use client';

import React, { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import PlantInfo from './components/PlantInfo';

interface PlantData {
  name: string;
  description: string;
  careInstructions: string;
}

export default function Home() {
  const [plantInfo, setPlantInfo] = useState<PlantData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = async (file: File, previewUrl: string) => {
    setLoading(true);
    setError(null);
    setImagePreview(previewUrl);
    setPlantInfo(null); // Reset plant info when a new image is uploaded

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/identify', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to identify plant');
      }

      const data: PlantData = await response.json();
      setPlantInfo(data);
    } catch (err) {
      setError('An error occurred while identifying the plant. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Plant Identifier</h1>
      <ImageUpload onImageUpload={handleImageUpload} />
      {loading && <p className="text-center mt-4">Identifying plant...</p>}
      {error && <p className="text-center mt-4 text-red-500">{error}</p>}
      {plantInfo && imagePreview && (
        <PlantInfo
          name={plantInfo.name}
          description={plantInfo.description}
          careInstructions={plantInfo.careInstructions}
          imageUrl={imagePreview}
        />
      )}
    </div>
  );
}
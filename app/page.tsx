'use client';

import React, { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import PlantInfo from './components/PlantInfo';

export default function Home() {
  const [plantInfo, setPlantInfo] = useState<{ name: string; description: string; careInstructions: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    setLoading(true);
    setError(null);

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

      const data = await response.json();
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
      {plantInfo && <PlantInfo {...plantInfo} />}
    </div>
  );
}
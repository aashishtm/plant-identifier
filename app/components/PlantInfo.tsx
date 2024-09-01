import React from 'react';
import Image from 'next/image';

interface PlantInfoProps {
  name: string;
  description: string;
  careInstructions: string;
  imageUrl: string;
}

const PlantInfo: React.FC<PlantInfoProps> = ({ name, description, careInstructions, imageUrl }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">{name}</h2>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          <div className="relative w-full h-64 mb-4">
            <Image
              src={imageUrl}
              alt={name}
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{description}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Care Instructions</h3>
            <p className="text-gray-700">{careInstructions}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantInfo;
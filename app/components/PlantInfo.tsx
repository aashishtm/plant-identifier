import React from 'react';

interface PlantInfoProps {
  name: string;
  description: string;
  careInstructions: string;
}

const PlantInfo: React.FC<PlantInfoProps> = ({ name, description, careInstructions }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4">{name}</h2>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Description</h3>
        <p className="text-gray-700">{description}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Care Instructions</h3>
        <p className="text-gray-700">{careInstructions}</p>
      </div>
    </div>
  );
};

export default PlantInfo;
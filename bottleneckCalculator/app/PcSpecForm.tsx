'use client';

import { useState } from 'react';
import apiCall from './api/apiCall';

const PcSpecForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const presetConfigs = [
    { cpu: "Intel i5-12400F", gpu: "NVIDIA RTX 3060", ram: "DDR5 5000MHz" },
    { cpu: "Intel i7-13700K", gpu: "NVIDIA RTX 4070", ram: "DDR5 4800MHz" },
    { cpu: "Intel i9-13900K", gpu: "NVIDIA RTX 4090", ram: "DDR4 3200 MHz" }
  ];

  const onSubmit = async (specs: typeof presetConfigs[0]) => {
    setIsLoading(true);
    setError(null);
    try {
      const formattedData = `CPU ${specs.cpu} with GPU ${specs.gpu} with RAM ${specs.ram}`;
      const response = await apiCall.post(formattedData);
      console.log('Prediction:', response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error getting prediction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-8">
      {presetConfigs.map((config, index) => (
        <button
          key={index}
          onClick={() => onSubmit(config)}
          disabled={isLoading}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
        >
          {`${config.cpu} | ${config.gpu} | ${config.ram}`}
        </button>
      ))}
      {error && <div className="text-red-500 mt-4">{error}</div>}
      {isLoading && <div className="mt-4">Loading...</div>}
    </div>
  );
};

export default PcSpecForm;

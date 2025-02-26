'use client';

import { useState, useEffect } from 'react';
import apiCall from '../apiCall';

interface ComponentsData {
  cpu: string[];
  gpu: string[];
}

interface ComponentSelectorProps {
  onComponentSelect?: (selectedComponents: {cpu: string, gpu: string}) => void;
}

const ComponentSelector: React.FC<ComponentSelectorProps> = ({ onComponentSelect }) => {
  const [components, setComponents] = useState<ComponentsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCpu, setSelectedCpu] = useState<string>('');
  const [selectedGpu, setSelectedGpu] = useState<string>('');

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        setLoading(true);
        const data = await apiCall.getComponents();
        setComponents(data);
        
        // Set default selections
        if (data.cpu.length > 0) setSelectedCpu(data.cpu[0]);
        if (data.gpu.length > 0) setSelectedGpu(data.gpu[0]);
        
      } catch (err) {
        setError('Failed to load components. Please try again later.');
        console.error('Error fetching components:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComponents();
  }, []);

  useEffect(() => {
    if (selectedCpu && selectedGpu && onComponentSelect) {
      onComponentSelect({ cpu: selectedCpu, gpu: selectedGpu });
    }
  }, [selectedCpu, selectedGpu, onComponentSelect]);

  if (loading) return <div className="text-center py-4">Loading components...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;
  if (!components) return null;

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
      <div className="w-full md:w-1/2">
        <label htmlFor="cpu-select" className="block text-sm font-medium text-gray-700 mb-1">
          Select CPU
        </label>
        <select
          id="cpu-select"
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          value={selectedCpu}
          onChange={(e) => setSelectedCpu(e.target.value)}
        >
          {components.cpu.map((cpu) => (
            <option key={cpu} value={cpu}>{cpu}</option>
          ))}
        </select>
      </div>

      <div className="w-full md:w-1/2">
        <label htmlFor="gpu-select" className="block text-sm font-medium text-gray-700 mb-1">
          Select GPU
        </label>
        <select
          id="gpu-select"
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          value={selectedGpu}
          onChange={(e) => setSelectedGpu(e.target.value)}
        >
          {components.gpu.map((gpu) => (
            <option key={gpu} value={gpu}>{gpu}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ComponentSelector;

"use client"

import { useState, useEffect, useRef } from "react"
import apiCall, { GpuCategory } from "../api/apiCall"
import { useTheme } from "next-themes"

interface GpuMenuProps {
  selectedGpu: string;
  setSelectedGpu: (gpu: string) => void;
}

export function GpuMenu({ selectedGpu, setSelectedGpu }: GpuMenuProps) {
  const [gpuCategories, setGpuCategories] = useState<GpuCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Theme-aware styling
  const isDarkTheme = mounted && resolvedTheme === 'dark'
  
  useEffect(() => {
    fetchGpuData()
    // Mount component for theme detection
    setMounted(true)
  }, [])
  
  // Focus search input when menu opens
  useEffect(() => {
    if (isMenuOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [isMenuOpen])

  const fetchGpuData = async () => {
    try {
      setIsLoading(true)
      const categories = await apiCall.getGpuCategories()
      console.log("Received GPU categories:", categories)
      setGpuCategories(categories)
    } catch (err) {
      console.error("Error fetching GPU data:", err)
      setError("Failed to load GPU data.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGpuSelect = (gpuName: string) => {
    console.log("Selected GPU:", gpuName)
    setSelectedGpu(gpuName)
    setSearchTerm("")
    setIsMenuOpen(false)
  }
  
  // Filter GPU models based on search term
  const filteredCategories = gpuCategories
    .map(category => ({
      ...category,
      models: category.models.filter(model => 
        model.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }))
    .filter(category => category.models.length > 0);
    
  const totalGpuCount = filteredCategories.reduce(
    (sum, category) => sum + category.models.length, 
    0
  );

  // Loading/error states
  if (isLoading) return <div className="p-2">Loading GPUs...</div>
  if (error) return <div className="text-red-500 p-2">{error}</div>
  if (gpuCategories.length === 0) {
    return <div className="w-full p-2"><div className="text-yellow-600">No GPU data available</div></div>
  }

  return (
    <div className="w-full">
      <label htmlFor="gpu-menu-trigger" className="block text-sm font-medium mb-1">
        Select GPU
      </label>
      
      {/* Custom Menu implementation */}
      <div className="relative">
        {/* Custom trigger that becomes a search input */}
        <button 
          id="gpu-menu-trigger"
          onClick={() => setIsMenuOpen(true)}
          className={`w-full p-2 border ${selectedGpu ? 'border-blue-300' : 'border-gray-300'} rounded-md ${isDarkTheme ? 'bg-gray-800 text-white' : 'bg-white text-left'} flex justify-between items-center`}
          type="button"
        >
          {isMenuOpen ? (
            <input
              ref={searchInputRef}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.key === 'Escape' && setIsMenuOpen(false)}
              className={`w-full border-none outline-none bg-transparent p-0 m-0 focus:ring-0 ${isDarkTheme ? 'text-white placeholder-gray-400' : 'text-black placeholder-gray-500'}`}
              placeholder="Search GPUs..."
              autoFocus
            />
          ) : (
            <span className={`truncate ${selectedGpu ? (isDarkTheme ? 'text-white' : 'text-black') : (isDarkTheme ? 'text-gray-400' : 'text-gray-500')}`}>
              {selectedGpu || "Select your GPU"}
            </span>
          )}
          <svg 
            className={`h-4 w-4 ml-2 transition-transform ${isMenuOpen ? 'rotate-180' : ''} ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Menu dropdown */}
        {isMenuOpen && (
          <div className={`absolute left-0 right-0 mt-1 py-1 ${isDarkTheme ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-300'} rounded-md shadow-lg max-h-80 overflow-auto z-50`}>
            {/* Search results count */}
            <div className={`px-2 py-1 text-xs ${isDarkTheme ? 'text-gray-400 border-b border-gray-700' : 'text-gray-500 border-b'}`}>
              {totalGpuCount} GPUs found
            </div>
            
            {filteredCategories.length === 0 ? (
              <div className={`p-3 text-center ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>No GPUs match your search</div>
            ) : (
              filteredCategories.map(category => (
                <div key={category.id}>
                  <div className={`px-3 py-1 text-xs font-semibold ${isDarkTheme ? 'text-gray-400 bg-gray-900' : 'text-gray-500 bg-gray-50'}`}>
                    {category.name}
                  </div>
                  {category.models.map(gpu => (
                    <button
                      key={gpu.id}
                      className={`w-full text-left px-3 py-2 text-sm ${selectedGpu === gpu.name 
                        ? (isDarkTheme ? 'bg-blue-900' : 'bg-blue-50') 
                        : (isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-blue-50')} focus:outline-none ${isDarkTheme ? 'focus:bg-gray-700' : 'focus:bg-blue-50'}`}
                      onClick={() => handleGpuSelect(gpu.name)}
                    >
                      {gpu.name}
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        )}
      </div>
      
      {/* Click outside handler */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  )
}

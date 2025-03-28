"use client"
import { useState, useEffect, useRef } from "react"
import { getCpuCategories } from "../api/serverActions"
import { CpuCategory } from "../api/types"
import { useTheme } from "next-themes"

interface CpuMenuProps {
  selectedCpu: string;
  setSelectedCpu: (cpu: string) => void;
}

export function CpuMenu({ selectedCpu, setSelectedCpu }: CpuMenuProps) {
  const [cpuCategories, setCpuCategories] = useState<CpuCategory[]>([])
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
    fetchCpuData()
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

  const fetchCpuData = async () => {
    try {
      setIsLoading(true)
      console.log("Fetching CPU data...")
      const categories = await getCpuCategories()
      console.log("Received CPU categories:", categories)
      
      if (!categories || categories.length === 0) {
        console.warn("No CPU categories returned from API")
        setError("No CPU data received from server. Check the console for details.")
      }
      
      setCpuCategories(categories || [])
    } catch (err) {
      console.error("Error fetching CPU data:", err)
      setError("Failed to load CPU data. Check the console for details.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCpuSelect = (cpuName: string) => {
    console.log("Selected CPU:", cpuName)
    setSelectedCpu(cpuName)
    setSearchTerm("")
    setIsMenuOpen(false)
  }
  
  // Filter CPU models based on search term
  const filteredCategories = cpuCategories
    .map(category => ({
      ...category,
      models: category.models.filter(model => 
        model.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }))
    .filter(category => category.models.length > 0);
    
  const totalCpuCount = filteredCategories.reduce(
    (sum, category) => sum + category.models.length, 
    0
  );

  // Loading/error states with retry button
  if (isLoading) return <div className="p-2">Loading CPUs...</div>
  
  if (error) {
    return (
      <div className="p-2">
        <div className="text-red-500 mb-2">{error}</div>
        <button 
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => fetchCpuData()}
        >
          Retry
        </button>
      </div>
    )
  }
  
  if (cpuCategories.length === 0) {
    return (
      <div className="w-full p-2">
        <div className="text-yellow-600 mb-2">No CPU data available</div>
        <button 
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => fetchCpuData()}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="w-full">
      <label htmlFor="cpu-menu-trigger" className="block text-sm font-medium mb-1">
        Select CPU
      </label>
      
      {/* Custom Menu implementation */}
      <div className="relative">
        {/* Custom trigger that becomes a search input */}
        <button 
          id="cpu-menu-trigger"
          onClick={() => setIsMenuOpen(true)}
          className={`w-full p-2 border ${selectedCpu ? 'border-blue-300' : 'border-gray-300'} rounded-md ${isDarkTheme ? 'bg-gray-800 text-white' : 'bg-white text-left'} flex justify-between items-center`}
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
              placeholder="Search CPUs..."
              autoFocus
            />
          ) : (
            <span className={`truncate ${selectedCpu ? (isDarkTheme ? 'text-white' : 'text-black') : (isDarkTheme ? 'text-gray-400' : 'text-gray-500')}`}>
              {selectedCpu || "Select your CPU"}
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
              {totalCpuCount} CPUs found
            </div>
            
            {filteredCategories.length === 0 ? (
              <div className={`p-3 text-center ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>No CPUs match your search</div>
            ) : (
              filteredCategories.map(category => (
                <div key={category.id}>
                  <div className={`px-3 py-1 text-xs font-semibold ${isDarkTheme ? 'text-gray-400 bg-gray-900' : 'text-gray-500 bg-gray-50'}`}>
                    {category.name}
                  </div>
                  {category.models.map(cpu => (
                    <button
                      key={cpu.id}
                      className={`w-full text-left px-3 py-2 text-sm ${selectedCpu === cpu.name 
                        ? (isDarkTheme ? 'bg-blue-900' : 'bg-blue-50') 
                        : (isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-blue-50')} focus:outline-none ${isDarkTheme ? 'focus:bg-gray-700' : 'focus:bg-blue-50'}`}
                      onClick={() => handleCpuSelect(cpu.name)}
                    >
                      {cpu.name}
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

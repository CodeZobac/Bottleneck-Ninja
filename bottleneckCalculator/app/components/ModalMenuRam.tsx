"use client"
import { useState, useEffect, useRef } from "react"
import { getRamCategories } from "../api/serverActions"
import { RamCategory } from "../api/types"
import { useTheme } from "next-themes"

interface RamMenuProps {
  selectedRam: string;
  setSelectedRam: (ram: string) => void;
}

export function RamMenu({ selectedRam, setSelectedRam }: RamMenuProps) {
  const [ramCategories, setRamCategories] = useState<RamCategory[]>([])
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
    fetchRamData()
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

  const fetchRamData = async () => {
    try {
      setIsLoading(true)
      console.log("Fetching RAM data...")
      const categories = await getRamCategories()
      console.log("Received RAM categories:", categories)
      
      if (!categories || categories.length === 0) {
        console.warn("No RAM categories returned from API")
        setError("No RAM data received from server. Check the console for details.")
      }
      
      setRamCategories(categories || [])
    } catch (err) {
      console.error("Error fetching RAM data:", err)
      setError("Failed to load RAM data. Check the console for details.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRamSelect = (ramName: string) => {
    console.log("Selected RAM:", ramName)
    setSelectedRam(ramName)
    setSearchTerm("")
    setIsMenuOpen(false)
  }
  
  // Filter RAM models based on search term
  const filteredCategories = ramCategories
    .map(category => ({
      ...category,
      models: category.models.filter(model => 
        model.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }))
    .filter(category => category.models.length > 0);
    
  const totalRamCount = filteredCategories.reduce(
    (sum, category) => sum + category.models.length, 
    0
  );

  // Loading/error states with retry button
  if (isLoading) return <div className="p-2">Loading RAM...</div>
  
  if (error) {
    return (
      <div className="p-2">
        <div className="text-red-500 mb-2">{error}</div>
        <button 
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => fetchRamData()}
        >
          Retry
        </button>
      </div>
    )
  }
  
  if (ramCategories.length === 0) {
    return (
      <div className="w-full p-2">
        <div className="text-yellow-600 mb-2">No RAM data available</div>
        <button 
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => fetchRamData()}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="w-full">
      <label htmlFor="ram-menu-trigger" className="block text-sm font-medium mb-1">
        Select RAM
      </label>
      
      {/* Custom Menu implementation */}
      <div className="relative">
        {/* Custom trigger that becomes a search input */}
        <button 
          id="ram-menu-trigger"
          onClick={() => setIsMenuOpen(true)}
          className={`w-full p-2 border ${selectedRam ? 'border-blue-300' : 'border-gray-300'} rounded-md ${isDarkTheme ? 'bg-gray-800 text-white' : 'bg-white text-left'} flex justify-between items-center`}
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
              placeholder="Search RAM..."
              autoFocus
            />
          ) : (
            <span className={`truncate ${selectedRam ? (isDarkTheme ? 'text-white' : 'text-black') : (isDarkTheme ? 'text-gray-400' : 'text-gray-500')}`}>
              {selectedRam || "Select your RAM"}
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
              {totalRamCount} RAM modules found
            </div>
            
            {filteredCategories.length === 0 ? (
              <div className={`p-3 text-center ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>No RAM modules match your search</div>
            ) : (
              filteredCategories.map(category => (
                <div key={category.id}>
                  <div className={`px-3 py-1 text-xs font-semibold ${isDarkTheme ? 'text-gray-400 bg-gray-900' : 'text-gray-500 bg-gray-50'}`}>
                    {category.name}
                  </div>
                  {category.models.map(ram => (
                    <button
                      key={ram.id}
                      className={`w-full text-left px-3 py-2 text-sm ${selectedRam === ram.name 
                        ? (isDarkTheme ? 'bg-blue-900' : 'bg-blue-50') 
                        : (isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-blue-50')} focus:outline-none ${isDarkTheme ? 'focus:bg-gray-700' : 'focus:bg-blue-50'}`}
                      onClick={() => handleRamSelect(ram.name)}
                    >
                      {ram.name}
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

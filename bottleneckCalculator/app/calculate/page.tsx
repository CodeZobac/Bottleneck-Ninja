"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../components/ui'
import { motion } from 'framer-motion'

interface BottleneckData {
  cpu: string;
  gpu: string;
  ram: string;
  recomendation: string[] | string;
  timestamp: string;
}

export default function CalculateResults() {
  const [data, setData] = useState<BottleneckData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get data from localStorage
    const storedData = localStorage.getItem('bottleneckData')
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData) as BottleneckData
        
        // Format recommendations if it's a string
        if (typeof parsedData.recomendation === 'string') {
          // Convert string to array by splitting on newlines
          parsedData.recomendation = (parsedData.recomendation as string)
            .split('\\n')
            .filter(item => item.trim().length > 0)
        } else if (!Array.isArray(parsedData.recomendation)) {
          // Handle case where it's neither string nor array
          parsedData.recomendation = [];
        }
        
        setData(parsedData)
      } catch (error) {
        console.error('Error parsing bottleneck data:', error)
      }
    }
    
    setLoading(false)
  }, [])
  
  // If no data is found, redirect to home
  useEffect(() => {
    if (!loading && !data) {
      router.push('/')
    }
  }, [loading, data, router])
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xl text-gray-700">Loading your results...</p>
      </div>
    )
  }
  
  // No data state (should redirect)
  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
        <p className="text-xl text-gray-700">No results found. Redirecting...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div 
          className="mb-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">Bottleneck Analysis Results</h1>
          <p className="text-lg text-gray-600">
            Based on your selected components, we've analyzed potential performance bottlenecks
          </p>
        </motion.div>
        
        {/* Components Overview */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Your Hardware Configuration</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex flex-col p-4 bg-blue-50 rounded-lg">
              <span className="text-sm text-blue-600 uppercase font-semibold">CPU</span>
              <span className="text-lg font-medium text-gray-800 mt-1">{data.cpu}</span>
            </div>
            
            <div className="flex flex-col p-4 bg-green-50 rounded-lg">
              <span className="text-sm text-green-600 uppercase font-semibold">GPU</span>
              <span className="text-lg font-medium text-gray-800 mt-1">{data.gpu}</span>
            </div>
            
            <div className="flex flex-col p-4 bg-purple-50 rounded-lg">
              <span className="text-sm text-purple-600 uppercase font-semibold">RAM</span>
              <span className="text-lg font-medium text-gray-800 mt-1">{data.ram}</span>
            </div>
          </div>
        </motion.div>
        
        {/* Recommendations Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
            <span className="text-blue-600 mr-2">★</span>
            Personalized Recommendations
          </h2>
          
          <div className="space-y-6">
            {Array.isArray(data.recomendation) && data.recomendation.map((recommendation, index) => (
              <motion.div 
                key={index}
                className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + (index * 0.1) }}
              >
                <p className="text-gray-800">{recommendation}</p>
              </motion.div>
            ))}
            
            {(!Array.isArray(data.recomendation) || data.recomendation.length === 0) && (
              <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded-r-lg">
                <p className="text-gray-800">
                  Your hardware combination appears to be well-balanced. No specific recommendations at this time.
                </p>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Bottom Actions */}
        <motion.div 
          className="flex justify-center space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Button 
            onPress={() => {
              window.location.href = '/'; 
            }} 
            className="px-6 py-3"
          >
            Back to Home
          </Button>
          <Button onPress={() => window.print()} className="px-6 py-3 bg-green-600 hover:bg-green-700">
            Save Results
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

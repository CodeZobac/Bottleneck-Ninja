"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../components/ui'
import { motion } from 'framer-motion'
import { HardwareChart } from '../components/HardwareChart'

interface BottleneckData {
  result: {
    agreement: boolean;
    components: {
      CPU: string;
      GPU: string;
      RAM: string;
    };
    hardware_analysis: {
      bottleneck: string;
      percentile_ranks: unknown | object;
      raw_benchmark_scores: unknown | object;
      estimated_impact: {
        CPU: number;
        GPU: number;
        RAM: number;
      };
    };
  };
  cpu: string;
  gpu: string;
  ram: string;
  recomendation: string[] | string;
  timestamp: string;
}

export default function CalculateResults() {
  const [data, setData] = useState<BottleneckData | null>(null)
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<Array<{component: string, score: number}>>([])
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
        
        // Add null check for result and nested properties
        if (parsedData.result?.hardware_analysis?.estimated_impact) {
          const impact = parsedData.result.hardware_analysis.estimated_impact;
          const formattedChartData = [
            { component: 'CPU', score: impact.CPU || 0 },
            { component: 'GPU', score: impact.GPU || 0 },
            { component: 'RAM', score: impact.RAM || 0 },
          ];
          setChartData(formattedChartData);
        }
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
  
  // Add a function to determine bottleneck severity color
  const getBottleneckColorClass = (data: BottleneckData) => {
    if (!data?.result?.hardware_analysis) return 'bg-green-50 border-green-200';
    
    // If there's a defined bottleneck, use red
    if (data.result.hardware_analysis.bottleneck) {
      return 'bg-red-50 border-red-200';
    }
    
    // Check if any component has an impact above 10
    const impact = data.result.hardware_analysis.estimated_impact;
    if (impact && (impact.CPU > 10 || impact.GPU > 10 || impact.RAM > 10)) {
      return 'bg-yellow-50 border-yellow-200';
    }
    
    // Otherwise, balanced system
    return 'bg-green-50 border-green-200';
  };

  // Get the appropriate text color for the bottleneck label
  const getBottleneckTextColorClass = (data: BottleneckData) => {
    if (!data?.result?.hardware_analysis?.bottleneck) return 'text-green-600';
    
    // If there's a defined bottleneck, use red
    if (data.result.hardware_analysis.bottleneck) {
      return 'text-red-600';
    }
    
    // Check if any component has an impact above 10
    const impact = data.result.hardware_analysis.estimated_impact;
    if (impact && (impact.CPU > 10 || impact.GPU > 10 || impact.RAM > 10)) {
      return 'text-yellow-600';
    }
    
    // Otherwise, balanced system
    return 'text-green-600';
  };

  // Fix these component color functions with explicit component checks
  const getComponentBgClass = (component: 'CPU' | 'GPU' | 'RAM') => {
    // First check if we have valid impact data
    if (!data?.result?.hardware_analysis?.estimated_impact) {
      // Use green as default for all components when no analysis is available
      return 'bg-green-50';
    }
    
    // If this component is the bottleneck, use red
    if (data.result.hardware_analysis.bottleneck === component) {
      return 'bg-red-50';
    }
    
    // Check impact value based on explicit component checks
    const impact = data.result.hardware_analysis.estimated_impact;
    
    if (component === 'CPU' && impact.CPU > 10) {
      return 'bg-yellow-50';
    }
    
    if (component === 'GPU' && impact.GPU > 10) {
      return 'bg-yellow-50';
    }
    
    if (component === 'RAM' && impact.RAM > 10) {
      return 'bg-yellow-50';
    }
    
    // Use green as default for all balanced components
    return 'bg-green-50';
  };
  
  const getComponentTextClass = (component: 'CPU' | 'GPU' | 'RAM') => {
    // First check if we have valid impact data
    if (!data?.result?.hardware_analysis?.estimated_impact) {
      // Use green text as default for all components when no analysis is available
      return 'text-green-600';
    }
    
    // If this component is the bottleneck, use red
    if (data.result.hardware_analysis.bottleneck === component) {
      return 'text-red-600';
    }
    
    // Check impact value based on explicit component checks
    const impact = data.result.hardware_analysis.estimated_impact;
    
    if (component === 'CPU' && impact.CPU > 10) {
      return 'text-yellow-600';
    }
    
    if (component === 'GPU' && impact.GPU > 10) {
      return 'text-yellow-600';
    }
    
    if (component === 'RAM' && impact.RAM > 10) {
      return 'text-yellow-600';
    }
    
    // Use green text as default for all balanced components
    return 'text-green-600';
  };

  // Add debug function to display impact values for easy verification
  const getImpactValue = (component: 'CPU' | 'GPU' | 'RAM'): string => {
    if (!data?.result?.hardware_analysis?.estimated_impact) return '0';
    const impact = data.result.hardware_analysis.estimated_impact[component];
    return impact !== undefined ? impact.toFixed(1) : '0';
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xl text-gray-700">Rendering your results...</p>
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
            {/* eslint-disable-next-line react/no-unescaped-entities */}
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
            <div className={`flex flex-col p-4 rounded-lg ${getComponentBgClass('CPU')}`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm uppercase font-semibold ${getComponentTextClass('CPU')}`}>
                  CPU
                  {data.result?.hardware_analysis?.bottleneck === 'CPU' && (
                    <span className="ml-2 text-red-500">⚠️</span>
                  )}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                  Impact: {getImpactValue('CPU')}
                </span>
              </div>
              <span className="text-lg font-medium text-gray-800 mt-1">{data.cpu}</span>
            </div>
            
            <div className={`flex flex-col p-4 rounded-lg ${getComponentBgClass('GPU')}`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm uppercase font-semibold ${getComponentTextClass('GPU')}`}>
                  GPU
                  {data.result?.hardware_analysis?.bottleneck === 'GPU' && (
                    <span className="ml-2 text-red-500">⚠️</span>
                  )}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                  Impact: {getImpactValue('GPU')}
                </span>
              </div>
              <span className="text-lg font-medium text-gray-800 mt-1">{data.gpu}</span>
            </div>
            
            <div className={`flex flex-col p-4 rounded-lg ${getComponentBgClass('RAM')}`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm uppercase font-semibold ${getComponentTextClass('RAM')}`}>
                  RAM
                  {data.result?.hardware_analysis?.bottleneck === 'RAM' && (
                    <span className="ml-2 text-red-500">⚠️</span>
                  )}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                  Impact: {getImpactValue('RAM')}
                </span>
              </div>
              <span className="text-lg font-medium text-gray-800 mt-1">{data.ram}</span>
            </div>
          </div>

          {/* Debug info to verify data structure */}
          <div className="mt-4 text-xs text-gray-500 border-t pt-2">
            <div className="overflow-hidden text-ellipsis">
              Bottleneck: {data.result?.hardware_analysis?.bottleneck || 'None detected'}
            </div>
          </div>
        </motion.div>

        {/* Bottleneck Analysis Chart */}
        {chartData.length > 0 && (
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <HardwareChart data={chartData} />
            <div className={`mt-6 p-3 rounded-md ${getBottleneckColorClass(data)}`}>
              <p className="font-medium text-center">
                {data.result.hardware_analysis?.bottleneck ? (
                  <>
                    Detected Bottleneck: <span className={`font-bold ${getBottleneckTextColorClass(data)}`}>
                      {data.result.hardware_analysis.bottleneck}
                    </span>
                  </>
                ) : (
                  <span className="text-green-600 font-medium">
                    No significant bottleneck detected
                  </span>
                )}
              </p>
            </div>
          </motion.div>
        )}
        
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

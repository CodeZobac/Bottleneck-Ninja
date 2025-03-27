"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../components/ui'
import { motion } from 'framer-motion'
import { HardwareChart } from '../components/HardwareChart'
import { ConfirmationModal } from '../components/ConfirmationModal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../components/ui/dropdown'
import { HardwareBuild } from '../builds/types'
import { SaveIcon, FileDown, User } from 'lucide-react'
import { useTheme } from 'next-themes'

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
  recommendations: string[] | string;
  timestamp: string;
}

export default function CalculateResults() {
  const [data, setData] = useState<BottleneckData | null>(null)
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<Array<{component: string, score: number}>>([])
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const router = useRouter()
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    // Get data from localStorage
    const storedData = localStorage.getItem('bottleneckData')
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData) as BottleneckData
        
        // Format recommendations if it's a string
        if (typeof parsedData.recommendations === 'string') {
          // Convert string to array by splitting on newlines
          parsedData.recommendations = (parsedData.recommendations as string)
            .split('\\n')
            .filter(item => item.trim().length > 0)
        } else if (!Array.isArray(parsedData.recommendations)) {
          // Handle case where it's neither string nor array
          parsedData.recommendations = [];
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
  
  // Add a function to determine bottleneck severity color with dark mode support
  const getBottleneckColorClass = (data: BottleneckData) => {
    if (!data?.result?.hardware_analysis) {
      return isDark ? 'bg-green-900/30 border-green-800' : 'bg-green-50 border-green-200';
    }
    
    // If there's a defined bottleneck, use red
    if (data.result.hardware_analysis.bottleneck) {
      return isDark ? 'bg-red-900/30 border-red-800' : 'bg-red-50 border-red-200';
    }
    
    // Check if any component has an impact above 10
    const impact = data.result.hardware_analysis.estimated_impact;
    if (impact && (impact.CPU > 10 || impact.GPU > 10 || impact.RAM > 10)) {
      return isDark ? 'bg-yellow-900/30 border-yellow-800' : 'bg-yellow-50 border-yellow-200';
    }
    
    // Otherwise, balanced system
    return isDark ? 'bg-green-900/30 border-green-800' : 'bg-green-50 border-green-200';
  };
  
  // Get the appropriate text color for the bottleneck label
  const getBottleneckTextColorClass = (data: BottleneckData) => {
    if (!data?.result?.hardware_analysis?.bottleneck) {
      return isDark ? 'text-green-400' : 'text-green-600';
    }
    
    // If there's a defined bottleneck, use red
    if (data.result.hardware_analysis.bottleneck) {
      return isDark ? 'text-red-400' : 'text-red-600';
    }
    
    // Check if any component has an impact above 10
    const impact = data.result.hardware_analysis.estimated_impact;
    if (impact && (impact.CPU > 10 || impact.GPU > 10 || impact.RAM > 10)) {
      return isDark ? 'text-yellow-400' : 'text-yellow-600';
    }
    
    // Otherwise, balanced system
    return isDark ? 'text-green-400' : 'text-green-600';
  };
  
  // Fix these component color functions with explicit component checks
  const getComponentBgClass = (component: 'CPU' | 'GPU' | 'RAM') => {
    // First check if we have valid impact data
    if (!data?.result?.hardware_analysis?.estimated_impact) {
      // Use green as default for all components when no analysis is available
      return isDark ? 'bg-green-900/30' : 'bg-green-50';
    }
    
    // If this component is the bottleneck, use red
    if (data.result.hardware_analysis.bottleneck === component) {
      return isDark ? 'bg-red-900/30' : 'bg-red-50';
    }
    
    // Check impact value based on explicit component checks
    const impact = data.result.hardware_analysis.estimated_impact;
    
    if (component === 'CPU' && impact.CPU > 10) {
      return isDark ? 'bg-yellow-900/30' : 'bg-yellow-50';
    }
    
    if (component === 'GPU' && impact.GPU > 10) {
      return isDark ? 'bg-yellow-900/30' : 'bg-yellow-50';
    }
    
    if (component === 'RAM' && impact.RAM > 10) {
      return isDark ? 'bg-yellow-900/30' : 'bg-yellow-50';
    }
    
    // Use green as default for all balanced components
    return isDark ? 'bg-green-900/30' : 'bg-green-50';
  };
  
  const getComponentTextClass = (component: 'CPU' | 'GPU' | 'RAM') => {
    // First check if we have valid impact data
    if (!data?.result?.hardware_analysis?.estimated_impact) {
      // Use green text as default for all components when no analysis is available
      return isDark ? 'text-green-400' : 'text-green-600';
    }
    
    // If this component is the bottleneck, use red
    if (data.result.hardware_analysis.bottleneck === component) {
      return isDark ? 'text-red-400' : 'text-red-600';
    }
    
    // Check impact value based on explicit component checks
    const impact = data.result.hardware_analysis.estimated_impact;
    
    if (component === 'CPU' && impact.CPU > 10) {
      return isDark ? 'text-yellow-400' : 'text-yellow-600';
    }
    
    if (component === 'GPU' && impact.GPU > 10) {
      return isDark ? 'text-yellow-400' : 'text-yellow-600';
    }
    
    if (component === 'RAM' && impact.RAM > 10) {
      return isDark ? 'text-yellow-400' : 'text-yellow-600';
    }
    
    // Use green text as default for all balanced components
    return isDark ? 'text-green-400' : 'text-green-600';
  };
  // Add debug function to display impact values for easy verification
  const getImpactValue = (component: 'CPU' | 'GPU' | 'RAM'): string => {
    if (!data?.result?.hardware_analysis?.estimated_impact) return '0';
    const impact = data.result.hardware_analysis.estimated_impact[component];
    return impact !== undefined ? impact.toFixed(1) : '0';
  };

  // Function to save build to user profile
  const saveBuildToProfile = async () => {
    if (!data) return;
    
    // Show loading state
    setIsSaving(true);
    
    try {
      // Create build object
      const build: HardwareBuild = {
        cpu: data.cpu,
        gpu: data.gpu,
        ram: data.ram,
        recommendations: data.recommendations,
        result: data.result
      };
      
      // Send request to API
      const response = await fetch('/api/builds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(build),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save build');
      }
      
      // Show success message
      setSaveSuccess(true);
      
      // Redirect to builds page after a moment
      setTimeout(() => {
        router.push('/builds');
      }, 1500);
    } catch (error) {
      console.error('Error saving build:', error);
      alert('Failed to save build. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle back button click
  const handleBackClick = () => {
    setShowConfirmModal(true);
  };

  // Handle save as PDF
  const handleSaveAsPDF = () => {
    window.print();
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xl text-gray-700 dark:text-gray-200">Rendering your results...</p>
      </div>
    )
  }
  
  // No data state (should redirect)
  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
        <p className="text-xl text-gray-700 dark:text-gray-200">No results found. Redirecting...</p>
      </div>
    )
  }

  // Success state after saving
  if (saveSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-green-50 to-gray-50 dark:from-green-900/20 dark:to-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="rounded-full bg-green-100 dark:bg-green-900/50 p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-500 dark:text-green-400"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Successfully Saved!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Your build has been saved to your profile. Redirecting to your builds...</p>
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="bg-green-500 h-2 animate-progress"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 dark:from-gray-900 dark:to-gray-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div 
          className="mb-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 dark:text-blue-400 mb-2">Bottleneck Analysis Results</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            Based on your selected components, we've analyzed potential performance bottlenecks
          </p>
        </motion.div>
        
        {/* Components Overview */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 border-b dark:border-gray-700 pb-2">Your Hardware Configuration</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className={`flex flex-col p-4 rounded-lg ${getComponentBgClass('CPU')}`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm uppercase font-semibold ${getComponentTextClass('CPU')}`}>
                  CPU
                  {data.result?.hardware_analysis?.bottleneck === 'CPU' && (
                    <span className="ml-2 text-red-500">⚠️</span>
                  )}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                  Impact: {getImpactValue('CPU')}
                </span>
              </div>
              <span className="text-lg font-medium text-gray-800 dark:text-gray-200 mt-1">{data.cpu}</span>
            </div>
            
            <div className={`flex flex-col p-4 rounded-lg ${getComponentBgClass('GPU')}`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm uppercase font-semibold ${getComponentTextClass('GPU')}`}>
                  GPU
                  {data.result?.hardware_analysis?.bottleneck === 'GPU' && (
                    <span className="ml-2 text-red-500">⚠️</span>
                  )}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                  Impact: {getImpactValue('GPU')}
                </span>
              </div>
              <span className="text-lg font-medium text-gray-800 dark:text-gray-200 mt-1">{data.gpu}</span>
            </div>
            
            <div className={`flex flex-col p-4 rounded-lg ${getComponentBgClass('RAM')}`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm uppercase font-semibold ${getComponentTextClass('RAM')}`}>
                  RAM
                  {data.result?.hardware_analysis?.bottleneck === 'RAM' && (
                    <span className="ml-2 text-red-500">⚠️</span>
                  )}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                  Impact: {getImpactValue('RAM')}
                </span>
              </div>
              <span className="text-lg font-medium text-gray-800 dark:text-gray-200 mt-1">{data.ram}</span>
            </div>
          </div>
          {/* Debug info to verify data structure */}
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 border-t dark:border-gray-700 pt-2">
            <div className="overflow-hidden text-ellipsis">
              Bottleneck: {data.result?.hardware_analysis?.bottleneck || 'None detected'}
            </div>
          </div>
        </motion.div>
        {/* Bottleneck Analysis Chart */}
        {chartData.length > 0 && (
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <HardwareChart data={chartData} />
            <div className={`mt-6 p-3 rounded-md ${getBottleneckColorClass(data)}`}>
              <p className="font-medium text-center dark:text-gray-200">
                {data.result.hardware_analysis?.bottleneck ? (
                  <>
                    Detected Bottleneck: <span className={`font-bold ${getBottleneckTextColorClass(data)}`}>
                      {data.result.hardware_analysis.bottleneck}
                    </span>
                  </>
                ) : (
                  <span className={isDark ? "text-green-400 font-medium" : "text-green-600 font-medium"}>
                    No significant bottleneck detected
                  </span>
                )}
              </p>
            </div>
          </motion.div>
        )}
        
        {/* Recommendations Section */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 border-b dark:border-gray-700 pb-2">
            <span className="text-blue-600 dark:text-blue-400 mr-2">★</span>
            Personalized Recommendations
          </h2>
          
          <div className="space-y-6">
            {Array.isArray(data.recommendations) && data.recommendations.map((recommendation, index) => (
              <motion.div 
                key={index}
                className={isDark 
                  ? "p-4 border-l-4 border-blue-600 bg-blue-900/20 rounded-r-lg"
                  : "p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg"
                }
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + (index * 0.1) }}
              >
                <p className="text-gray-800 dark:text-gray-200">{recommendation}</p>
              </motion.div>
            ))}
            
            {(!Array.isArray(data.recommendations) || data.recommendations.length === 0) && (
              <div className={isDark
                ? "p-4 border-l-4 border-yellow-600 bg-yellow-900/20 rounded-r-lg"
                : "p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded-r-lg"
              }>
                <p className="text-gray-800 dark:text-gray-200">
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
            onPress={handleBackClick}
            className="h-11 px-6 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 min-w-[160px] flex items-center justify-center"
          >
            Back to Home
          </Button>
          
          {/* Save Results Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className={`h-11 px-6 rounded-lg flex items-center justify-center gap-2 min-w-[160px] ${isSaving ? 'bg-blue-400 dark:bg-blue-500 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 cursor-pointer'} text-white font-medium`}
                disabled={isSaving}
              >
                <SaveIcon size={18} />
                {isSaving ? 'Saving...' : 'Save Results'}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end" className="min-w-[180px] z-50 bg-white dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700">
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer dark:hover:bg-gray-700" 
                onClick={handleSaveAsPDF}
              >
                <FileDown size={16} />
                <span>Save as PDF</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer dark:hover:bg-gray-700" 
                onClick={saveBuildToProfile}
              >
                <User size={16} />
                <span>Save to Profile</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      </div>
      
      {/* Confirmation Modal */}
      <ConfirmationModal 
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => router.push('/')}
        onSave={saveBuildToProfile}
      />
      
      {/* Add styles for success animation */}
      <style jsx global>{`
        @keyframes progress {
          0% { width: 0; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 1.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}

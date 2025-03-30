"use client";
import { motion } from "framer-motion";
import { HardwareBuild } from "../types";
import { HardwareChart } from "@/app/components/HardwareChart";
import { Button } from "@/app/components/ui/button";
import { useTheme } from "next-themes";


interface BuildAnalysisProps {
  build: HardwareBuild;
}

export function BuildAnalysis({ build }: BuildAnalysisProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Format recommendations ensuring they display properly from database
  const getRecommendations = (): string[] => {
    try {
      // Check for recommendations in both property names (with and without 's')
      const recommendationData = build.recommendations;
      
      // If already an array, return it directly
      if (Array.isArray(recommendationData)) {
        return recommendationData;
      }
      
      // If it's a string, try to parse it as JSON first (in case it's a stringified array)
      if (typeof recommendationData === "string") {
        try {
          const parsedRecommendation = JSON.parse(recommendationData);
          if (Array.isArray(parsedRecommendation)) {
            return parsedRecommendation;
          }
          // If parsed but not an array, handle as string
          return recommendationData
            .split("\\n")
            .filter(item => item.trim().length > 0);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          // If JSON parsing fails, split by newlines
          return recommendationData
            .split("\\n")
            .filter(item => item.trim().length > 0);
        }
      }
      
      // Handle case where it might be stored as a JSONB object in database but not properly parsed
      if (recommendationData && typeof recommendationData === "object") {
        // Try to access it as if it were an array-like object with numeric keys
        const objValues = Object.values(recommendationData);
        if (objValues.length > 0) {
          return objValues.map(item => String(item));
        }
      }
      
      // For debugging
      console.log('Recommendation data type:', typeof recommendationData);
      console.log('Recommendation data:', recommendationData);
      
      return [];
    } catch (error) {
      console.error("Error parsing recommendations:", error);
      return [];
    }
  };
  
  const recommendations = getRecommendations();
  
  // Prepare chart data
  const chartData = build.result?.hardware_analysis?.estimated_impact
    ? [
        {
          component: "CPU",
          score: build.result.hardware_analysis.estimated_impact.CPU || 0,
        },
        {
          component: "GPU",
          score: build.result.hardware_analysis.estimated_impact.GPU || 0,
        },
        {
          component: "RAM",
          score: build.result.hardware_analysis.estimated_impact.RAM || 0,
        },
      ]
    : [];
    
  // Helper functions copied from calculate page
  const getBottleneckColorClass = () => {
    if (!build?.result?.hardware_analysis) return isDark ? "bg-green-900/30 border-green-800" : "bg-green-50 border-green-200";
    // If there's a defined bottleneck, use red
    if (build.result.hardware_analysis.bottleneck) {
      return isDark ? "bg-red-900/30 border-red-800" : "bg-red-50 border-red-200";
    }
    // Check if any component has an impact above 10
    const impact = build.result.hardware_analysis.estimated_impact;
    if (impact && (impact.CPU > 10 || impact.GPU > 10 || impact.RAM > 10)) {
      return isDark ? "bg-yellow-900/30 border-yellow-800" : "bg-yellow-50 border-yellow-200";
    }
    // Otherwise, balanced system
    return isDark ? "bg-green-900/30 border-green-800" : "bg-green-50 border-green-200";
  };
  
  const getBottleneckTextColorClass = () => {
    if (!build?.result?.hardware_analysis?.bottleneck) 
      return isDark ? "text-green-400" : "text-green-600";
    // If there's a defined bottleneck, use red
    if (build.result.hardware_analysis.bottleneck) {
      return isDark ? "text-red-400" : "text-red-600";
    }
    // Check if any component has an impact above 10
    const impact = build.result.hardware_analysis.estimated_impact;
    if (impact && (impact.CPU > 10 || impact.GPU > 10 || impact.RAM > 10)) {
      return isDark ? "text-yellow-400" : "text-yellow-600";
    }
    // Otherwise, balanced system
    return isDark ? "text-green-400" : "text-green-600";
  };
  
  const getComponentBgClass = (component: "CPU" | "GPU" | "RAM") => {
    // First check if we have valid impact data
    if (!build?.result?.hardware_analysis?.estimated_impact) {
      // Use green as default for all components when no analysis is available
      return isDark ? "bg-green-900/30" : "bg-green-50";
    }
    // If this component is the bottleneck, use red
    if (build.result.hardware_analysis.bottleneck === component) {
      return isDark ? "bg-red-900/30" : "bg-red-50";
    }
    // Check impact value based on explicit component checks
    const impact = build.result.hardware_analysis.estimated_impact;
    if (component === "CPU" && impact.CPU > 10) {
      return isDark ? "bg-yellow-900/30" : "bg-yellow-50";
    }
    if (component === "GPU" && impact.GPU > 10) {
      return isDark ? "bg-yellow-900/30" : "bg-yellow-50";
    }
    if (component === "RAM" && impact.RAM > 10) {
      return isDark ? "bg-yellow-900/30" : "bg-yellow-50";
    }
    // Use green as default for all balanced components
    return isDark ? "bg-green-900/30" : "bg-green-50";
  };
  
  const getComponentTextClass = (component: "CPU" | "GPU" | "RAM") => {
    // First check if we have valid impact data
    if (!build?.result?.hardware_analysis?.estimated_impact) {
      // Use green text as default for all components when no analysis is available
      return isDark ? "text-green-400" : "text-green-600";
    }
    // If this component is the bottleneck, use red
    if (build.result.hardware_analysis.bottleneck === component) {
      return isDark ? "text-red-400" : "text-red-600";
    }
    // Check impact value based on explicit component checks
    const impact = build.result.hardware_analysis.estimated_impact;
    if (component === "CPU" && impact.CPU > 10) {
      return isDark ? "text-yellow-400" : "text-yellow-600";
    }
    if (component === "GPU" && impact.GPU > 10) {
      return isDark ? "text-yellow-400" : "text-yellow-600";
    }
    if (component === "RAM" && impact.RAM > 10) {
      return isDark ? "text-yellow-400" : "text-yellow-600";
    }
    // Use green text as default for all balanced components
    return isDark ? "text-green-400" : "text-green-600";
  };
  
  const getImpactValue = (component: "CPU" | "GPU" | "RAM"): string => {
    if (!build?.result?.hardware_analysis?.estimated_impact) return "0";
    const impact = build.result.hardware_analysis.estimated_impact[component];
    return impact !== undefined ? impact.toFixed(1) : "0";
  };
  
  return (
    <div>
      {/* Header Section */}
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 dark:text-blue-400 mb-2">
          Build Analysis
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Detailed performance analysis of your PC configuration
        </p>
        {build.created_at && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Saved on {new Date(build.created_at).toLocaleString()}
          </p>
        )}
      </motion.div>
      
      {/* Components Overview */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 border-b dark:border-gray-700 pb-2">
          Your Hardware Configuration
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className={`flex flex-col p-4 rounded-lg ${getComponentBgClass("CPU")}`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm uppercase font-semibold ${getComponentTextClass("CPU")}`}>
                CPU
                {build.result?.hardware_analysis?.bottleneck === "CPU" && (
                  <span className="ml-2 text-red-500">⚠️</span>
                )}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                Impact: {getImpactValue("CPU")}
              </span>
            </div>
            <span className="text-lg font-medium text-gray-800 dark:text-gray-200 mt-1">
              {build.cpu}
            </span>
          </div>
          <div className={`flex flex-col p-4 rounded-lg ${getComponentBgClass("GPU")}`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm uppercase font-semibold ${getComponentTextClass("GPU")}`}>
                GPU
                {build.result?.hardware_analysis?.bottleneck === "GPU" && (
                  <span className="ml-2 text-red-500">⚠️</span>
                )}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                Impact: {getImpactValue("GPU")}
              </span>
            </div>
            <span className="text-lg font-medium text-gray-800 dark:text-gray-200 mt-1">
              {build.gpu}
            </span>
          </div>
          <div className={`flex flex-col p-4 rounded-lg ${getComponentBgClass("RAM")}`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm uppercase font-semibold ${getComponentTextClass("RAM")}`}>
                RAM
                {build.result?.hardware_analysis?.bottleneck === "RAM" && (
                  <span className="ml-2 text-red-500">⚠️</span>
                )}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                Impact: {getImpactValue("RAM")}
              </span>
            </div>
            <span className="text-lg font-medium text-gray-800 dark:text-gray-200 mt-1">
              {build.ram}
            </span>
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
          <div className="relative">
            {/* This div ensures the chart has the correct background in dark mode */}
            {isDark && (
              <div 
                className="absolute inset-0 rounded-lg z-0"
                style={{ backgroundColor: '#1e293b' }}
              ></div>
            )}
            <div className="relative z-10">
              <HardwareChart data={chartData} />
            </div>
          </div>
          <div className={`mt-6 p-3 rounded-md ${getBottleneckColorClass()}`}>
            <p className="font-medium text-center dark:text-gray-200">
              {build.result.hardware_analysis?.bottleneck ? (
                <>
                  Detected Bottleneck:{" "}
                  <span className={`font-bold ${getBottleneckTextColorClass()}`}>
                    {build.result.hardware_analysis.bottleneck}
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
          {Array.isArray(recommendations) && recommendations.length > 0 ? (
            recommendations.map((recommendation, index) => (
              <motion.div
                key={index}
                className={isDark 
                  ? "p-4 border-l-4 border-blue-600 bg-blue-900/20 rounded-r-lg"
                  : "p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg"
                }
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              >
                <p className="text-gray-800 dark:text-gray-200">{recommendation}</p>
              </motion.div>
            ))
          ) : (
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
        {/* 
        Tive que usar um <a> para o href funcionar corretamente, mesmo com o onPress no Button
        Isso é um bug conhecido no Next.js, onde o href não funciona corretamente com ecras tacteis*/}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" className="cursor-pointer">
          <Button
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 min-w-[150px] flex items-center justify-center gap-2"
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onPress={(e) => {
              // This backup handler ensures the link works even if the button event handling is odd
              window.location.href = '/';
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Back to Home
          </Button>
        </a>
        <Button
          onPress={() => window.print()}
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 min-w-[150px] flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Export PDF
        </Button>
      </motion.div>
    </div>
  );
}
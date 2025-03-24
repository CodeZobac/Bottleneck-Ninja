/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface FirstTimeSetupProps {
  session: any;
  onComplete: () => void;
}

export default function FirstTimeSetup({ session, onComplete }: FirstTimeSetupProps) {
  const [budget, setBudget] = useState("");
  const [cpuIntensive, setCpuIntensive] = useState(false);
  const [gpuIntensive, setGpuIntensive] = useState(false);
  const [gaming, setGaming] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Theme-aware styling
  const isDarkTheme = resolvedTheme === 'dark';

  // Ensure we only render theme-specific elements after component mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!budget) {
      setError("Please enter your budget");
      setIsSubmitting(false);
      return;
    }

    if (!cpuIntensive && !gpuIntensive && !gaming) {
      setError("Please select at least one usage option");
      setIsSubmitting(false);
      return;
    }

    try {
      const { error: supabaseError } = await supabase
        .from('user_preferences')
        .insert({
          email: session.user.email,
          budget: parseFloat(budget),
          cpu_intensive: cpuIntensive,
          gpu_intensive: gpuIntensive,
          gaming: gaming
        });

      if (supabaseError) throw supabaseError;
      onComplete();
    } catch (err: any) {
      console.error("Error saving preferences:", err);
      setError("Failed to save preferences. Please try again.");
    }

    setIsSubmitting(false);
  };

  if (!mounted) return null; // Prevent rendering until client-side hydration

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-gray-900/95 dark:to-blue-950/95 backdrop-blur-sm">
      {/* Animated background elements */}
      <motion.div 
        className="absolute inset-0 -z-20 opacity-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.5 }}
      >
        <div className="absolute w-full h-full bg-[url('/background.svg')] bg-cover opacity-10 dark:opacity-5"></div>
        <motion.div 
          className="absolute w-24 h-24 rounded-full bg-blue-500 filter blur-3xl"
          animate={{ 
            x: [0, 30, 0], 
            y: [0, 40, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "easeInOut",
          }}
          style={{ top: '20%', left: '30%' }}
        />
        <motion.div 
          className="absolute w-32 h-32 rounded-full bg-purple-600 filter blur-3xl"
          animate={{ 
            x: [0, -40, 0], 
            y: [0, 30, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 10,
            ease: "easeInOut",
          }}
          style={{ top: '60%', right: '30%' }}
        />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 15 
        }}
        className="relative w-full max-w-md overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute -z-10 w-80 h-80 rounded-full bg-gradient-to-r from-blue-400 to-cyan-300 dark:from-blue-600 dark:to-cyan-700 opacity-20 blur-3xl -top-40 -left-40"></div>
        <div className="absolute -z-10 w-80 h-80 rounded-full bg-gradient-to-r from-purple-400 to-pink-300 dark:from-purple-700 dark:to-pink-900 opacity-20 blur-3xl -bottom-40 -right-40"></div>
        
        <div className={`rounded-2xl shadow-xl overflow-hidden border ${isDarkTheme ? 'border-gray-800 bg-gray-900/90' : 'border-gray-100 bg-white/90'} backdrop-blur-lg`}>
          {/* Top glassmorphism decoration bar */}
          <div className={`h-2 bg-gradient-to-r from-blue-500 to-purple-600 ${isDarkTheme ? 'opacity-80' : 'opacity-90'}`}></div>
          
          <div className={`p-8`}>
            <div className="flex items-center mb-6">
              {session?.user?.image && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.2
                  }}
                  className={`rounded-full overflow-hidden border-4 ${isDarkTheme ? 'border-blue-600/30' : 'border-blue-100'} shadow-lg p-0.5`}
                >
                  <Image 
                    src={session.user.image} 
                    width={50}
                    height={50}
                    alt="Profile" 
                    className="rounded-full"
                  />
                </motion.div>
              )}
              <motion.h1 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className={`text-2xl font-bold ml-4 ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}
              >
                Welcome, {session?.user?.name || 'User'}!
              </motion.h1>
            </div>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`mb-8 ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}
            >
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              Let's set up your computer preferences to help us recommend the best hardware for your needs.
            </motion.p>
            
            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-gray-200' : 'text-gray-700'}`}>
                  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  What's your budget for a new computer?
                </label>
                <div className={`mt-1 relative rounded-lg shadow-sm overflow-hidden ${isDarkTheme ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-500'} sm:text-sm`}>$</span>
                  </div>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className={`block w-full pl-7 pr-12 py-3 border-none ${isDarkTheme ? 'bg-gray-800 text-white placeholder-gray-500' : 'bg-gray-50 text-gray-900 placeholder-gray-400'} focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-lg`}
                    placeholder="0.00"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <span className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-500'} sm:text-sm`}>USD</span>
                  </div>
                </div>
              </motion.div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-gray-200' : 'text-gray-700'}`}>
                  What will you primarily use your computer for?
                  <span className={`text-sm block mt-1 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>(Select all that apply)</span>
                </label>
                <div className="space-y-3 mt-3">
                  <motion.div 
                    className={`flex items-center p-3 rounded-lg ${isDarkTheme ? 'hover:bg-gray-800' : 'hover:bg-blue-50'} transition-colors`}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      id="cpu-intensive"
                      name="cpu-intensive"
                      type="checkbox"
                      checked={cpuIntensive}
                      onChange={() => setCpuIntensive(!cpuIntensive)}
                      className={`h-5 w-5 ${isDarkTheme ? 'text-blue-500 border-gray-700 bg-gray-800' : 'text-blue-600 border-gray-300'} rounded focus:ring-blue-500`}
                    />
                    <label htmlFor="cpu-intensive" className={`ml-3 block text-sm ${isDarkTheme ? 'text-gray-200' : 'text-gray-700'}`}>
                      CPU Intensive Tasks (e.g., programming, video editing)
                    </label>
                  </motion.div>
                  
                  <motion.div 
                    className={`flex items-center p-3 rounded-lg ${isDarkTheme ? 'hover:bg-gray-800' : 'hover:bg-blue-50'} transition-colors`}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      id="gpu-intensive"
                      name="gpu-intensive"
                      type="checkbox"
                      checked={gpuIntensive}
                      onChange={() => setGpuIntensive(!gpuIntensive)}
                      className={`h-5 w-5 ${isDarkTheme ? 'text-blue-500 border-gray-700 bg-gray-800' : 'text-blue-600 border-gray-300'} rounded focus:ring-blue-500`}
                    />
                    <label htmlFor="gpu-intensive" className={`ml-3 block text-sm ${isDarkTheme ? 'text-gray-200' : 'text-gray-700'}`}>
                      GPU Intensive Tasks (e.g., 3D rendering, AI/ML)
                    </label>
                  </motion.div>
                  
                  <motion.div 
                    className={`flex items-center p-3 rounded-lg ${isDarkTheme ? 'hover:bg-gray-800' : 'hover:bg-blue-50'} transition-colors`}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      id="gaming"
                      name="gaming"
                      type="checkbox"
                      checked={gaming}
                      onChange={() => setGaming(!gaming)}
                      className={`h-5 w-5 ${isDarkTheme ? 'text-blue-500 border-gray-700 bg-gray-800' : 'text-blue-600 border-gray-300'} rounded focus:ring-blue-500`}
                    />
                    <label htmlFor="gaming" className={`ml-3 block text-sm ${isDarkTheme ? 'text-gray-200' : 'text-gray-700'}`}>
                      Gaming
                    </label>
                  </motion.div>
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-red-500 text-sm p-3 rounded-lg ${isDarkTheme ? 'bg-red-900/20' : 'bg-red-50'}`}
                >
                  {error}
                </motion.div>
              )}

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium shadow-lg 
                  ${isSubmitting 
                    ? `${isDarkTheme ? 'bg-blue-800/50 text-white/70' : 'bg-blue-400 text-white/90'} cursor-not-allowed` 
                    : `${isDarkTheme ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`
                  } 
                  transform transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : "Save Preferences"}
                </button>
              </motion.div>
            </motion.form>
          </div>
          
          {/* Bottom glassmorphism decoration bar */}
          <div className="h-1 bg-gradient-to-r from-purple-600 to-blue-500 opacity-60"></div>
        </div>
      </motion.div>
    </div>
  );
}

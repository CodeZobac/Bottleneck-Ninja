/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";

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

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center mb-6">
          {session?.user?.image && (
            <Image 
              src={session.user.image} 
              alt="Profile" 
              className="h-12 w-12 rounded-full mr-4"
            />
          )}
          <h1 className="text-2xl font-bold">Welcome, {session?.user?.name || 'User'}!</h1>
        </div>
        
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <p className="mb-6">Let's set up your computer preferences to help us recommend the best hardware for your needs.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              What's your budget for a new computer?
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="block w-full pl-7 pr-12 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              What will you primarily use your computer for?
              <span className="text-sm text-gray-500 block">(Select all that apply)</span>
            </label>
            <div className="space-y-2 mt-2">
              <div className="flex items-center">
                <input
                  id="cpu-intensive"
                  name="cpu-intensive"
                  type="checkbox"
                  checked={cpuIntensive}
                  onChange={() => setCpuIntensive(!cpuIntensive)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="cpu-intensive" className="ml-2 block text-sm text-gray-900">
                  CPU Intensive Tasks (e.g., programming, video editing)
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="gpu-intensive"
                  name="gpu-intensive"
                  type="checkbox"
                  checked={gpuIntensive}
                  onChange={() => setGpuIntensive(!gpuIntensive)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="gpu-intensive" className="ml-2 block text-sm text-gray-900">
                  GPU Intensive Tasks (e.g., 3D rendering, AI/ML)
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="gaming"
                  name="gaming"
                  type="checkbox"
                  checked={gaming}
                  onChange={() => setGaming(!gaming)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="gaming" className="ml-2 block text-sm text-gray-900">
                  Gaming
                </label>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

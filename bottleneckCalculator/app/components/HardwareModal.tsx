"use client"
import React from "react"
import { Button, Form, Modal} from "./ui"
import { GpuMenu } from "./ModalMenuGpu"
import { CpuMenu } from "./ModalMenuCpu"
import { useState, useEffect } from "react"
import { RamMenu } from "./ModalMenuRam"
import dynamic from 'next/dynamic'
import { sendPostRequest } from "../api/serverActions"
import { useRouter } from 'next/navigation'
import MainButton from "./ui/buton"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PredictionResponse } from "../api/types"
import { useAppDispatch } from "../store"
import { setBottleneckData } from "../features/bottleneckSlice"

// Import Lottie client-side only
const Lottie = dynamic(() => import('lottie-react'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )
})

interface BottleneckData {
  cpu: string;
  gpu: string;
  ram: string;
  recommendations: string[];
  result: {
    agreement: boolean;
    components: {
      CPU: string;
      GPU: string;
      RAM: string;
    };
    hardware_analysis: {
      bottleneck: string;
      percentile_ranks: Record<string, number>;
      raw_benchmark_scores: Record<string, number>;
      estimated_impact: {
        CPU: number;
        GPU: number;
        RAM: number;
      };
    };
  };
  timestamp: string;
}

export function HardwareModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCpu, setSelectedCpu] = useState<string>("");
  const [selectedGpu, setSelectedGpu] = useState<string>("");
  const [selectedRam, setSelectedRam] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [loadingAnimation, setLoadingAnimation] = useState<any>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  
  // Load the animation data client-side only
  useEffect(() => {
    let isMounted = true;
    
    // Only load animation on client when needed
    if (isLoading && typeof window !== 'undefined') {
      import('../../public/isLoading.json')
        .then(animData => {
          if (isMounted && animData?.default) {
            setLoadingAnimation(animData.default);
          }
        })
        .catch(err => {
          console.error("Failed to load animation:", err);
        });
    }
    
    return () => {
      isMounted = false;
    };
  }, [isLoading]);

  // Enhanced prefetching - both data and page prefetch
  useEffect(() => {
    // Only prefetch when all three components are selected
    if (selectedCpu && selectedGpu && selectedRam) {
      // 1. Data prefetching with React Query
      const queryKey = ['bottleneckCalculation', selectedCpu, selectedGpu, selectedRam];
      const queryFn = () => sendPostRequest(`${selectedCpu} with ${selectedGpu} with ${selectedRam}`);
      
      queryClient.prefetchQuery({
        queryKey,
        queryFn,
        staleTime: 1000 * 60 * 5, // 5 minutes
      });
      
      console.log('Prefetching calculation for:', selectedCpu, selectedGpu, selectedRam);
      
      // 2. Page prefetching with Next.js
      router.prefetch('/calculate');
      console.log('Prefetching /calculate page');
    }
  }, [selectedCpu, selectedGpu, selectedRam, queryClient, router]);
  
  // Setup mutation for submission
  const mutation = useMutation({
    mutationFn: (params: string) => sendPostRequest(params),
    onSuccess: (response: PredictionResponse) => {
      console.log('Calculation completed:', response);
      
      // Create the bottleneck data object
      const bottleneckData: BottleneckData = {
        cpu: selectedCpu,
        gpu: selectedGpu,
        ram: selectedRam,
        recommendations: response.recomendation || [],
        result: {
          agreement: response.result.agreement || false,
          components: response.result.components || {
            CPU: 'average',
            GPU: 'average',
            RAM: 'average'
          },
          hardware_analysis: {
            bottleneck: response.result.hardware_analysis?.bottleneck || "",
            percentile_ranks: (response.result.hardware_analysis?.percentile_ranks as Record<string, number>) || {} as Record<string, number>,
            raw_benchmark_scores: (response.result.hardware_analysis?.raw_benchmark_scores as Record<string, number>) || {} as Record<string, number>,
            estimated_impact: response.result.hardware_analysis?.estimated_impact || { CPU: 0, GPU: 0, RAM: 0 }
          }
        },
        timestamp: new Date().toISOString()
      };
      
      // Store the response data in Redux
      dispatch(setBottleneckData(bottleneckData));
      
      // If we haven't shown the animation for at least 2 seconds, wait the remaining time
      setTimeout(() => {
        setIsLoading(false);
        setIsOpen(false);
        router.push('/calculate');
      });
    },
    onError: (error) => {
      console.error('Calculation error:', error);
      // Display error for a brief moment then return to form
      setIsLoading(false);
    }
  });
  
  const handleModalOpen = () => {
    setIsOpen(true);
    // Add overflow-visible class to body when modal opens
    document.body.classList.add('overflow-visible');
  };
  
  const handleModalClose = () => {
    setIsOpen(false);
    // Remove overflow-visible class from body when modal closes
    document.body.classList.remove('overflow-visible');
  };

  const clearSelections = () => {
    setSelectedCpu("");
    setSelectedGpu("");
    setSelectedRam("");
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
      <div className="w-full">
        <MainButton 
          onClick={() => handleModalOpen()}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white text-lg font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          Calculate Bottleneck
        </MainButton>
      </div>
      
      <Modal.Content isBlurred>
        <Modal.Header>
          <Modal.Title>Select Hardware Components</Modal.Title>
          <Modal.Description>
            Choose your CPU and GPU to calculate potential bottlenecks.
          </Modal.Description>
        </Modal.Header>
        <Form onSubmit={(e) => {
          // Prevent default form submission behavior
          e.preventDefault();
          
          // Show loading state
          setIsLoading(true);
          
          // Use our prefetched data via mutation
          mutation.mutate(`${selectedCpu} with ${selectedGpu} with ${selectedRam}`);
        }}>
          <Modal.Body className="pb-1 !overflow-visible">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10">
                {/* Render animation only when data is loaded and on client */}
                <div className="w-48 h-48">
                  {loadingAnimation && typeof window !== 'undefined' ? (
                    <Lottie 
                      animationData={loadingAnimation}
                      loop={true}
                      autoplay={true}
                      style={{ width: '100%', height: '100%' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                </div>
                <p className="text-lg text-blue-700 font-medium mt-4">Calculating Bottleneck...</p>
                <p className="text-sm text-gray-500 mt-2">This will take just a moment</p>
              </div>
            ) : (
              <>
                <CpuMenu selectedCpu={selectedCpu} setSelectedCpu={setSelectedCpu} />
                <GpuMenu selectedGpu={selectedGpu} setSelectedGpu={setSelectedGpu} />
                <RamMenu selectedRam={selectedRam} setSelectedRam={setSelectedRam} />
                
                {/* Selected Components Display */}
                {(selectedCpu || selectedGpu || selectedRam) && (
                  <div className="mt-6 p-3 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-blue-800 dark:text-blue-300">Selected Components</h3>
                      <button 
                        type="button"
                        className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
                        onClick={clearSelections}
                      >
                        Clear All
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {selectedCpu && (
                        <div className="flex items-center justify-between p-2 border border-blue-300 dark:border-blue-700 bg-white dark:bg-gray-800 rounded-md">
                          <div>
                            <span className="text-xs text-blue-500 dark:text-blue-400 block">CPU</span>
                            <span className="truncate font-medium dark:text-gray-200">{selectedCpu}</span>
                          </div>
                          <button 
                            type="button"
                            className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
                            onClick={() => setSelectedCpu("")}
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                      
                      {selectedGpu && (
                        <div className="flex items-center justify-between p-2 border border-blue-300 dark:border-blue-700 bg-white dark:bg-gray-800 rounded-md">
                          <div>
                            <span className="text-xs text-blue-500 dark:text-blue-400 block">GPU</span>
                            <span className="truncate font-medium dark:text-gray-200">{selectedGpu}</span>
                          </div>
                          <button 
                            type="button"
                            className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
                            onClick={() => setSelectedGpu("")}
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                      
                      {selectedRam && (
                        <div className="flex items-center justify-between p-2 border border-blue-300 dark:border-blue-700 bg-white dark:bg-gray-800 rounded-md">
                          <div>
                            <span className="text-xs text-blue-500 dark:text-blue-400 block">RAM</span>
                            <span className="truncate font-medium dark:text-gray-200">{selectedRam}</span>
                          </div>
                          <button 
                            type="button"
                            className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
                            onClick={() => setSelectedRam("")}
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close onPress={handleModalClose}>Cancel</Modal.Close>
            {!isLoading && (
              <Button 
                type="submit" 
                isDisabled={!selectedCpu || !selectedGpu || !selectedRam}
                className={!selectedCpu || !selectedGpu || !selectedRam ? "opacity-50 cursor-not-allowed" : ""}
              >
                {selectedCpu && selectedGpu && selectedRam ? "Calculate" : "Calculate"}
              </Button>
            )}
          </Modal.Footer>
        </Form>
      </Modal.Content>
    </Modal>
  );
}

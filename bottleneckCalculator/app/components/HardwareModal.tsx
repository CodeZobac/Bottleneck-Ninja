"use client"
import React from "react"
import { Button, Form, Modal} from "./ui"
import { GpuMenu } from "./ModalMenuGpu"
import { CpuMenu } from "./ModalMenuCpu"
import { useState, useEffect } from "react"
import { RamMenu } from "./ModalMenuRam"
import Lottie from 'lottie-react'
import apiCall from "../api/apiCall"
import { useRouter } from 'next/navigation'

export function HardwareModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCpu, setSelectedCpu] = useState<string>("");
  const [selectedGpu, setSelectedGpu] = useState<string>("");
  const [selectedRam, setSelectedRam] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAnimation, setLoadingAnimation] = useState<any>(null);
  const router = useRouter();
  
  // Load the animation data
  useEffect(() => {
    // Only load the animation when needed
    if (isLoading) {
      try {
        import('/public/isLoading.json')
          .then(animData => {
            setLoadingAnimation(animData.default);
          })
          .catch(err => {
            console.error("Failed to load animation:", err);
            // Provide fallback or continue without animation
          });
      } catch (error) {
        console.error("Error importing animation:", error);
      }
    }
  }, [isLoading]);
  
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
      <div className="flex justify-center items-center w-full my-4">
        <Button onPress={handleModalOpen}>Calculate Bottleneck</Button>
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
          
          // Store selections before clearing
          const cpuSelection = selectedCpu;
          const gpuSelection = selectedGpu;
          const ramSelection = selectedRam;
          
          // Clear selections and show loading state
          clearSelections();
          setIsLoading(true);
          
          // Call the API with the selected components
          apiCall.post(`${cpuSelection} with ${gpuSelection} with ${ramSelection}`)
            .then((response) => {
              console.log(response);
              
              // Store the response data in localStorage for the results page
              localStorage.setItem('bottleneckData', JSON.stringify({
                cpu: cpuSelection,
                gpu: gpuSelection,
                ram: ramSelection,
                recomendation: response.recomendation || [],
                result: {
                  agreement: response.result.agreement || false,
                  components: response.result.components || {
                    CPU: 'average',
                    GPU: 'average',
                    RAM: 'average'
                  },
                  hardware_analysis: response.result.hardware_analysis || {
                    bottleneck: "",
                    percentile_ranks: {},
                    raw_benchmark_scores: {},
                    estimated_impact: { CPU: 0, GPU: 0, RAM: 0 }
                  }
                },
                timestamp: new Date().toISOString()
              }));

              // Wait a moment before redirecting (for loading animation to be seen)
              setTimeout(() => {
                setIsLoading(false);
                setIsOpen(false);
                // Redirect to results page
                router.push('/calculate');
              }, 2000);
            })
            .catch((error) => {
              console.error(error);
              // Display error for 2 seconds then return to form
              setTimeout(() => {
                setIsLoading(false);
              }, 2000);
            });
        }}>
          <Modal.Body className="pb-1 !overflow-visible">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10">
                {/* Render animation only when data is loaded */}
                <div className="w-48 h-48">
                  {loadingAnimation ? (
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
                  <div className="mt-6 p-3 border border-blue-200 bg-blue-50 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-blue-800">Selected Components</h3>
                      <button 
                        type="button"
                        className="text-blue-500 hover:text-blue-700 text-sm"
                        onClick={clearSelections}
                      >
                        Clear All
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {selectedCpu && (
                        <div className="flex items-center justify-between p-2 border border-blue-300 bg-white rounded-md">
                          <div>
                            <span className="text-xs text-blue-500 block">CPU</span>
                            <span className="truncate font-medium">{selectedCpu}</span>
                          </div>
                          <button 
                            type="button"
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => setSelectedCpu("")}
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                      
                      {selectedGpu && (
                        <div className="flex items-center justify-between p-2 border border-blue-300 bg-white rounded-md">
                          <div>
                            <span className="text-xs text-blue-500 block">GPU</span>
                            <span className="truncate font-medium">{selectedGpu}</span>
                          </div>
                          <button 
                            type="button"
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => setSelectedGpu("")}
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                      
                      {selectedRam && (
                        <div className="flex items-center justify-between p-2 border border-blue-300 bg-white rounded-md">
                          <div>
                            <span className="text-xs text-blue-500 block">RAM</span>
                            <span className="truncate font-medium">{selectedRam}</span>
                          </div>
                          <button 
                            type="button"
                            className="text-blue-500 hover:text-blue-700"
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
                Calculate
              </Button>
            )}
          </Modal.Footer>
        </Form>
      </Modal.Content>
    </Modal>
  );
}

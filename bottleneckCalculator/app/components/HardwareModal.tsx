"use client"

import { Button, Form, Modal, TextField } from "./ui"
import { GpuMenu } from "./ModalMenuGpu"
import { CpuMenu } from "./ModalMenuCpu"
import { useState } from "react"

export function HardwareModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCpu, setSelectedCpu] = useState<string>("");
  const [selectedGpu, setSelectedGpu] = useState<string>("");
  
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
        <Form onSubmit={() => {}}>
          <Modal.Body className="pb-1 !overflow-visible">
            <CpuMenu selectedCpu={selectedCpu} setSelectedCpu={setSelectedCpu} />
            <GpuMenu selectedGpu={selectedGpu} setSelectedGpu={setSelectedGpu} />
            {/* Selected Components Display */}
            {(selectedCpu || selectedGpu) && (
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
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close onPress={handleModalClose}>Cancel</Modal.Close>
            <Button 
              type="submit" 
              isDisabled={!selectedCpu || !selectedGpu}
              className={!selectedCpu || !selectedGpu ? "opacity-50 cursor-not-allowed" : ""}
            >
              Calculate
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Content>
    </Modal>
  );
}

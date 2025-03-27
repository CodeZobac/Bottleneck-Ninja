/* eslint-disable react/no-unescaped-entities */
"use client"

import React, { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * FirstTimeHelper component provides a tutorial for first-time users.
 * It shows a series of modals that point to key UI elements to guide the user.
 */
export default function FirstTimeHelper() {
  // User session
  const { data: session } = useSession();
  
  // Track which tutorial step we're on
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  
  // Track if the dropdown menu is open
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Additional state to track if tutorial has been skipped
  const [skippedTutorial, setSkippedTutorial] = useState(false);
  
  // Track previous dropdown state to detect changes
  const prevDropdownOpenRef = useRef(false);
  
  // Define the refs for modal positioning with proper types
  const modal1Ref = useRef<HTMLDivElement>(null);
  const modal2Ref = useRef<HTMLDivElement>(null);
  const modal3Ref = useRef<HTMLDivElement>(null);
  
  // Check if the user has a profile
  useEffect(() => {
    // Check localStorage first to see if the tutorial was skipped before
    const tutorialSkipped = localStorage.getItem('tutorialSkipped') === 'true';
    if (tutorialSkipped) {
      setSkippedTutorial(true);
      return;
    }
    
    // Only run this if user is logged in and tutorial hasn't been skipped
    if (session?.user && !skippedTutorial) {
      checkUserProfile();
    }
  }, [session, skippedTutorial]);
  
  // Function to check if user has a profile
  const checkUserProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      const data = await response.json();
      
      // If no profile exists, start the tutorial
      if (!data.preferences) {
        console.log("No profile found, starting tutorial");
        // Start from step 1
        setCurrentStep(1);
      }
    } catch (error) {
      console.error('Error checking user profile:', error);
    }
  };
  
  // Set up mutation observer to detect dropdown menu opening/closing
  useEffect(() => {
    if (currentStep === null) return;
    
    // Create a mutation observer to watch for DOM changes
    const observer = new MutationObserver(() => {
      // Delay the check to ensure the DOM has updated completely
      setTimeout(() => {
        // Look for any visible dropdown content using multiple selectors that might match
        const dropdownSelectors = [
          '[data-radix-popper-content-wrapper]', 
          '.menu-content[data-state="open"]',
          '[role="menu"]',
          '[aria-label*="menu" i][aria-expanded="true"]',
          '.Menu-Content' // Your custom Menu component might use this class
        ];
        
        const dropdownContentEls = dropdownSelectors
          .map(selector => document.querySelectorAll(selector))
          .filter(nodeList => nodeList.length > 0);
        
        // If any dropdown content is found, consider the dropdown open
        const isOpen = dropdownContentEls.length > 0;
        
        if (isDropdownOpen !== isOpen) {
          console.log("Dropdown state changed:", isOpen ? "open" : "closed");
          setIsDropdownOpen(isOpen);
        }
      }, 100);
    });
    
    // Start observing the document body for changes
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class', 'data-state', 'aria-expanded']
    });
    
    // Also set up a click listener on the document to detect dropdown interactions
    const handleClick = () => {
      // Check dropdown state after click
      setTimeout(() => {
        const dropdownSelectors = [
          '[data-radix-popper-content-wrapper]', 
          '.menu-content[data-state="open"]',
          '[role="menu"]',
          '[aria-label*="menu" i][aria-expanded="true"]',
          '.Menu-Content'
        ];
        
        const dropdownContentEls = dropdownSelectors
          .map(selector => document.querySelectorAll(selector))
          .filter(nodeList => nodeList.length > 0);
        
        const isOpen = dropdownContentEls.length > 0;
        
        if (isDropdownOpen !== isOpen) {
          setIsDropdownOpen(isOpen);
        }
      }, 100);
    };
    
    document.addEventListener('click', handleClick);
    
    // This is a fallback in case the mutation observer misses something
    const intervalId = setInterval(() => {
      const dropdownSelectors = [
        '[data-radix-popper-content-wrapper]', 
        '.menu-content[data-state="open"]',
        '[role="menu"]',
        '[aria-label*="menu" i][aria-expanded="true"]',
        '.Menu-Content'
      ];
      
      const dropdownContentEls = dropdownSelectors
        .map(selector => document.querySelectorAll(selector))
        .filter(nodeList => nodeList.length > 0);
      
      const isOpen = dropdownContentEls.length > 0;
      
      if (isDropdownOpen !== isOpen) {
        setIsDropdownOpen(isOpen);
      }
    }, 500);
    
    // Clean up observer and event listener on unmount
    return () => {
      observer.disconnect();
      document.removeEventListener('click', handleClick);
      clearInterval(intervalId);
    };
  }, [currentStep, isDropdownOpen]);
  
  // Listen for window resize events to update positions
  useEffect(() => {
    if (currentStep === null) return;
    
    // No need to track window resize since we're using absolute positioning
    
    return () => {
      // No cleanup needed
    };
  }, [currentStep]);
  
  // Track dropdown state changes - enhanced tracking for better detection
  useEffect(() => {
    // Only progress from step 1 to step 2 when dropdown opens
    if (currentStep === 1 && isDropdownOpen) {
      // Add a small delay to ensure the dropdown is fully open
      const timerId = setTimeout(() => {
        console.log("Dropdown opened, advancing to step 2");
        setCurrentStep(2);
      }, 200);
      
      return () => clearTimeout(timerId);
    }
    
    // Update ref value
    prevDropdownOpenRef.current = isDropdownOpen;
  }, [isDropdownOpen, currentStep]);
  
  // Handle skipping the tutorial
  const skipTutorial = () => {
    setCurrentStep(null);
    setSkippedTutorial(true);
    
    // Store in localStorage that user skipped the tutorial
    localStorage.setItem('tutorialSkipped', 'true');
  };
  
  // If user doesn't have a session or tutorial was skipped, don't show anything
  if (!session?.user || currentStep === null || skippedTutorial) {
    return null;
  }
  
  // Use fixed coordinates for modal positioning based on user input
  const getFixedModalPosition = (step: number) => {
    switch (step) {
      case 1:
        // Position modal 1 with arrow tip at X: 1864, Y: 90
        return {
          top: '100px', // Position below the coordinate Y: 90
          right: '105px', // Position to the left of coordinate X: 1864
        };
      
      case 2:
        // Position modal 2 with arrow tip at X: 1618, Y: 206
        return {
          top: '185px', // Position below the coordinate Y: 206
          right: '300px', // Position to the left of coordinate X: 1618
        };
      
      case 3:
        return {
          top: "890px", // Position below the button
          left: "43.5%", // Center horizontally
        };
      
      default:
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
  };
  
  // Get fixed arrow styles based on user coordinates
  const getFixedArrowStyle = (step: number) => {
    switch (step) {
      case 1:
        // Arrow pointing to X: 1864, Y: 90 (top-right corner)
        return {
          position: 'absolute' as const,
          top: '-15px',
          right: '30px', // Align with the right side of the modal
          width: '30px',
          height: '20px',
          borderLeft: '15px solid transparent',
          borderRight: '15px solid transparent',
          borderBottom: '15px solid #3b82f6',
        };
      
      case 2:
        // Arrow pointing to X: 1618, Y: 206 (right side, top)
        return {
          position: 'absolute' as const,
          right: '-35px', // Position on the right side of the modal
          width: '30px',
          height: '20px',
          transform: 'rotate(90deg)', // Rotate to point to the right
          borderLeft: '15px solid transparent',
          borderRight: '15px solid transparent',
          borderBottom: '15px solid #3b82f6',
        };
      
      case 3:
        return {
          position: 'absolute' as const,
          bottom: '-35px',
          left: '130px',
          transform: 'translateX(-50%)' as const,
          width: '30px',
          height: '20px',
          rotate: '180deg',
          borderLeft: '15px solid transparent',
          borderRight: '15px solid transparent',
          borderBottom: '15px solid #3b82f6',
        };
      
      default:
        return {
          position: 'absolute' as const,
          top: '-15px',
          left: '50%',
          transform: 'translateX(-50%)' as const,
          width: '30px',
          height: '20px',
          borderLeft: '15px solid transparent',
          borderRight: '15px solid transparent',
          borderBottom: '15px solid #3b82f6',
        };
    }
  };
  
  return (
    <AnimatePresence>
      {currentStep === 1 && (
        <motion.div
          ref={modal1Ref}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed z-50 w-80 bg-blue-500 rounded-lg shadow-lg text-white p-4"
          style={getFixedModalPosition(1)}
        >
          <div style={getFixedArrowStyle(1)} />
          <button 
            className="absolute top-2 right-2 text-white hover:text-gray-200"
            onClick={skipTutorial}
          >
            <X size={18} />
          </button>
          <h3 className="text-lg font-bold mb-2">Welcome to Bottleneck Ninja!</h3>
          <p className="mb-3">Click on your profile icon to access saved builds and personalize your experience.</p>
          <div className="text-xs text-blue-100 mt-4">
            Click the dropdown to continue the tutorial
          </div>
        </motion.div>
      )}
      
      {currentStep === 2 && (
        <motion.div
          ref={modal2Ref}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed z-50 w-80 bg-blue-500 rounded-lg shadow-lg text-white p-4"
          style={getFixedModalPosition(2)}
        >
          <div style={getFixedArrowStyle(2)} />
          <button 
            className="absolute top-2 right-2 text-white hover:text-gray-200"
            onClick={skipTutorial}
          >
            <X size={18} />
          </button>
          <h3 className="text-lg font-bold mb-2">Set Up Your Profile</h3>
          <p className="mb-3">Click on "Profile" to set your budget and hardware preferences for personalized predictions.</p>
          <button
            className="bg-white text-blue-500 px-3 py-1 rounded text-sm font-medium mt-2"
            onClick={() => setCurrentStep(3)}
          >
            Next Tip
          </button>
        </motion.div>
      )}
      
      {currentStep === 3 && (
        <motion.div
          ref={modal3Ref}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed z-50 w-80 bg-blue-500 rounded-lg shadow-lg text-white p-4"
          style={getFixedModalPosition(3)}
        >
          <div style={getFixedArrowStyle(3)} />
          <button 
            className="absolute top-2 right-2 text-white hover:text-gray-200"
            onClick={skipTutorial}
          >
            <X size={18} />
          </button>
          <h3 className="text-lg font-bold mb-2">Start Calculating</h3>
          <p className="mb-3">Use the Calculate feature to analyze your hardware and get recommendations.</p>
          <button
            className="bg-white text-blue-500 px-3 py-1 rounded text-sm font-medium mt-2"
            onClick={skipTutorial}
          >
            Got It!
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
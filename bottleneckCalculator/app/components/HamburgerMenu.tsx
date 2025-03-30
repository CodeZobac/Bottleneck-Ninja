"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { signIn, signOut, useSession } from "next-auth/react";
import {
  IconDeviceDesktop,
  IconLogout,
  IconMoon,
  IconSun,
  IconTrash,
} from "justd-icons";
import { useRouter } from "next/navigation";
import { ConfirmationModal } from "./ConfirmationModal";
import { useToast } from "./ui/toast";
import { Avatar } from "./ui";

interface HamburgerMenuProps {
  /** Optional callback when menu is toggled */
  onToggle?: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ 
  onToggle
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const { data: session } = useSession();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToast();
  
  // Create prefetch handlers
  const prefetchBuilds = () => {
    router.prefetch('/builds');
  };
  
  const prefetchProfile = () => {
    router.prefetch('/profile');
  };
  
  const toggleNavbar = () => {
    setIsOpen(!isOpen);
    document.body.classList.toggle('overflow-hidden');
    if (onToggle) onToggle();
  };

  // Close menu when ESC key is pressed
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        toggleNavbar();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      
      const response = await fetch('/api/profile', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete account');
      }
      
      // Show success message
      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted",
        variant: "success",
      });
      
      // Sign out and redirect to home page
      signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete account",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      {/* Hamburger Button with Wave Animation */}
      <button 
        className={`flex flex-col justify-center items-start py-3 px-3 pl-0 bg-transparent border-none cursor-pointer ${isOpen ? 'hamburger-wave-paused' : ''}`}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        onClick={toggleNavbar}
      >
        <span className="hamburger-wave-line line-1 block w-[30px] h-[2px] bg-current mb-[4px]"></span>
        <span className="hamburger-wave-line hamburger-wave-line-2 block w-[30px] h-[2px] bg-current mb-[4px]"></span>
        <span className="hamburger-wave-line hamburger-wave-line-3 block w-[30px] h-[2px] bg-current"></span>
      </button>

      {/* Mobile Navigation Menu */}
      <nav className={`fixed bg-bg top-0 -left-[300px] bottom-0 max-w-[300px] w-full px-6 pb-[50px] overflow-y-auto z-50 transition-transform duration-300 border-r border-border ${isOpen ? 'transform translate-x-[300px]' : ''}`}>
        <div className="flex justify-end pt-6">
          <button 
            className="p-1 text-fg hover:text-primary transition-colors"
            aria-label="Close menu"
            onClick={toggleNavbar}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-8 mb-10">
          <Link href="/" onClick={toggleNavbar} className="block mx-auto w-40 h-16 relative">
            <Image 
              src={resolvedTheme === 'dark' ? "/name-dark.svg" : "/name.svg"} 
              alt="Bottleneck Ninja"
              fill
              style={{ objectFit: 'contain' }}
            />
          </Link>
        </div>

        <ul className="space-y-4 mb-8 border-b border-border pb-4">
          <li>
            <Link
              href="/"
              className="block py-2 px-2 hover:text-primary transition-colors"
              onClick={toggleNavbar}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/calculate"
              className="block py-2 px-2 hover:text-primary transition-colors"
              onClick={toggleNavbar}
            >
              Calculate
            </Link>
          </li>
          <li>
            <Link
              href="/builds"
              className="block py-2 px-2 hover:text-primary transition-colors"
              onClick={toggleNavbar}
              onMouseEnter={prefetchBuilds}
            >
              My Builds
            </Link>
          </li>
          <li>
            <Link
              href="/profile"
              className="block py-2 px-2 hover:text-primary transition-colors"
              onClick={toggleNavbar}
              onMouseEnter={prefetchProfile}
            >
              Profile
            </Link>
          </li>
        </ul>

        {!session ? (
          <div className="px-2 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Avatar 
                alt="Guest" 
                size="medium" 
                src="/icon.jpg"
                className="bg-gray-200" 
              />
              <span className="text-sm">Guest (Not signed in)</span>
            </div>
            
            <button 
              onClick={() => {
                toggleNavbar();
                signIn("google");
              }}
              className="block w-full text-left py-2 px-2 hover:text-primary transition-colors"
            >
              Sign In / Register
            </button>
            
            <div className="pt-2 border-t border-border">
              <p className="text-sm mb-2">Theme</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setTheme("system")}
                  className={`p-2 rounded-md ${resolvedTheme === "system" ? "bg-primary/20 text-primary" : ""}`}
                >
                  <IconDeviceDesktop />
                </button>
                <button 
                  onClick={() => setTheme("dark")}
                  className={`p-2 rounded-md ${resolvedTheme === "dark" ? "bg-primary/20 text-primary" : ""}`}
                >
                  <IconMoon />
                </button>
                <button 
                  onClick={() => setTheme("light")}
                  className={`p-2 rounded-md ${resolvedTheme === "light" ? "bg-primary/20 text-primary" : ""}`}
                >
                  <IconSun />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-2 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Avatar 
                alt={session.user?.name || "User"}
                size="medium" 
                src={session.user?.image}
                className="bg-gray-200" 
              />
              <div>
                <span className="block text-sm">{session.user?.name}</span>
                <span className="text-xs text-muted-fg">{session.user?.email}</span>
              </div>
            </div>
            
            <div className="pt-2 border-t border-border">
              <p className="text-sm mb-2">Theme</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setTheme("system")}
                  className={`p-2 rounded-md ${resolvedTheme === "system" ? "bg-primary/20 text-primary" : ""}`}
                >
                  <IconDeviceDesktop />
                </button>
                <button 
                  onClick={() => setTheme("dark")}
                  className={`p-2 rounded-md ${resolvedTheme === "dark" ? "bg-primary/20 text-primary" : ""}`}
                >
                  <IconMoon />
                </button>
                <button 
                  onClick={() => setTheme("light")}
                  className={`p-2 rounded-md ${resolvedTheme === "light" ? "bg-primary/20 text-primary" : ""}`}
                >
                  <IconSun />
                </button>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border">
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="block w-full text-left py-2 px-2 text-red-400 hover:text-red-500 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <IconTrash className="text-red-400" />
                  Delete Account
                </span>
              </button>
              <button 
                onClick={() => signOut()}
                className="block w-full text-left py-2 px-2 hover:text-primary transition-colors"
              >
                <span className="flex items-center gap-2">
                  <IconLogout />
                  Log out
                </span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleNavbar}
        aria-hidden="true"
      ></div>
      
      <ConfirmationModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed."
        confirmButtonText={isDeleting ? "Deleting..." : "Delete Account"}
        confirmButtonIntent="danger"
        cancelButtonText="Cancel"
        icon="error"
      />
      
      {/* CSS Animation styles embedded in component */}
      <style jsx>{`
        @keyframes menuBtn {
          0% { transform: scaleX(1); }    /* Start at full width */
          100% { transform: scaleX(0.5); } /* Shrink to half width */
        }

        .hamburger-wave-line {
          transform-origin: left;
          animation: menuBtn 400ms ease-in-out alternate infinite;
        }

        .hamburger-wave-line-2 {
          animation-delay: 150ms;
        }

        .hamburger-wave-line-3 {
          animation-delay: 300ms;
        }

        /* Stop animation when menu is open */
        .hamburger-wave-paused .hamburger-wave-line {
          animation-play-state: paused;
          /* When open, transform lines to X */
          transform: scaleX(1);
        }
      `}</style>
    </>
  );
};

export default HamburgerMenu;
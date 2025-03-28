"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/app/components/ui/button";
import { HardwareBuild } from "./types";
import { BuildAnalysis } from "./components/BuildAnalysis";
import Link from "next/link";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { HeaderLogo } from "../components/HeaderLogo";


export default function BuildsPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session, status } = useSession();
  const router = useRouter();
 
  const [builds, setBuilds] = useState<HardwareBuild[]>([]);
  const [selectedBuild, setSelectedBuild] = useState<HardwareBuild | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [expandedBuild, setExpandedBuild] = useState<string | null>(null);

  // Fetch all builds for the current user
  useEffect(() => {
    const fetchBuilds = async () => {
      try {
        // If not authenticated, redirect to sign in
        if (status === "unauthenticated") {
          router.push("/auth/signin");
          return;
        }
        
        if (status === "loading") {
          return;
        }
        // User is authenticated, fetch builds
        const response = await fetch("/api/builds");
        if (!response.ok) {
          throw new Error("Failed to fetch builds");
        }
        
        const data = await response.json();
        setBuilds(data.builds || []);
        
        // Select the first build by default if available
        if (data.builds && data.builds.length > 0) {
          setSelectedBuild(data.builds[0]);
        }
      } catch (error) {
        console.error("Error fetching builds:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBuilds();
  }, [status, router]);

  // Toggle build expansion
  const toggleExpand = (buildId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedBuild(expandedBuild === buildId ? null : buildId);
  };

  // Handle delete build
  const handleDeleteBuild = async (buildId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (!buildId || isDeleting) return;
    
    try {
      setIsDeleting(buildId);
      
      const response = await fetch(`/api/builds/${buildId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete build');
      }
      
      // Update builds list
      setBuilds(builds.filter(build => build.id !== buildId));
      
      // If the deleted build was selected, select another one
      if (selectedBuild?.id === buildId) {
        const remainingBuilds = builds.filter(build => build.id !== buildId);
        setSelectedBuild(remainingBuilds.length > 0 ? remainingBuilds[0] : null);
      }
      
      // Reset expanded state if deleted
      if (expandedBuild === buildId) {
        setExpandedBuild(null);
      }
      
    } catch (error) {
      console.error('Error deleting build:', error);
      alert('Failed to delete build. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  // Redirect to sign in if not authenticated
  if (status === "unauthenticated") {
    return null; // Will redirect in the useEffect
  }
  
  // Handle loading state
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xl text-gray-700 dark:text-gray-200">Loading your builds...</p>
      </div>
    );
  }
  
  // Handle no builds
  if (builds.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-blue-50 to-gray-50 dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">No Builds Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            You haven't saved any PC builds yet. Create a build to get started!
          </p>
          <Link href="/" passHref>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition-colors">
              Create Your First Build
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  // Format build name
  const formatBuildName = (build: HardwareBuild) => {
    return `${build.cpu} with ${build.gpu}`;
  };

  // Format RAM in a more readable way
  const formatRAM = (ram: string) => {
    return ram;
  };
  
  // Format date in a more readable way
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
        <Link href={"/"}>
          <HeaderLogo style={{ 
            position: 'absolute', 
            top: '1.5rem', 
            left: 'calc(30vw - 35rem)', 
            marginLeft: '-3rem',
            paddingBottom: '1rem',
          }} />
        </Link>
        {/* Left Sidebar - Build List */}
        <div className="w-full md:w-1/3 lg:w-1/4 md:mt-[132px]">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 bg-blue-600 dark:bg-blue-800 text-white">
              <h2 className="text-xl font-bold">Your PC Builds</h2>
              <p className="text-sm opacity-90">Select a build to view details</p>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              {builds.map((build) => (
                <div 
                  key={build.id} 
                  className={`border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-all duration-200 ${
                    selectedBuild?.id === build.id ? "bg-blue-50 dark:bg-blue-900/30" : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <div 
                    className="p-4 cursor-pointer relative"
                    onClick={() => setSelectedBuild(build)}
                  >
                    <div className="pr-8">
                      <p className="font-medium text-gray-800 dark:text-gray-200 truncate flex items-center">
                        {formatBuildName(build)}
                        <span className="ml-1 text-gray-400 dark:text-gray-500">...</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDate(build.created_at || "")}
                      </p>
                    </div>
                    <button 
                      onClick={(e) => toggleExpand(build.id as string, e)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      aria-label={expandedBuild === build.id ? "Collapse" : "Expand"}
                    >
                      {expandedBuild === build.id ? (
                        <ChevronUp size={18} className="text-gray-500 dark:text-gray-400" />
                      ) : (
                        <ChevronDown size={18} className="text-gray-500 dark:text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  {/* Expanded content */}
                  {expandedBuild === build.id && (
                    <div className="px-4 pb-4 pt-2 bg-gray-50 dark:bg-gray-800/70 border-t border-gray-100 dark:border-gray-700 animate-fadeIn">
                      <div className="mb-3 space-y-2">
                        <p className="text-sm text-gray-600 dark:text-gray-300"><span className="font-medium">CPU:</span> {build.cpu}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300"><span className="font-medium">GPU:</span> {build.gpu}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300"><span className="font-medium">RAM:</span> {formatRAM(build.ram)}</p>
                      </div>
                      <div className="flex justify-end items-center pt-2 border-t border-gray-200 dark:border-gray-700">

                        <button
                          onClick={(e) => handleDeleteBuild(build.id as string, e)}
                          disabled={isDeleting === build.id}
                          className="flex items-center align-right text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 font-medium transition-colors py-1 px-2 rounded hover:bg-red-50 dark:hover:bg-red-900/30"
                        >
                          <Trash2 size={14} className="mr-1" />
                          {isDeleting === build.id ? "Deleting..." : "Delete Build"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <Link href="/" passHref>
              <Button className="w-full bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600">
                Create New Build
              </Button>
            </Link>
          </div>
        </div>
        {/* Right Content - Build Analysis */}
        <div className="w-full md:w-2/3 lg:w-3/4">
          {selectedBuild ? (
            <BuildAnalysis build={selectedBuild} />
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
              <p className="text-gray-600 dark:text-gray-300">Select a build to view its analysis</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Add animation styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; max-height: 0; overflow: hidden; }
          to { opacity: 1; max-height: 300px; overflow: visible; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
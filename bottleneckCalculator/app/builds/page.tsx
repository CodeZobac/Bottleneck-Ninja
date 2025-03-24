"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/app/components/ui/button";
import { HardwareBuild } from "./types";
import { BuildAnalysis } from "./components/BuildAnalysis";
import Link from "next/link";

export default function BuildsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [builds, setBuilds] = useState<HardwareBuild[]>([]);
  const [selectedBuild, setSelectedBuild] = useState<HardwareBuild | null>(null);
  const [loading, setLoading] = useState(true);

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

  // Redirect to sign in if not authenticated
  if (status === "unauthenticated") {
    return null; // Will redirect in the useEffect
  }

  // Handle loading state
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xl text-gray-700">Loading your builds...</p>
      </div>
    );
  }

  // Handle no builds
  if (builds.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-blue-50 to-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Builds Found</h1>
          <p className="text-gray-600 mb-6">
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
    return `${build.cpu} with ${build.gpu} and ${build.ram}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
        {/* Left Sidebar - Build List */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 bg-blue-600 text-white">
              <h2 className="text-xl font-bold">Your PC Builds</h2>
              <p className="text-sm opacity-90">Select a build to view details</p>
            </div>
            <div className="divide-y max-h-[70vh] overflow-y-auto">
              {builds.map((build) => (
                <button
                  key={build.id}
                  onClick={() => setSelectedBuild(build)}
                  className={`w-full text-left p-4 hover:bg-blue-50 transition-colors ${
                    selectedBuild?.id === build.id ? "bg-blue-100" : ""
                  }`}
                >
                  <p className="font-medium text-gray-800 truncate">
                    {formatBuildName(build)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(build.created_at || "").toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <Link href="/" passHref>
              <Button className="w-full bg-gray-600 hover:bg-gray-700">
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
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <p className="text-gray-600">Select a build to view its analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
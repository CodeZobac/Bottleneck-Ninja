'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import FirstTimeSetup from "./FirstTimeSetup";
import Image from "next/image";
import { supabase } from "@/lib/database/supabase";


export default function ProfilePage() {
  const { data: session, status } = useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userPreferences, setUserPreferences] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
  }, [status]);

  // Fetch user preferences from Supabase
  useEffect(() => {
    async function fetchUserPreferences() {
      if (!session?.user?.email) return;
      
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('email', session.user.email)
        .single();
      
      if (!error && data) {
        setUserPreferences(data);
      }
      setLoading(false);
    }

    if (status === "authenticated") {
      fetchUserPreferences();
    }
  }, [session, status]);

  // Show loading state
  if (status === "loading" || loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  // If user is authenticated but hasn't set preferences
  if (status === "authenticated" && !userPreferences) {
    return <FirstTimeSetup session={session} onComplete={() => setLoading(true)} />;
  }

  // User is authenticated and has preferences
  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center mb-6">
          {session?.user?.image && (
            <Image 
              src={session.user.image} 
              alt="Profile"
              className="h-16 w-16 rounded-full mr-4"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold">{session?.user?.name || 'User'}</h1>
            <p className="text-gray-600">{session?.user?.email}</p>
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <h2 className="text-xl font-semibold mb-4">Your Computer Preferences</h2>
          {userPreferences && (
            <div className="space-y-3">
              <div>
                <span className="font-medium">Budget:</span> ${userPreferences.budget}
              </div>
              <div>
                <span className="font-medium">Usage:</span>
                <ul className="list-disc ml-6 mt-2">
                  {userPreferences.cpu_intensive && <li>CPU Intensive Tasks</li>}
                  {userPreferences.gpu_intensive && <li>GPU Intensive Tasks</li>}
                  {userPreferences.gaming && <li>Gaming</li>}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

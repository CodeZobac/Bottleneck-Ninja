"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function SignIn() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">Sign in to your account</h1>
        <div className="space-y-4">
          <button
            onClick={() => signIn("google", { callbackUrl })}
            className="flex items-center justify-center w-full px-4 py-2 space-x-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}

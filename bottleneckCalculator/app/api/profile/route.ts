import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/auth-options";
import { supabase } from "@/lib/database/supabase";

// Get user profile preferences
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to access your profile" },
        { status: 401 }
      );
    }

    // Get user profile from the profile table
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is 'no rows returned' error
      console.error("Error fetching user profile:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ preferences: data || null }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}

// Save or update user profile preferences
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to save preferences" },
        { status: 401 }
      );
    }

    // Get preference data from request
    const preferencesData = await request.json();
    
    // Check if profile already exists for this user
    const { data: existingProfile, error: findError } = await supabase
      .from("profile")
      .select("id")
      .eq("user_id", session.user.id)
      .maybeSingle();
    
    if (findError && findError.code !== 'PGRST116') {
      console.error("Error checking existing profile:", findError);
      throw new Error("Database error while checking profile");
    }
    
    let resultData;
    
    // If a profile already exists, update it
    if (existingProfile) {
      const { data, error } = await supabase
        .from("profile")
        .update({
          budget: preferencesData.budget,
          cpu_intensive: preferencesData.cpu_intensive,
          gpu_intensive: preferencesData.gpu_intensive,
          gaming: preferencesData.gaming,
          updated_at: new Date().toISOString()
        })
        .eq("id", existingProfile.id)
        .select();
      
      if (error) {
        console.error("Error updating profile:", error);
        throw new Error("Failed to update profile");
      }
      
      resultData = data;
    } 
    // Otherwise create a new profile record
    else {
      const { data, error } = await supabase
        .from("profile")
        .insert({
          user_id: session.user.id,
          budget: preferencesData.budget,
          cpu_intensive: preferencesData.cpu_intensive,
          gpu_intensive: preferencesData.gpu_intensive,
          gaming: preferencesData.gaming
        })
        .select();
      
      if (error) {
        console.error("Error saving profile:", error);
        return NextResponse.json(
          { error: error.message || "Failed to save profile" },
          { status: 500 }
        );
      }
      
      resultData = data;
    }

    return NextResponse.json({ 
      success: true, 
      preferences: resultData[0] 
    }, { status: 200 });
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error in POST /api/profile:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save profile preferences" },
      { status: 500 }
    );
  }
}
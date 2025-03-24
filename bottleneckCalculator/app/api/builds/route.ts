import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/auth-options";
import { supabase } from "@/lib/database/supabase";

// Save a build to the database
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to save builds" },
        { status: 401 }
      );
    }

    // Get build data from request
    const buildData = await request.json();

    // Insert build data into the database
    const { data, error } = await supabase.from("builds").insert({
      user_id: session.user.id,
      cpu: buildData.cpu,
      gpu: buildData.gpu,
      ram: buildData.ram,
      budget: buildData.budget,
      cpu_intensive: buildData.cpu_intensive,
      gpu_intensive: buildData.gpu_intensive,
      gaming: buildData.gaming,
      recommendations: Array.isArray(buildData.recomendation) 
        ? buildData.recomendation 
        : typeof buildData.recomendation === 'string'
          ? buildData.recomendation.split('\\n').filter(item => item.trim().length > 0)
          : [],
      result: buildData.result
    }).select();

    if (error) {
      console.error("Error saving build:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, build: data[0] }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/builds:", error);
    return NextResponse.json(
      { error: "Failed to save build" },
      { status: 500 }
    );
  }
}

// Get all builds for the authenticated user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to view builds" },
        { status: 401 }
      );
    }

    // Get builds for the authenticated user
    const { data, error } = await supabase
      .from("builds")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching builds:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ builds: data }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/builds:", error);
    return NextResponse.json(
      { error: "Failed to fetch builds" },
      { status: 500 }
    );
  }
}
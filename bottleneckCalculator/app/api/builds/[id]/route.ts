import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/auth-options";
import { supabase } from "@/lib/database/supabase";

// Get a single build by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to view builds" },
        { status: 401 }
      );
    }

    const { id } = params;

    // Get the build with the specified ID
    const { data, error } = await supabase
      .from("builds")
      .select("*")
      .eq("id", id)
      .eq("user_id", session.user.id)
      .single();

    if (error) {
      console.error("Error fetching build:", error);
      return NextResponse.json(
        { error: "Build not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({ build: data }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/builds/[id]:", error);
    return NextResponse.json(
      { error: "Failed to fetch build" },
      { status: 500 }
    );
  }
}
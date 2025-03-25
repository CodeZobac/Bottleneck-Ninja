import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/auth-options";
import { supabase } from "@/lib/database/supabase";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to view builds" },
        { status: 401 }
      );
    }

    const id = request.nextUrl.pathname.split('/').pop();
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
    return NextResponse.json({ build: data });
  } catch (error) {
    console.error("Error in GET /api/builds/[id]:", error);
    return NextResponse.json(
      { error: "Failed to fetch build" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to delete builds" },
        { status: 401 }
      );
    }
    
    const id = request.nextUrl.pathname.split('/').pop();
    const { data: buildData, error: buildError } = await supabase
      .from("builds")
      .select("user_id")
      .eq("id", id)
      .single();

    if (buildError || !buildData) {
      console.error("Error fetching build:", buildError);
      return NextResponse.json(
        { error: "Build not found" },
        { status: 404 }
      );
    }

    if (buildData.user_id !== session.user.id) {
      return NextResponse.json(
        { error: "You do not have permission to delete this build" },
        { status: 403 }
      );
    }

    const { error: deleteError } = await supabase
      .from("builds")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error deleting build:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete build" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/builds/[id]:", error);
    return NextResponse.json(
      { error: "Failed to delete build" },
      { status: 500 }
    );
  }
}
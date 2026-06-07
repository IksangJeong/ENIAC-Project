import { NextRequest, NextResponse } from "next/server";
import { serverMembers } from "@/lib/serverDb";

export async function GET(request: NextRequest) {
  try {
    // Artificial loading delay (500ms) for high fidelity HUD experience
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json(serverMembers, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred fetching members directory" },
      { status: 500 }
    );
  }
}

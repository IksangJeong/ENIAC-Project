import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // In production:
    // - Verify JWT token
    // - Clear HttpOnly cookie
    // - Clear user session from database

    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred during logout" },
      { status: 500 }
    );
  }
}

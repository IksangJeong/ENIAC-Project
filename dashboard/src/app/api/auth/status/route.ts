import { NextRequest, NextResponse } from "next/server";
import { serverUsers } from "@/lib/serverDb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "userId parameter is required" },
        { status: 400 }
      );
    }

    const user = serverUsers.find((u) => u.id === userId);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        id: user.id,
        username: user.username,
        isApproved: user.isApproved,
        role: user.role,
        clearance: user.clearance,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred checking approval status" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { serverUsers, serverMembers } from "@/lib/serverDb";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { message: "userId is required for node deactivation" },
        { status: 400 }
      );
    }

    // Find user in server database
    const user = serverUsers.find((u) => u.id === userId);

    if (!user) {
      return NextResponse.json(
        { message: "User node not found" },
        { status: 404 }
      );
    }

    // Deactivate the node
    user.isApproved = false;

    // Remove from active server members list or mark inactive
    const memberIndex = serverMembers.findIndex((m) => m.id === user.id);
    if (memberIndex !== -1) {
      serverMembers.splice(memberIndex, 1);
    }

    return NextResponse.json(
      {
        message: "Node deactivated successfully",
        user: {
          id: user.id,
          username: user.username,
          isApproved: user.isApproved,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred during node deactivation" },
      { status: 500 }
    );
  }
}

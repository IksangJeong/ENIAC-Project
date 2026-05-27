import { NextRequest, NextResponse } from "next/server";
import { serverUsers, serverMembers } from "@/lib/serverDb";

export async function POST(request: NextRequest) {
  try {
    const { username, email, reason } = await request.json();

    // Validation
    if (!email || !username) {
      return NextResponse.json(
        { message: "Node ID (username) and email are required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Find user by username and email in the memory database
    const user = serverUsers.find(
      (u) =>
        u.username.toLowerCase() === username.toLowerCase() &&
        u.email.toLowerCase() === email.toLowerCase()
    );

    if (user) {
      // Mark as recovery requested in both serverUsers and serverMembers
      const timestamp = new Date().toISOString();
      const requestReason = reason || "No reason provided.";

      user.resetRequested = true;
      user.resetRequestReason = requestReason;
      user.resetRequestedAt = timestamp;

      // Update the member registry too (so the store/admin panel gets it)
      const member = serverMembers.find((m) => m.id === user.id);
      if (member) {
        member.resetRequested = true;
        member.resetRequestReason = requestReason;
        member.resetRequestedAt = timestamp;
      }
    }

    // Always return success for security (preventing username harvesting)
    // but with descriptive response details matching HUD theme
    return NextResponse.json(
      {
        message: "RECOVERY_SIGNAL_BROADCAST_COMPLETE: Recovery signal has been sent to the admin node cluster.",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "SYSTEM_ERROR: Could not broadcast access key recovery signal" },
      { status: 500 }
    );
  }
}

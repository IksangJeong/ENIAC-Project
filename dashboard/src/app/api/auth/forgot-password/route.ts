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

    // Find user by username in the memory database
    const user = serverUsers.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );

    if (!user) {
      return NextResponse.json(
        { message: "INVALID_NODE: The requested Node Identifier could not be located in the central registry." },
        { status: 404 }
      );
    }

    // Verify email matches the user record
    if (user.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { message: "IDENTITY_MISMATCH: The provided communication address does not match the registered coordinates for this Node." },
        { status: 400 }
      );
    }

    // Mark as recovery requested in both serverUsers and serverMembers
    const timestamp = new Date().toISOString();
    const requestReason = reason || "No reason provided.";

    user.resetRequested = true;
    user.resetRequestReason = requestReason;
    user.resetRequestedAt = timestamp;

      // Update the member registry too (so the store/admin panel gets it)
      let member = serverMembers.find((m) => m.id === user.id);
      if (!member) {
        // Dynamically create member if not present in the directory
        member = {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          status: "offline",
          statusMessage: "Access recovery requested.",
          avatar: user.avatar || "",
          role: user.role,
          clearance: user.clearance,
          isApproved: user.isApproved,
          position: "System User",
          department: "Management",
          bio: "Registered user node.",
          skills: [],
          socialLinks: { github: user.username },
          joinDate: new Date().toISOString().split("T")[0],
        };
        serverMembers.push(member);
      }
      
      member.resetRequested = true;
      member.resetRequestReason = requestReason;
      member.resetRequestedAt = timestamp;

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

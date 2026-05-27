import { NextRequest, NextResponse } from "next/server";
import { serverUsers, serverMembers } from "@/lib/serverDb";

function generateTempPassword(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { message: "userId is required for password reset" },
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

    // Generate temporary password
    const tempPassword = generateTempPassword();

    // Update password and clear request flags
    user.password = tempPassword;
    user.resetRequested = false;
    user.resetRequestReason = undefined;
    user.resetRequestedAt = undefined;

    // Sync with serverMembers
    const member = serverMembers.find((m) => m.id === userId);
    if (member) {
      member.resetRequested = false;
      member.resetRequestReason = undefined;
      member.resetRequestedAt = undefined;
    }

    return NextResponse.json(
      {
        message: "Crypt key reset successful",
        tempPassword,
        username: user.username,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred during password reset execution" },
      { status: 500 }
    );
  }
}

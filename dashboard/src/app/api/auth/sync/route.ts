import { NextRequest, NextResponse } from "next/server";
import { serverUsers } from "@/lib/serverDb";

// Admin identifiers matching dashboard/src/auth.ts
const ADMIN_IDENTIFIERS = ["seru1027", "IksangJeong", "admin@eniac.com", "sch@example.com", "admin"];

export async function POST(request: NextRequest) {
  try {
    const { id, username, name, email, avatar } = await request.json();

    if (!email && !username) {
      return NextResponse.json(
        { message: "Email or username is required for session synchronization" },
        { status: 400 }
      );
    }

    // Find existing user by email or username
    let user = serverUsers.find(
      (u) => 
        (email && u.email.toLowerCase() === email.toLowerCase()) || 
        (username && u.username.toLowerCase() === username.toLowerCase())
    );

    if (user) {
      // Sync avatar and name if they changed
      if (avatar && !user.avatar) user.avatar = avatar;
      if (name && !user.name) user.name = name;
    } else {
      // Create a new user for OAuth/GitHub
      const identifier = username || email;
      const isAdmin = ADMIN_IDENTIFIERS.includes(identifier) || (email && ADMIN_IDENTIFIERS.includes(email));
      
      user = {
        id: id || Date.now().toString(),
        username: username || email.split("@")[0],
        name: name || username || "OAuth User",
        email: email || `${username}@oauth.eniac`,
        role: isAdmin ? "admin" : "member",
        clearance: isAdmin ? "root" : "member",
        isApproved: isAdmin, // Admins are auto-approved, members are pending
        avatar: avatar || "",
      };

      serverUsers.push(user);
    }

    return NextResponse.json(
      {
        message: "Session sync successful",
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role,
          clearance: user.clearance,
          isApproved: user.isApproved,
          avatar: user.avatar,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred during OAuth sync" },
      { status: 500 }
    );
  }
}

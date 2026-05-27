import { NextRequest, NextResponse } from "next/server";
import { serverUsers, serverMembers } from "@/lib/serverDb";
import { Member } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { username, name, email, password } = await request.json();

    // Validation
    if (!username || !name || !email || !password) {
      return NextResponse.json(
        { message: "Username, name, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    if (serverUsers.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
      return NextResponse.json(
        { message: "Username already in use" },
        { status: 409 }
      );
    }

    // Check if email already exists
    if (serverUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 409 }
      );
    }

    // Username validation (alphanumeric and underscore)
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { message: "Username must be 3-20 characters (alphanumeric and underscore only)" },
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

    // Create new user (Pending Admin Approval)
    const newUser = {
      id: Date.now().toString(),
      username,
      name,
      email,
      password,
      role: "member" as const,
      clearance: "member" as const,
      isApproved: false,
    };

    serverUsers.push(newUser);

    // Also register them in serverMembers so they show up in NodeRegistry (Pending Approvals)
    const newMember: Member = {
      id: newUser.id,
      name: newUser.name,
      username: newUser.username,
      status: "offline",
      statusMessage: "Awaiting administrator activation.",
      avatar: "",
      role: newUser.role,
      clearance: newUser.clearance,
      isApproved: false,
      position: "Pending Node",
      department: "Management", // Default department
      bio: "Awaiting verification.",
      skills: [],
      socialLinks: { github: newUser.username },
      joinDate: new Date().toISOString().split("T")[0],
    };
    serverMembers.push(newMember);

    return NextResponse.json(
      {
        message: "Account created successfully. Awaiting admin approval.",
        user: {
          id: newUser.id,
          username: newUser.username,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          clearance: newUser.clearance,
          isApproved: newUser.isApproved,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred during signup" },
      { status: 500 }
    );
  }
}

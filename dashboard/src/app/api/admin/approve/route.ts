import { NextRequest, NextResponse } from "next/server";
import { serverUsers, serverMembers } from "@/lib/serverDb";
import { Member } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { userId, department, position, clearance } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { message: "userId is required for node activation" },
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

    // Activate the node and apply custom settings
    user.isApproved = true;
    if (clearance) {
      user.clearance = clearance;
      user.role = (clearance === "root" || clearance === "officer") ? "admin" : "member";
    }

    // Check if the user is already in the members directory, if not, register them
    const memberExists = serverMembers.some((m) => m.id === user.id);
    if (!memberExists) {
      const newMember: Member = {
        id: user.id,
        name: user.name,
        username: user.username,
        status: "online",
        statusMessage: "Active node in ENIAC mesh network.",
        avatar: user.avatar || "",
        role: user.role,
        clearance: user.clearance,
        isApproved: true,
        position: position || "Active Node",
        department: department || "Management", // Default department
        bio: "Identity verified. Security protocols active.",
        skills: [],
        socialLinks: { github: user.username },
        joinDate: new Date().toISOString().split("T")[0],
      };
      
      serverMembers.push(newMember);
    } else {
      // If they exist in members directory, update their approved state, department, position, role if needed
      const member = serverMembers.find((m) => m.id === user.id);
      if (member) {
        member.role = user.role;
        member.clearance = user.clearance;
        member.isApproved = true;
        member.status = "online";
        if (department) member.department = department;
        if (position) member.position = position;
      }
    }

    return NextResponse.json(
      {
        message: "Node updated/activated successfully",
        user: {
          id: user.id,
          username: user.username,
          isApproved: user.isApproved,
          role: user.role,
          clearance: user.clearance,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred during node activation" },
      { status: 500 }
    );
  }
}

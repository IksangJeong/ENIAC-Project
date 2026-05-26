import { NextRequest, NextResponse } from "next/server";
import { serverGroups } from "@/lib/serverDb";

export async function GET(request: NextRequest) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return NextResponse.json(serverGroups, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred fetching sub-clusters" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const group = await request.json();
    if (!group.name || !group.leaderId) {
      return NextResponse.json(
        { message: "Cluster Name and Leader ID are required." },
        { status: 400 }
      );
    }
    
    serverGroups.unshift(group);
    return NextResponse.json(group, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred deploying sub-cluster" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const updates = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: "id parameter is required" },
        { status: 400 }
      );
    }

    const index = serverGroups.findIndex((g) => g.id === id);
    if (index === -1) {
      return NextResponse.json(
        { message: "Sub-cluster not found" },
        { status: 404 }
      );
    }

    serverGroups[index] = { ...serverGroups[index], ...updates };
    return NextResponse.json(serverGroups[index], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred updating sub-cluster" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "id parameter is required" },
        { status: 400 }
      );
    }

    const index = serverGroups.findIndex((g) => g.id === id);
    if (index === -1) {
      return NextResponse.json(
        { message: "Sub-cluster not found" },
        { status: 404 }
      );
    }

    serverGroups.splice(index, 1);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred deleting sub-cluster" },
      { status: 500 }
    );
  }
}

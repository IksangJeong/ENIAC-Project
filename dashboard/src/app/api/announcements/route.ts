import { NextRequest, NextResponse } from "next/server";
import { serverAnnouncements } from "@/lib/serverDb";
import { Announcement } from "@/types";

export async function GET(request: NextRequest) {
  try {
    // Sort by newest first
    const sorted = [...serverAnnouncements].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return NextResponse.json(sorted, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred fetching announcements" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, content, priority, author } = await request.json();
    if (!title || !content || !priority) {
      return NextResponse.json(
        { message: "Title, content, and priority are required." },
        { status: 400 }
      );
    }

    const newAnnouncement: Announcement = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      content,
      priority,
      author: author || "SYSTEM",
      createdAt: new Date().toISOString(),
    };

    serverAnnouncements.unshift(newAnnouncement);
    return NextResponse.json(newAnnouncement, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred creating announcement" },
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

    const index = serverAnnouncements.findIndex((a) => a.id === id);
    if (index === -1) {
      return NextResponse.json(
        { message: "Announcement not found" },
        { status: 404 }
      );
    }

    serverAnnouncements.splice(index, 1);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred deleting announcement" },
      { status: 500 }
    );
  }
}

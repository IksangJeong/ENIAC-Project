import { NextRequest, NextResponse } from "next/server";
import { serverSchedules } from "@/lib/serverDb";

export async function GET(request: NextRequest) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return NextResponse.json(serverSchedules, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred fetching operation timeline" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const schedule = await request.json();
    if (!schedule.title || !schedule.date || !schedule.type) {
      return NextResponse.json(
        { message: "Title, date, and type are required." },
        { status: 400 }
      );
    }
    
    serverSchedules.push(schedule);
    return NextResponse.json(schedule, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred creating operation schedule" },
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

    const index = serverSchedules.findIndex((s) => s.id === id);
    if (index === -1) {
      return NextResponse.json(
        { message: "Schedule not found" },
        { status: 404 }
      );
    }

    serverSchedules[index] = { ...serverSchedules[index], ...updates };
    return NextResponse.json(serverSchedules[index], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred updating operation schedule" },
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

    const index = serverSchedules.findIndex((s) => s.id === id);
    if (index === -1) {
      return NextResponse.json(
        { message: "Schedule not found" },
        { status: 404 }
      );
    }

    serverSchedules.splice(index, 1);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred deleting operation schedule" },
      { status: 500 }
    );
  }
}

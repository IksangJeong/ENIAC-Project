import { NextRequest, NextResponse } from "next/server";
import { getRandomServerStatus } from "@/lib/mockData";

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(getRandomServerStatus(), { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred fetching server metrics" },
      { status: 500 }
    );
  }
}

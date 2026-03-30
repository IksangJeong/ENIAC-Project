import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validation
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
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

    // In production:
    // - Find user by email in database
    // - Generate reset token
    // - Send email with reset link
    // - Save token with expiration (e.g., 1 hour)

    // For now, just return success (don't reveal if email exists for security)
    return NextResponse.json(
      {
        message: "If an account exists with this email, you will receive a password reset link shortly.",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred during password reset request" },
      { status: 500 }
    );
  }
}

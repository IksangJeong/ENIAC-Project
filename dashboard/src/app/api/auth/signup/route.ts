import { NextRequest, NextResponse } from "next/server";

// Mock user database
const mockUsers: any[] = [];

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
    if (mockUsers.some((u) => u.username === username)) {
      return NextResponse.json(
        { message: "Username already in use" },
        { status: 409 }
      );
    }

    // Check if email already exists
    if (mockUsers.some((u) => u.email === email)) {
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

    // Create new user - In production:
    // - Hash password with bcryptjs
    // - Save to database
    // - Generate JWT token
    const newUser = {
      id: Date.now().toString(),
      username,
      name,
      email,
      password, // NEVER store plain passwords in production!
    };

    mockUsers.push(newUser);

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: newUser.id,
          username: newUser.username,
          name: newUser.name,
          email: newUser.email,
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

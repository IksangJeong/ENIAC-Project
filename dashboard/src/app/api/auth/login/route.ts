import { NextRequest, NextResponse } from "next/server";

// Mock user database - In production, use a real database
const mockUsers: any[] = [
  {
    id: "3",
    username: "admin",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: "4",
    username: "user",
    name: "Regular User",
    email: "user@example.com",
    password: "user123",
    role: "user",
  },
];

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validation
    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    // Find user - In production, query database
    const user = mockUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import {
  authenticateAdmin,
  createSessionToken,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";

export const maxDuration = 10;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 },
      );
    }

    const user = await authenticateAdmin(email, password);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or security token." },
        { status: 401 },
      );
    }

    const sessionToken = await createSessionToken(user);

    const response = NextResponse.json({
      success: true,
      message: "Authenticated successfully.",
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    // Set HttpOnly, Secure, SameSite=Strict cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("[Login API] Authentication error:", error);
    return NextResponse.json(
      { success: false, message: "Authentication service error." },
      { status: 500 },
    );
  }
}

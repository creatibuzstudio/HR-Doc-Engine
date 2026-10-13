import { NextResponse } from "next/server";
import {
  validateFounderCredentials,
  generateFounderToken,
} from "@/core/auth/session";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!validateFounderCredentials(email, password)) {
      return NextResponse.json(
        { success: false, message: "Invalid founder email or password." },
        { status: 401 }
      );
    }

    const token = generateFounderToken();
    const response = NextResponse.json({
      success: true,
      token,
      message: "Founder authenticated successfully.",
    });

    // Secure HttpOnly session cookie
    response.cookies.set("jevxo_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const envFounderEmail = process.env.FOUNDER_EMAIL?.trim().toLowerCase();
  const envFounderPassword = process.env.FOUNDER_PASSWORD;

  const inputEmail = email?.trim().toLowerCase();
  const validEmails = [
    envFounderEmail,
    "info@creatibuzstudio.com",
    "founder@creatibuzstudio.com",
    "admin@creatibuzstudio.com",
  ].filter(Boolean);

  const isPasswordValid =
    (envFounderPassword && password === envFounderPassword) ||
    password === "Shahid@2026" ||
    password === "founder123";

  if (validEmails.includes(inputEmail) && isPasswordValid) {
    return NextResponse.json({
      success: true,
      message: "Authenticated successfully.",
    });
  }

  return NextResponse.json(
    {
      success: false,
      message: "Invalid email or password.",
    },
    {
      status: 401,
    },
  );
}

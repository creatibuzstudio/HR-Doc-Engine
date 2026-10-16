"use client";

import { useRouter } from "next/navigation";
import Login from "@/features/auth/components/Login";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center">
      <Login
        onLoginSuccess={() => router.push("/")}
        onBackToHome={() => router.push("/")}
      />
    </div>
  );
}

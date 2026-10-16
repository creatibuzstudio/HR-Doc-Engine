"use client";

import { useRouter } from "next/navigation";
import AdminDashboard from "@/features/admin/components/AdminDashboard";

export default function DashboardRoutePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminDashboard onBack={() => router.push("/")} />
    </div>
  );
}

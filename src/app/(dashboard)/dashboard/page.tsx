"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminDashboard from "@/features/admin/components/AdminDashboard";
import Logo from "@/components/layout/Logo";
import { Loader2, LogOut } from "lucide-react";

export default function DashboardRoutePage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated) {
          setIsAuthenticated(true);
        } else {
          router.replace("/login");
        }
      })
      .catch(() => {
        router.replace("/login");
      })
      .finally(() => {
        setCheckingAuth(false);
      });
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Verifying session…
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border bg-[var(--color-nav)]/90 backdrop-blur-md sticky top-0 z-40 px-6 py-2.5 flex justify-between items-center">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Logo />
          <div className="hidden sm:block h-6 w-[1px] bg-border" />
          <p className="hidden sm:block text-xs text-muted-foreground font-semibold uppercase tracking-wider">
            Document Registry
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="text-xs font-semibold px-4 py-2 border border-border hover:border-primary hover:bg-secondary text-foreground rounded-xl transition cursor-pointer"
          >
            ← Doc Select
          </button>
          <button
            onClick={() => {
              fetch("/api/auth/logout", { method: "POST" }).finally(() => {
                router.push("/");
              });
            }}
            title="Logout session"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-destructive/30 text-destructive bg-destructive/10 hover:bg-destructive/20 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>
      <main className="flex-1">
        <AdminDashboard onBack={() => router.push("/")} />
      </main>
    </div>
  );
}

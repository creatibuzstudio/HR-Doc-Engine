import Link from "next/link";
import JevxoLogo from "@/shared/layout/JevxoLogo";
import { LayoutDashboard, PlusCircle, LogOut } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Dashboard Top Navbar */}
      <header className="border-b border-border/40 bg-card/70 backdrop-blur-md sticky top-0 z-40 px-6 py-2.5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <JevxoLogo />
          </Link>
          <div className="h-5 w-[1px] bg-border mx-1" />
          <span className="text-xs font-semibold text-color-header uppercase tracking-wider hidden sm:inline">
            HR Document Engine
          </span>
        </div>

        <nav className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition"
          >
            <PlusCircle className="w-3.5 h-3.5 text-primary" />
            <span>Create Document</span>
          </Link>

          <Link
            href="/dashboard/registry"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-primary" />
            <span>Document Registry</span>
          </Link>

          <div className="h-4 w-[1px] bg-border mx-1" />

          <Link
            href="/login"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 rounded-lg transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </Link>
        </nav>
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}

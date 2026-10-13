import Link from "next/link";
import JevxoLogo from "@/shared/layout/JevxoLogo";
import { FileText, Briefcase, FileCheck, ArrowRight, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top Navbar */}
      <header className="border-b border-border/40 bg-card/60 backdrop-blur-md sticky top-0 z-40 px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <JevxoLogo />
          <span className="hidden sm:inline-block text-xs uppercase font-bold tracking-widest text-primary border border-primary/30 px-2 py-0.5 rounded-full">
            Doc Engine
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs font-semibold px-4 py-2 rounded-lg border border-border hover:border-primary/50 text-foreground transition"
          >
            Founder Sign In
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition flex items-center gap-1.5"
          >
            Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 flex flex-col items-center text-center justify-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-semibold mb-6">
          <ShieldCheck className="w-3.5 h-3.5" /> JEVXO Autonomous Documentation System
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-3xl leading-tight mb-6">
          Streamlined HR &amp; Contract Engine for <span className="text-primary">JEVXO</span>
        </h1>

        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mb-12">
          Automate legal hiring requisitions, contractual project agreements, and permanent full-time employment offer letters with digital signatures and A4 PDF delivery.
        </p>

        {/* 3 Core Workflow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left mb-12">
          <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/40 transition">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold mb-2">1. HR Hiring Notice</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Generate structured recruitment notices with department requisitions, required skill tags, and executive approvals.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/40 transition">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold mb-2">2. Contractual Project Base</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Execute project agreements with milestone-based remuneration, deliverable timelines, and contractor e-signatures.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/40 transition">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold mb-2">3. Job Offer (Permanent)</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Issue permanent employment letters with fixed monthly salary, probation duration, and countersigned digital signatures.
            </p>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link
            href="/dashboard"
            className="px-8 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-md transition flex items-center gap-2"
          >
            Launch Document Engine <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard/registry"
            className="px-6 py-3.5 rounded-xl border border-border bg-card hover:bg-accent text-foreground font-semibold text-sm transition"
          >
            View Document Registry
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} JEVXO • Proprietary Internal Documentation Engine
      </footer>
    </div>
  );
}

import Link from "next/link";
import { FileText, Briefcase, FileCheck, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function DashboardHubPage() {
  const docTypes = [
    {
      id: "hiring",
      title: "HR Hiring Recruitment Notice",
      tag: "Internal / Requisition",
      description:
        "Draft and approve official employee hiring notices with dynamic required skill tags, department vacancies, and founder authorizations.",
      href: "/dashboard/hiring/new",
      icon: FileText,
      badge: "Step 1: Requisition",
    },
    {
      id: "contract",
      title: "Contractual Project-Based Agreement",
      tag: "Startup Phase • Project Base",
      description:
        "Legally binding project employment contract for team members. Includes project scope, milestone-based payouts, deliverables, and e-signatures.",
      href: "/dashboard/contract/new",
      icon: Briefcase,
      badge: "Step 2: Startup Project Basis",
    },
    {
      id: "job-offer",
      title: "Job Offer Letter (Permanent)",
      tag: "Scale Phase • Fixed Salary",
      description:
        "Official permanent full-time employment appointment letter. Includes monthly fixed gross salary, probation terms, notice period, and benefits.",
      href: "/dashboard/job-offer/new",
      icon: FileCheck,
      badge: "Step 3: Permanent Full-Time",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-8 rounded-2xl border border-border bg-card relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3 h-3" /> JEVXO Document Generation Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Select Document to Generate
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Choose between internal hiring requisitions, milestone project-based contracts, or permanent employment offer letters.
          </p>
        </div>
      </div>

      {/* 3 Document Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {docTypes.map((doc) => {
          const Icon = doc.icon;
          return (
            <div
              key={doc.id}
              className="flex flex-col justify-between p-6 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-secondary border border-border text-color-header">
                    {doc.badge}
                  </span>
                </div>

                <h2 className="text-base font-bold mb-2 group-hover:text-primary transition">
                  {doc.title}
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                  {doc.description}
                </p>
              </div>

              <Link
                href={doc.href}
                className="w-full py-2.5 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground border border-border text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <span>Generate Document</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          );
        })}
      </div>

      {/* Quick Security & Workflow Note */}
      <div className="p-4 rounded-xl border border-border/60 bg-secondary/40 flex items-center gap-3 text-xs text-muted-foreground">
        <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
        <span>
          All generated documents are assigned sequential year-coded IDs (e.g., JVX-PRJ-26-001) and include candidate e-signing links and verification QR codes.
        </span>
      </div>
    </div>
  );
}

"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  FolderCheck,
  Printer,
  Check,
  Sparkles,
} from "lucide-react";

interface HeroProps {
  onStart: () => void;
  onDemo: () => void;
}

export default function Hero({ onStart, onDemo }: HeroProps) {
  return (
    <motion.section
      key="home"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="relative min-h-[calc(100vh-77px)] flex items-center justify-center px-4 overflow-hidden hero-radial-glow"
      id="hero_viewport_container"
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      <div className="max-w-4xl text-center relative z-10 px-4 space-y-5 py-8 md:py-12">
        <div className="inline-flex items-center gap-2 bg-secondary border border-border px-3.5 py-1.5 rounded-full text-primary font-semibold text-xs uppercase tracking-wider shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          Official Creatibuz Studio Document Engine
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight font-sans">
            <span className="serif-italic text-header-text font-normal">
              Automate Your
            </span>{" "}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#FF8A50] font-black">
              Corporate &amp; Contractual
            </span>{" "}
            Workflows
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Generate contractual offer letters, work agreements, and official corporate
            onboarding documentation — all from a single intelligent platform with automated dual signatures and email dispatch.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-4 bg-primary hover:opacity-95 text-primary-foreground font-bold rounded-2xl shadow-lg shadow-primary/25 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group text-base cursor-pointer"
          >
            Create Agreements &amp; Offers
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          </button>
          <button
            onClick={onDemo}
            className="w-full sm:w-auto px-6 py-4 bg-secondary hover:bg-accent border border-border font-semibold rounded-2xl transition flex items-center justify-center gap-2 text-foreground cursor-pointer"
          >
            Try with Demo Data
          </button>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-left">
          {[
            {
              icon: FolderCheck,
              title: "Contractual Agreements",
              desc: "Project-based and full-time contracts with Scope of Work, Compensation, Terms, and dual digital signatures.",
            },
            {
              icon: Printer,
              title: "Pixel-Perfect Documents",
              desc: "Crisp document layout with dark header, official Creatibuz insignia, watermarks, and signature verification.",
            },
            {
              icon: Check,
              title: "Dual Signature Flow",
              desc: "Founder authorizes first, then the candidate signs via digital portal with automatic dual email distribution.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="p-5 bg-card border border-border rounded-2xl shadow-sm transition hover:border-primary/40"
            >
              <div className="text-primary mb-3 bg-secondary w-9 h-9 flex items-center justify-center rounded-xl border border-border">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-foreground font-bold text-sm mb-1">{title}</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

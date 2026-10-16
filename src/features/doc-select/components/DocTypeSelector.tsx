"use client";

import React from "react";
import { motion } from "motion/react";
import { ArrowRight, LayoutDashboard, FileText, CreditCard, BriefcaseIcon, Award } from "lucide-react";

// Local union — covers all selectable doc types including the new sales types.
// Not exported from types/index.ts intentionally (only used at the selector layer).
export type SelectableDocType = "contractual" | "internship" | "hrHiringNotice" | "internCertificate";

interface DocTypeSelectorProps {
  onSelect: (type: SelectableDocType) => void;
  onOpenAdmin?: () => void;
}

export default function DocTypeSelector({ onSelect, onOpenAdmin }: DocTypeSelectorProps) {
  return (
    <motion.div
      key="docTypeSelect"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.35 }}
      className="flex-1 flex items-center justify-center px-6 py-12"
    >
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-[10px] bg-secondary border border-border text-primary font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block">
            Step 2 of 2
          </span>
          <h1 className="text-2xl font-bold text-foreground">
            Select Agreement Template
          </h1>
          <p className="text-sm text-muted-foreground">
            Choose a document template. Each template generates an official Creatibuz Studio agreement with automated email delivery and digital signatures.
          </p>
        </div>

        <div className="grid gap-4">
          {/* 1. Contractual Offer Letter & Work Agreement (Featured) */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelect("contractual")}
            className="w-full text-left p-6 rounded-2xl border-2 border-primary bg-card shadow-lg shadow-primary/10 cursor-pointer group transition-all hover:shadow-xl hover:shadow-primary/20"
          >
            <div className="flex items-start gap-4">
              <div className="flex flex-col gap-1.5 shrink-0">
                <div className="p-2.5 rounded-xl bg-primary/20 text-primary">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-foreground text-base leading-snug">
                    Joining Offer Letter &amp; Work Agreement
                  </h3>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                    Contractual
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  Project-Based or Full-Time Contract with Scope of Work, Compensation, Terms, and Dual Digital Signatures (Founder &amp; Candidate).
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {["Project-Based", "Full-Time", "Dual Signatures", "Scope of Work", "PDF Export"].map((tag) => (
                    <span key={tag} className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/15 text-primary">{tag}</span>
                  ))}
                </div>
              </div>
              <ArrowRight className="w-5 h-5 shrink-0 mt-1 text-primary group-hover:translate-x-0.5 transition-transform" />
            </div>
          </motion.button>

          {/* 2. Internship */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelect("internship")}
            className="w-full text-left p-6 rounded-2xl border border-border bg-card shadow-sm cursor-pointer group transition-all hover:border-primary/50 hover:bg-secondary"
          >
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-secondary text-primary border border-border shrink-0">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground text-base leading-snug">
                  Internship Offer Letter
                </h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  Internship appointment with learning objectives, duration, and ID card.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {["Internship Duration", "NDA", "PDF Export", "ID Card"].map((tag) => (
                    <span key={tag} className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">{tag}</span>
                  ))}
                </div>
              </div>
              <ArrowRight className="w-5 h-5 shrink-0 mt-1 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition" />
            </div>
          </motion.button>

          {/* HR Hiring Notice */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelect("hrHiringNotice")}
            className="w-full text-left p-6 rounded-2xl border border-border bg-card shadow-sm cursor-pointer group transition-all hover:border-primary/50 hover:bg-secondary"
          >
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-secondary text-primary border border-border shrink-0">
                <BriefcaseIcon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground text-base leading-snug">
                  HR Hiring Notice
                </h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  Internal recruitment circular addressed to CEO/CTO/Founder with position details, skills, and HR sign-off.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {["Recruitment Details", "Skills Matrix", "PDF Export", "Email Dispatch", "HR Signature"].map((tag) => (
                    <span key={tag} className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">{tag}</span>
                  ))}
                </div>
              </div>
              <ArrowRight className="w-5 h-5 shrink-0 mt-1 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition" />
            </div>
          </motion.button>

          {/* Intern Certificate Generator */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelect("internCertificate")}
            className="w-full text-left p-6 rounded-2xl border border-border bg-card shadow-sm cursor-pointer group transition-all hover:border-primary/50 hover:bg-secondary"
          >
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-secondary text-primary border border-border shrink-0">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground text-base leading-snug">
                  Intern Certificate
                </h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  Generate premium, digital-signed completion certificates for interns. Mutates database and notifies intern via automated email.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {["Landscape A4", "Database Sync", "CEO Signature", "Email Dispatch", "Completion Letter"].map((tag) => (
                    <span key={tag} className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">{tag}</span>
                  ))}
                </div>
              </div>
              <ArrowRight className="w-5 h-5 shrink-0 mt-1 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition" />
            </div>
          </motion.button>
        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          All templates use the centralized Creatibuz Studio styling and PDF/email pipeline.
        </p>

        {onOpenAdmin && (
          <button
            onClick={onOpenAdmin}
            className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 border border-border bg-secondary hover:bg-accent text-foreground transition cursor-pointer shadow-sm"
          >
            <LayoutDashboard className="w-4 h-4 text-primary" />
            Agreement Registry
            <span className="ml-1 text-[9px] font-black uppercase tracking-wider bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
              Admin
            </span>
          </button>
        )}
      </div>
    </motion.div>
  );
}

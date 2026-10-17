"use client";

import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { Logo } from "@/components/layout/Logo";

interface ContractualOfferHeaderProps {
  employmentType: string;
  subjectLine: string;
  dateOfIssue: string;
}

export default function ContractualOfferHeader({
  employmentType,
  subjectLine,
  dateOfIssue,
}: ContractualOfferHeaderProps) {
  return (
    <div className="bg-[#1F0A0A] text-white px-16 pt-16 pb-12 relative shrink-0">
      {/* Top bar: Brand + Employment Type */}
      <div className="flex items-start justify-between">
        {/* Logo & Brand text */}
        <div className="flex items-center gap-3">
          <Logo size="lg"/>
        </div>

        {/* Employment Type Selector Badges */}
        <div className="flex flex-col items-start gap-1.5 text-right">
          <span className="text-xs font-semibold text-white/90">
            Employment Type:
          </span>
          <div className="flex flex-col gap-1 items-start">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] ${
                  employmentType === "Project-Based Contract"
                    ? "bg-[#22C55E] text-white"
                    : "bg-[#22C55E]/20 border border-[#22C55E]/50 text-[#22C55E]"
                }`}
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
              <span
                className={`text-[11px] ${
                  employmentType === "Project-Based Contract"
                    ? "text-white font-medium"
                    : "text-white/70"
                }`}
              >
                Project-Based Contract
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] ${
                  employmentType === "Full-Time Contract"
                    ? "bg-[#22C55E] text-white"
                    : "bg-[#22C55E]/20 border border-[#22C55E]/50 text-[#22C55E]"
                }`}
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
              <span
                className={`text-[11px] ${
                  employmentType === "Full-Time Contract"
                    ? "text-white font-medium"
                    : "text-white/70"
                }`}
              >
                Full-Time Contract
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Document Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-foreground font-display mt-6 tracking-tight leading-none">
        Joining Offer Letter &amp; Work Agreement
      </h1>

      {/* Divider */}
      <div className="h-[1px] bg-white/75 my-3.5 w-full" />

      {/* Subject & Date of Issue row */}
      <div className="flex items-center justify-between text-[#E4E4E7]">
        <span className="font-medium text-[15px] text-white/95">{subjectLine}</span>
        <span className="font-medium text-xs text-white/80">
          Date Of Issue: {dateOfIssue}
        </span>
      </div>
    </div>
  );
}

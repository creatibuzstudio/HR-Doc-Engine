"use client";

import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";

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
    <div className="bg-[#0D0D0E] text-white px-8 pt-7 pb-5 relative shrink-0">
      {/* Top bar: Brand + Employment Type */}
      <div className="flex items-start justify-between">
        {/* Logo & Brand text */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 bg-[#FF5722] shadow-md border border-white/10 flex items-center justify-center">
            <Image
              src="/fav.jpg"
              alt="Creatibuz Studio"
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-2xl tracking-tight leading-none text-white">
              Creatibuz <span className="font-normal text-white/90">Studio</span>
            </span>
            <span className="text-[8.5px] font-bold uppercase tracking-[2.5px] text-[#A1A1AA] mt-1">
              DESIGN &middot; DEVELOP &middot; TRANSFORM
            </span>
          </div>
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
      <h1 className="text-[29px] font-extrabold text-white mt-6 tracking-tight leading-none">
        Joining Offer Letter &amp; Work Agreement
      </h1>

      {/* Divider */}
      <div className="h-[1px] bg-white/20 my-3.5 w-full" />

      {/* Subject & Date of Issue row */}
      <div className="flex items-center justify-between text-xs text-[#E4E4E7]">
        <span className="font-medium text-white/95">{subjectLine}</span>
        <span className="font-medium text-white/80">
          Date Of Issue: {dateOfIssue}
        </span>
      </div>
    </div>
  );
}

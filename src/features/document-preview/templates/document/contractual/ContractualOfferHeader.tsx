"use client";

import React from "react";
import { Phone, Globe, Mail } from "lucide-react";
import { Logo } from "@/components/layout/Logo";

interface ContractualOfferHeaderProps {
  employmentType?: string;
  subjectLine: string;
  dateOfIssue: string;
  phone: string;
  website: string;
  email: string;
}

export default function ContractualOfferHeader({
  subjectLine,
  dateOfIssue,
  phone,
  website,
  email,
}: ContractualOfferHeaderProps) {
  return (
    <div className="p-1.5">
      <div className="bg-[#1F0A0A] text-white px-11 pt-11 pb-10 relative shrink-0 rounded-lg">
        {/* Top bar: Brand + Contact Info */}
        <div className="flex items-center justify-between">
          {/* Logo & Brand text */}
          <div className="flex items-center gap-3">
            <Logo size="lg" />
          </div>

          {/* Contact Details Card on Top Right */}
          <div className="flex flex-col items-start gap-1.5 px-3 py-2 rounded-xl">
            {/* Phone */}
            <div className="flex items-center gap-2 text-[10px] text-white/90">
              <div className="w-4 h-4 rounded bg-[#FF5722] flex items-center justify-center text-white shrink-0">
                <Phone className="w-2.5 h-2.5 fill-white text-white" />
              </div>
              <span>{phone}</span>
            </div>

            {/* Website */}
            <div className="flex items-center gap-2 text-[10px] text-white/90">
              <div className="w-4 h-4 rounded bg-[#FF5722] flex items-center justify-center text-white shrink-0">
                <Globe className="w-2.5 h-2.5 text-white" />
              </div>
              <span>{website}</span>
            </div>

            {/* Email */}
            <div className="flex items-center gap-2 text-[10px] text-white/90">
              <div className="w-4 h-4 rounded bg-[#FF5722] flex items-center justify-center text-white shrink-0">
                <Mail className="w-2.5 h-2.5 text-white" />
              </div>
              <span>{email}</span>
            </div>
          </div>
        </div>

        {/* Main Document Title */}
        <h1 className="text-2xl md:text-[28px] font-bold text-foreground font-display mt-6 tracking-tight leading-none">
          Joining Offer Letter &amp; Work Agreement
        </h1>

        {/* Divider */}
        <div className="h-[1px] bg-white/75 my-3.5 w-full" />

        {/* Subject & Date of Issue row */}
        <div className="flex items-center justify-between text-[#E4E4E7]">
          <span className="font-medium text-[15px] text-white/95">Subject: {subjectLine}</span>
          <span className="font-medium text-xs text-white/80">
            Date Of Issue: {dateOfIssue}
          </span>
        </div>
      </div>
    </div>
  );
}

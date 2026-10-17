"use client";

import React from "react";
import { Check } from "lucide-react";
import { FirstParty, SecondParty } from "@/types";

interface ContractualOfferSignaturesProps {
  firstParty: FirstParty;
  secondParty: SecondParty;
  founderName: string;
  candidateName: string;
  idNo?: string;
  refNo?: string;
  phone?: string;
  website?: string;
  email?: string;
  signatureDate?: string | Date | null;
}

function formatSignatureDate(rawDate?: string | Date | null): string {
  const d = rawDate ? new Date(rawDate) : new Date();
  if (isNaN(d.getTime())) {
    return String(rawDate);
  }
  const day = d.getDate();
  const month = d.toLocaleString("en-US", { month: "long" });
  const year = d.getFullYear();
  return `${day} ${month}, ${year}`;
}

export default function ContractualOfferSignatures({
  firstParty,
  secondParty,
  founderName,
  candidateName,
  idNo,
  refNo,
  signatureDate,
}: ContractualOfferSignaturesProps) {
  const currentYearStr = new Date().getFullYear().toString().slice(-2);
  const displayIdNo = idNo || secondParty.partnerId || "CBS-EMP-001";
  const displayRefNo = refNo || `CBS/REF-${currentYearStr}/001`;

  return (
    <div className="relative z-10 pt-4 border-t border-[#E2E8F0] mt-3">
      <div className="flex items-end justify-between gap-6">
        {/* Dual Signature Area */}
        <div className="flex items-end gap-10">
          {/* Authorized Founder & CEO Signature */}
          <div className="flex flex-col items-start">
            <div className="h-11 flex items-end mb-1">
              {firstParty.signatureImg ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={firstParty.signatureImg}
                  alt="Authorized Signature"
                  className="h-10 max-w-[150px] object-contain"
                />
              ) : (
                <span className="font-serif italic text-lg text-slate-800">
                  Abdul Hakim
                </span>
              )}
            </div>
            <div className="w-40 border-b border-[#94A3B8]" />
            <span className="text-[10px] font-semibold text-[#475569] mt-1">
              Authorize Signature
            </span>
            <span className="text-[9.5px] font-bold text-[#0F172A]">
              {founderName}
            </span>
            <span className="text-[8px] text-[#64748B] uppercase tracking-wider">
              Founder &amp; CEO
            </span>
          </div>

          {/* Candidate / Contractor Signature */}
          <div className="flex flex-col items-start">
            <div className="h-11 flex items-end mb-1">
              {secondParty.signatureImg ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={secondParty.signatureImg}
                  alt="Candidate Signature"
                  className="h-10 max-w-[150px] object-contain"
                />
              ) : (
                <div className="h-9 px-3 border border-dashed border-[#CBD5E1] rounded bg-slate-50 flex items-center justify-center text-[9px] text-[#94A3B8] italic">
                  Pending Signature
                </div>
              )}
            </div>
            <div className="w-40 border-b border-[#94A3B8]" />
            <span className="text-[10px] font-semibold text-[#475569] mt-1">
              Candidate Signature
            </span>
            <span className="text-[9.5px] font-bold text-[#0F172A]">
              {candidateName}
            </span>
            {secondParty.signatureImg ? (
              <span className="text-[8px] text-[#64748B] font-medium tracking-tight">
                {formatSignatureDate(
                  signatureDate || secondParty.signatureDate,
                )}
              </span>
            ) : (
              <span className="text-[8px] text-[#94A3B8] italic">
                Awaiting Signature
              </span>
            )}
          </div>
        </div>

        {/* Contract ID & Employment Type Card on the right */}
        <div className="flex flex-col items-start gap-1.5 bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 rounded-xl shadow-xs min-w-[175px]">
          {/* ID & Ref Section */}
          <div className="w-full pb-1.5 border-b border-[#E2E8F0] flex flex-col gap-0.5">
            <div className="flex items-center justify-between gap-3 text-[10px]">
              <span className="font-semibold text-[#64748B]">ID No:</span>
              <span className="font-mono font-bold text-[#0F172A]">{displayIdNo}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-[10px]">
              <span className="font-semibold text-[#64748B]">Ref No:</span>
              <span className="font-mono font-bold text-[#0F172A]">{displayRefNo}</span>
            </div>
          </div>

          {/* Employment Type Badges */}
          <div className="flex flex-col gap-1 items-start w-full pt-0.5">
            <span className="text-[10px] font-extrabold text-[#475569] uppercase tracking-wide">
              Employment Type:
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] bg-[#22C55E] border border-[#22C55E] text-white">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
              <span className="text-[10px] text-[#1E293B] font-medium">
                Project-Based Contract
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] bg-[#22C55E]/20 border border-[#22C55E]/50 text-[#22C55E]">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
              <span className="text-[10px] text-[#1E293B] font-medium">
                Full-Time - Remote
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

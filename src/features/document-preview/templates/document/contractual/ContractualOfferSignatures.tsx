"use client";

import React from "react";
import { Phone, Globe, Mail } from "lucide-react";
import { FirstParty, SecondParty } from "@/types";

interface ContractualOfferSignaturesProps {
  firstParty: FirstParty;
  secondParty: SecondParty;
  founderName: string;
  candidateName: string;
  phone: string;
  website: string;
  email: string;
}

export default function ContractualOfferSignatures({
  firstParty,
  secondParty,
  founderName,
  candidateName,
  phone,
  website,
  email,
}: ContractualOfferSignaturesProps) {
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
            <span className="text-[8px] text-[#64748B] uppercase tracking-wider">
              Contractor
            </span>
          </div>
        </div>

        {/* Contact Details Card on the right */}
        <div className="flex flex-col items-start gap-2 bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 rounded-xl shadow-xs">
          {/* Phone */}
          <div className="flex items-center gap-2 text-[10px] font-semibold text-[#1E293B]">
            <div className="w-4 h-4 rounded bg-[#FF5722] flex items-center justify-center text-white shrink-0">
              <Phone className="w-2.5 h-2.5 fill-white text-white" />
            </div>
            <span>{phone}</span>
          </div>

          {/* Website */}
          <div className="flex items-center gap-2 text-[10px] font-semibold text-[#1E293B]">
            <div className="w-4 h-4 rounded bg-[#FF5722] flex items-center justify-center text-white shrink-0">
              <Globe className="w-2.5 h-2.5 text-white" />
            </div>
            <span>{website}</span>
          </div>

          {/* Email */}
          <div className="flex items-center gap-2 text-[10px] font-semibold text-[#1E293B]">
            <div className="w-4 h-4 rounded bg-[#FF5722] flex items-center justify-center text-white shrink-0">
              <Mail className="w-2.5 h-2.5 text-white" />
            </div>
            <span>{email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

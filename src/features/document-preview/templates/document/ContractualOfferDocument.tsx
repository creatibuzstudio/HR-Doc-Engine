"use client";

import React from "react";
import Image from "next/image";
import { Phone, Globe, Mail, Check } from "lucide-react";
import { FirstParty, SecondParty, DocSettings } from "@/types";
import { A4_WIDTH, A4_HEIGHT } from "../../components/A4DocumentScaler";

interface ContractualOfferDocumentProps {
  firstParty: FirstParty;
  secondParty: SecondParty;
  settings: DocSettings;
  innerRef?: React.RefObject<HTMLDivElement | null>;
  isExporting?: boolean;
}

export default function ContractualOfferDocument({
  firstParty,
  secondParty,
  settings,
  innerRef,
}: ContractualOfferDocumentProps) {
  const companyName = firstParty.companyName || "Creatibuz Studio";
  const founderName = firstParty.representedBy || firstParty.ceoName || "Md. Abdul Hakim";
  const candidateName = secondParty.fullName || "Ashikur Rahman Ovi";
  const position = secondParty.position || "Full Stack Developer";
  const employmentType = settings.employmentType || "Project-Based Contract";
  const dateOfIssue = settings.date || "Oct 15 - 2026";
  const subjectLine =
    settings.contractSubject ||
    `Subject: ${position} For A ${employmentType}`;

  const phone = firstParty.ceoMobile || firstParty.mobileNumber || "+8801968657353";
  const website = firstParty.website?.replace(/^https?:\/\//, "") || "www.creatibuzstudio.com";
  const email = firstParty.email || "info@creatibuzstudio.com";

  return (
    <div
      ref={innerRef}
      id="contractual-offer-document"
      className="bg-white text-[#0F172A] relative flex flex-col justify-between shadow-xl mx-auto overflow-hidden font-sans"
      style={{
        width: `${A4_WIDTH}px`,
        height: `${A4_HEIGHT}px`,
        minHeight: `${A4_HEIGHT}px`,
        maxHeight: `${A4_HEIGHT}px`,
        boxSizing: "border-box",
      }}
    >
      {/* ── TOP HEADER (Dark Theme as in Template) ─────────────────────────── */}
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

      {/* ── BODY CONTENT ──────────────────────────────────────────────────── */}
      <div className="relative px-10 py-5 flex-1 flex flex-col justify-between">
        {/* Subtle Watermark in background */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-[340px] h-[340px] pointer-events-none opacity-[0.045] select-none z-0">
          <Image
            src="/creatibuz-symbol.png"
            alt="Watermark"
            width={340}
            height={340}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Main textual content */}
        <div className="relative z-10 space-y-3 text-[11px] text-[#1E293B]">
          {/* Greeting */}
          <p className="text-[14.5px] font-bold text-[#0F172A]">
            Dear, {candidateName}
          </p>

          {/* Paragraph 1 */}
          <p className="leading-[1.6] text-[#334155]">
            We Are Pleased To Offer You A {employmentType} At {companyName} Global Ui Ux Design &amp; Development Agency As [{position}]. We Are Excited About The Possibility Of Having You Join Our Team And Contribute To Our Mission Of Creating Meaningful Digital Experiences Through UI/UX Design, Web Design, And Development.
          </p>

          {/* Paragraph 2 */}
          <p className="leading-[1.6] text-[#334155]">
            In This Role, We Appreciate Your Skills, Professional Potential, And Interest In Working With Our Agency. We Look Forward To Collaborating With You On Client Projects And Delivering High-Quality Design And Development Solutions. And Contribute To The Creative Direction Of Client And Internal Initiative.
          </p>

          {/* Terms Section */}
          <div className="space-y-2.5 pt-1">
            <div>
              <h4 className="font-bold text-[11px] text-[#0F172A] tracking-tight">
                Term 01 — Scope Of Work And Deliverables
              </h4>
              <p className="text-[10px] leading-[1.5] text-[#475569] mt-0.5">
                {settings.scopeOfWork ||
                  "You Agree To Complete The Assigned Tasks, Deliverables, Revisions, And Documentation Specified In The Approved Project Scope. Any Substantial Change To The Scope, Timeline, Or Deliverables Must Be Approved By Both Parties Before Implementation."}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-[11px] text-[#0F172A] tracking-tight">
                Term 02 — Compensation And Payment
              </h4>
              <p className="text-[10px] leading-[1.5] text-[#475569] mt-0.5">
                {settings.compensationDetails ||
                  "The Agency Will Pay The Agreed Project Fee According To The Payment Schedule Specified In This Offer. Payment Milestones, Acceptance Criteria, And Any Applicable Deductions Must Be Agreed Upon In Writing. Approved Additional Work May Be Compensated Separately."}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-[11px] text-[#0F172A] tracking-tight">
                Term 03 — Confidentiality And Data Protection
              </h4>
              <p className="text-[10px] leading-[1.5] text-[#475569] mt-0.5">
                {settings.confidentialityTerms ||
                  "You Must Protect All Confidential Information, Client Data, Credentials, Business Documents, Project Files, And Internal Communications. Such Information Must Not Be Disclosed, Misused, Or Shared With Unauthorized Individuals During Or After The Engagement, Subject To Applicable Law."}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-[11px] text-[#0F172A] tracking-tight">
                Term 04 — Intellectual Property And Work Ownership
              </h4>
              <p className="text-[10px] leading-[1.5] text-[#475569] mt-0.5">
                {settings.ipOwnershipTerms ||
                  "Ownership And Transfer Of Project Deliverables, Including Designs, Source Files, Code, And Other Work Products, Will Be Governed By The Written Agreement And Applicable Law. Unless Otherwise Agreed, The Transfer Of Ownership To The Agency Or Its Client Will Take Effect Upon Receipt Of The Agreed Payment For The Relevant Deliverables. Pre-Existing Tools, Third-Party Assets, And Properly Licensed Materials Remain Subject To Their Applicable Rights And Licenses."}
              </p>
            </div>
          </div>

          {/* Note block */}
          <div className="pt-1">
            <p className="text-[9.5px] leading-[1.5] text-[#334155]">
              <strong className="text-[#0F172A] font-bold">Note:</strong> Please Review This Offer Carefully. By Signing Below, You Confirm That You Understand And Accept The Project Scope, Compensation, Timeline, And Terms Stated In This Offer.
            </p>
          </div>
        </div>

        {/* ── SIGNATURES & CONTACT SECTION ─────────────────────────────────── */}
        <div className="relative z-10 pt-4 pb-2 border-t border-[#E2E8F0] mt-3">
          <div className="flex items-end justify-between gap-6">
            {/* Dual Signature Area */}
            <div className="flex items-end gap-10">
              {/* Authorized Founder & CEO Signature */}
              <div className="flex flex-col items-start">
                <div className="h-11 flex items-end mb-1">
                  {firstParty.signatureImg ? (
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
      </div>

      {/* ── SOLID VIBRANT ORANGE ACCENT FOOTER BAR ────────────────────────── */}
      <div className="w-full h-3.5 bg-[#FF5722] shrink-0" />
    </div>
  );
}

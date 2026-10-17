"use client";

import React from "react";
import Image from "next/image";
import { FirstParty, SecondParty, DocSettings } from "@/types";
import { A4_WIDTH, A4_HEIGHT } from "../../components/A4DocumentScaler";
import ContractualOfferHeader from "./contractual/ContractualOfferHeader";
import ContractualOfferSignatures from "./contractual/ContractualOfferSignatures";

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
      <ContractualOfferHeader
        employmentType={employmentType}
        subjectLine={subjectLine}
        dateOfIssue={dateOfIssue}
        phone={phone}
        website={website}
        email={email}
      />

      {/* ── BODY CONTENT ──────────────────────────────────────────────────── */}
      <div className="relative px-12.5 pt-8.5 pb-7.5 flex-1 flex flex-col justify-between">
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
        <div className="relative z-10 space-y-3 text-[12px] text-[#1E293B]">
          {/* Greeting */}
          <p className="text-[18px] font-bold text-[#0F172A]">
            Dear {candidateName},
          </p>

          {/* Paragraph 1 */}
          <p className="leading-[1.6] text-[#334155] max-w-[98%]">
            We are pleased to offer you a {employmentType} position at <strong> {companyName}</strong>, a global UI/UX design and development agency, as a [{position}]. We are excited for welcoming you to our team and having you contribute to our core mission of crafting meaningful digital experiences through innovative design and development.
          </p>

          {/* Paragraph 2 */}
          <p className="leading-[1.6] text-[#334155] max-w-[93%]">
            In this role, we deeply appreciate your skills, professional potential, and genuine interest in working with our agency. We look forward to collaborating closely with you on client projects, delivering high-quality design and development solutions, and actively contributing to the creative direction of client and internal initiatives.
          </p>

          {/* Terms Section */}
          <div className="space-y-4 pt-6">
            <h2 className="text-[18px] font-bold text-primary/75">Terms & Conditions</h2>
            <div className="max-w-[90%]">
              <h4 className="font-semibold text-[15px] text-[#0F172A] tracking-tight">
                Term 01 — Scope Of Work And Deliverables
              </h4>
              <p className="text-[12px] leading-[1.5] text-[#475569] mt-0.5">
                {settings.scopeOfWork ||
                  "All deliverables must be completed strictly in accordance with the approved project scope. Any substantial modifications to the scope, timeline, or deliverables require prior mutual written approval from both parties."}
              </p>
            </div>

            <div className="max-w-[95%]">
              <h4 className="font-semibold text-[15px] text-[#0F172A] tracking-tight">
                Term 02 — Compensation And Payment
              </h4>
              <p className="text-[12px] leading-[1.5] text-[#475569] mt-0.5">
                {settings.compensationDetails ||
                  "The Agency will issue payments strictly in accordance with the mutually agreed schedule, milestones, and written acceptance criteria. Furthermore, any approved out-of-scope work will be evaluated and compensated separately."}
              </p>
            </div>

            <div className="max-w-[88%]">
              <h4 className="font-semibold text-[15px] text-[#0F172A] tracking-tight">
                Term 03 — Confidentiality And Data Protection
              </h4>
              <p className="text-[12px] leading-[1.5] text-[#475569] mt-0.5">
                {settings.confidentialityTerms ||
                  "All confidential information, client data, credentials, and project assets must remain strictly protected and non-disclosed to unauthorized parties during and after the engagement, per applicable law."}
              </p>
            </div>

            <div className="max-w-[88%]">
              <h4 className="font-semibold text-[15px] text-[#0F172A] tracking-tight">
                Term 04 — Intellectual Property And Work Ownership
              </h4>
              <p className="text-[12px] leading-[1.5] text-[#475569] mt-0.5">
                {settings.ipOwnershipTerms ||
                  "Ownership of deliverables transfers upon receipt of full payment for the relevant work. Pre-existing tools, third-party assets, and licensed materials remain subject to their respective rights and licenses."}
              </p>
            </div>
          </div>

          {/* Note block */}
          <div className="pt-4">
            <p className="text-[11.5px] leading-[1.5] text-[#334155] font-semibold">
              <strong className="text-[#0F172A] font-bold">Note:</strong> Please Review This Offer Carefully. By Signing Below, You Confirm That You Understand And <br /> Accept The Project Scope, Compensation, Timeline, And Terms Stated In This Offer.
            </p>
          </div>
        </div>

        <ContractualOfferSignatures
          firstParty={firstParty}
          secondParty={secondParty}
          founderName={founderName}
          candidateName={candidateName}
          phone={phone}
          website={website}
          email={email}
          idNo={
            secondParty.partnerId ||
            settings.contractualId ||
            settings.contractId
          }
          refNo={
            settings.contractRef ||
            settings.contractRefId ||
            settings.contractualRefId ||
            settings.refId
          }
        />
      </div>

      {/* ── SOLID VIBRANT ORANGE ACCENT FOOTER BAR ────────────────────────── */}
      <div className="w-full h-5 bg-[#FF5722] shrink-0" />
    </div>
  );
}

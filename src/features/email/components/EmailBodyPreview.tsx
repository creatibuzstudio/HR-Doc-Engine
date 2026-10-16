"use client";

import React from "react";
import { Check } from "lucide-react";
import { FirstParty, SecondParty, DocSettings } from "@/types";

export interface EmailBodyPreviewProps {
  isHrHiring: boolean;
  isCertificate: boolean;
  isInternship: boolean;
  displayName: string;
  firstParty: FirstParty;
  secondParty: SecondParty;
  docSettings?: DocSettings;
  candidateLink: string;
  copied: boolean;
  onCopy: () => void;
}

export function EmailBodyPreview({
  isHrHiring,
  isCertificate,
  isInternship,
  displayName,
  firstParty,
  secondParty,
  docSettings,
  candidateLink,
  copied,
  onCopy,
}: EmailBodyPreviewProps) {
  if (isHrHiring) {
    const hrPosition = docSettings?.hrPositionName || "Open Position";
    const hrVacancies = docSettings?.hrVacancies ?? 1;
    const hrStartDate = docSettings?.hrRecruitmentStartDate || "—";
    const hrEndDate = docSettings?.hrRecruitmentEndDate || "—";
    const hrPreparedBy =
      docSettings?.hrPreparedByName ||
      firstParty.hrName ||
      firstParty.representedBy;
    const hrDesig =
      docSettings?.hrPreparedByDesignation || "Head of HR Department";
    const hrContact =
      firstParty.email || firstParty.mobileNumber || "info@creatibuzstudio.com";

    return (
      <div className="space-y-4">
        <p>Dear {displayName},</p>
        <p>I hope this email finds you well.</p>
        <p>
          This is to formally notify you that kindly find attached the official{" "}
          <strong className="text-violet-700">HR Hiring Notice</strong> for the
          recruitment of{" "}
          <strong>
            {hrPosition} ({hrVacancies}{" "}
            {hrVacancies === 1 ? "vacancy" : "vacancies"})
          </strong>
          , scheduled between <strong>{hrStartDate}</strong> and{" "}
          <strong>{hrEndDate}</strong>.
        </p>
        <p>
          This notice has been prepared and issued by{" "}
          <strong>{hrPreparedBy}</strong>, {hrDesig} to support our upcoming
          operational demands and project commitments.
        </p>
        <p>
          Kindly review the attached PDF for the full position breakdown and
          required skill set. If you have any questions or feedback, feel free to
          reach out to us at <strong>{hrContact}</strong>.
        </p>
        <div className="p-3 bg-violet-50/70 border border-violet-100 rounded-xl flex items-center justify-between text-xs font-semibold text-violet-800">
          <span>Attachment: HR Hiring Notice PDF</span>
          <span className="text-[10px] bg-violet-200/60 px-2 py-0.5 rounded-full font-bold">
            Attached
          </span>
        </div>
      </div>
    );
  }

  if (isCertificate) {
    return (
      <div className="space-y-4">
        <p>Dear {displayName},</p>
        <p>Congratulations on completing your internship!</p>
        <p>
          On behalf of <strong>{firstParty.companyName}</strong>, we are pleased
          to congratulate you on successfully completing your internship as a{" "}
          <strong>{secondParty.position}</strong>.
        </p>
        <p>
          We want to thank you for your commitment, hard work, and contributions
          to our growth during your tenure. Your performance grade was evaluated
          as{" "}
          <strong className="text-indigo-600 font-bold">
            {docSettings?.certPerformanceGrade || "Outstanding"}
          </strong>
          .
        </p>
        <p>
          Kindly find attached your official, digitally-signed{" "}
          <strong>Certificate of Internship Completion</strong>. We wish you the
          absolute best in all your future endeavors.
        </p>
        <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center justify-between text-xs font-semibold text-indigo-800">
          <span>Attachment: Internship Certificate (Landscape PDF)</span>
          <span className="text-[10px] bg-indigo-200/60 px-2 py-0.5 rounded-full font-bold">
            Attached
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <p>Dear {displayName},</p>
      {isInternship ? (
        <>
          <p>
            On behalf of <strong>{firstParty.companyName}</strong>, we are
            pleased to extend to you our official offer of internship for the
            position of <strong>{secondParty.position}</strong>.
          </p>
          <p>Your offer details have been finalized. To complete the process:</p>
          <ol className="list-decimal pl-5 space-y-2 font-medium text-slate-600">
            <li>Review the full internship offer letter terms.</li>
            <li>Apply your digital signature to the signature block.</li>
            <li>Press the Confirm button once everything looks correct.</li>
          </ol>
        </>
      ) : (
        <>
          <p>
            We are pleased to offer you a{" "}
            <strong>
              {docSettings?.employmentType || "Project-Based Contract"}
            </strong>{" "}
            at <strong>{firstParty.companyName || "Creatibuz Studio"}</strong> as{" "}
            <strong>{secondParty.position || "Team Member"}</strong>.
          </p>
          <p>
            Please review the terms of this offer and apply your digital
            signature to complete the agreement:
          </p>
          <ol className="list-decimal pl-5 space-y-2 font-medium text-slate-600">
            <li>Review the contract scope and compensation terms.</li>
            <li>Apply your digital signature to the signature block.</li>
            <li>Press Confirm once everything looks correct.</li>
          </ol>
        </>
      )}

      {/* Portal link card */}
      <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl space-y-3">
        <p className="text-xs font-bold text-blue-900 uppercase tracking-wider">
          {isInternship
            ? "Intern Signature Portal Link"
            : "Candidate Signature Portal Link"}
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={candidateLink}
            className="bg-white border border-blue-200 rounded-xl px-3.5 py-2.5 text-xs text-blue-800 font-bold flex-1 select-all outline-none"
          />
          <button
            onClick={onCopy}
            className={`h-9 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              copied
                ? "bg-emerald-600 text-white"
                : "bg-white border border-blue-200 text-blue-800 hover:bg-blue-50"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" /> Copied
              </>
            ) : (
              "Copy"
            )}
          </button>
        </div>
        <p className="text-[10px] text-blue-600 font-semibold italic">
          * Open this link to review the document and sign as the candidate.
        </p>
      </div>

      <p>
        Should you have any questions, feel free to contact us at{" "}
        {firstParty.mobileNumber} or reply directly to this email.
      </p>
      <p className="pt-2 border-t border-slate-100 text-xs text-slate-500 font-medium">
        Best Regards,
        <br />
        <strong>{firstParty.representedBy}</strong>
        <br />
        {firstParty.role}, {firstParty.companyName}
      </p>
    </>
  );
}

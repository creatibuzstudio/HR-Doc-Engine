"use client";

import React from "react";
import { Clock, CheckCircle2 } from "lucide-react";

export function StatusBadge({
  status,
  agreementTemplate,
  docType,
}: {
  status: string;
  agreementTemplate?: string;
  docType?: string;
}) {
  const isHrHiring =
    agreementTemplate === "hrHiringNotice" || docType === "HR Hiring Notice";

  if (isHrHiring || status === "FULLY_EXECUTED") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
        <CheckCircle2 className="w-3 h-3" /> Executed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
      <Clock className="w-3 h-3" /> Pending
    </span>
  );
}

export function DocTypeBadge({
  docType,
  agreementTemplate,
}: {
  docType: string;
  agreementTemplate?: string;
}) {
  const isCert =
    agreementTemplate === "internCertificate" ||
    docType === "Intern Certificate";
  const isIntern =
    !isCert &&
    (agreementTemplate === "internship" ||
      docType?.toLowerCase().includes("intern") ||
      docType === "Intern Offer Letter");
  const isHrHiring =
    !isCert &&
    !isIntern &&
    (agreementTemplate === "hrHiringNotice" || docType === "HR Hiring Notice" || docType?.toLowerCase().includes("hiring"));

  if (isCert)
    return (
      <span className="inline-block text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-100">
        Internship Certificate
      </span>
    );
  if (isIntern)
    return (
      <span className="inline-block text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
        Internship Offer Letter
      </span>
    );
  if (isHrHiring)
    return (
      <span className="inline-block text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-100">
        HR Hiring Notice
      </span>
    );
  return (
    <span className="inline-block text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#FFF3EE] text-[#EA580C] border border-[#FF5722]/30">
      Contractual Offer
    </span>
  );
}

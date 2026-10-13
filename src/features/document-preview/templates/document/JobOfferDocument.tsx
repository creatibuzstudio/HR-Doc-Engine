"use client";

import React from "react";
import Image from "next/image";
import { JobOfferPayload } from "@/types";
import { A4_WIDTH } from "../../components/A4DocumentScaler";
import { buildVerifyUrl } from "@/lib/verifyUrl";
import DocumentLayout from "./DocumentLayout";
import DocumentHeader from "./DocumentHeader";
import DocumentMetadata from "./DocumentMetadata";
import DocumentFooter from "./DocumentFooter";

interface JobOfferDocumentProps {
  data: JobOfferPayload;
  previewRef?: React.RefObject<HTMLDivElement | null>;
}

export default function JobOfferDocument({
  data,
  previewRef,
}: JobOfferDocumentProps) {
  const verifyUrl = buildVerifyUrl(data.offerId);

  return (
    <div
      id="job-offer-container"
      className="flex flex-col select-text a4-document-sheet"
      style={{ width: A4_WIDTH }}
    >
      <DocumentLayout pageNum={1} refProp={previewRef}>
        <div className="z-10 flex flex-col px-10 pt-7 pb-4 gap-3 bg-white text-slate-900">
          <header className="flex justify-between items-center border-b-2 border-slate-900 pb-2 mb-1">
            <DocumentHeader />
            <DocumentMetadata
              refId={data.offerId}
              idLabel="Type"
              idValue="Job Offer Letter"
              verifyUrl={verifyUrl}
            />
          </header>

          <div className="text-center my-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-3 py-0.5 rounded-full">
              Permanent Employment Appointment
            </span>
            <h1 className="font-extrabold text-[18px] uppercase tracking-wide text-slate-900 mt-1 font-sans">
              Official Job Offer Letter
            </h1>
          </div>

          <p className="text-[11.5px] text-slate-600 leading-relaxed font-sans text-justify">
            Dear <strong>{data.secondParty.fullName || "Candidate"}</strong>,<br />
            On behalf of <strong>{data.firstParty.companyName}</strong>, we are thrilled to extend this formal offer of permanent employment for the role of <strong>{data.employmentTerms.designation}</strong> within our <strong>{data.employmentTerms.department}</strong>.
          </p>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-[11px] border-collapse font-sans">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="px-3 py-1.5 text-left font-bold uppercase w-[35%]">Offer Terms</th>
                  <th className="px-3 py-1.5 text-left font-bold uppercase">Specifications</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="even:bg-slate-50/60"><td className="px-3 py-1.5 font-semibold text-slate-500">Designation</td><td className="px-3 py-1.5 font-bold text-slate-900">{data.employmentTerms.designation}</td></tr>
                <tr className="even:bg-slate-50/60"><td className="px-3 py-1.5 font-semibold text-slate-500">Department</td><td className="px-3 py-1.5 text-slate-800 font-medium">{data.employmentTerms.department}</td></tr>
                <tr className="even:bg-slate-50/60"><td className="px-3 py-1.5 font-semibold text-slate-500">Official Joining Date</td><td className="px-3 py-1.5 text-slate-800 font-medium">{data.employmentTerms.joiningDate}</td></tr>
                <tr className="even:bg-slate-50/60"><td className="px-3 py-1.5 font-semibold text-slate-500">Gross Monthly Salary</td><td className="px-3 py-1.5 font-bold text-emerald-700">{data.employmentTerms.grossSalaryMonthly} {data.employmentTerms.currency}</td></tr>
                <tr className="even:bg-slate-50/60"><td className="px-3 py-1.5 font-semibold text-slate-500">Probation Period</td><td className="px-3 py-1.5 text-slate-800 font-medium">{data.employmentTerms.probationPeriodMonths} Months (Performance Review)</td></tr>
                <tr className="even:bg-slate-50/60"><td className="px-3 py-1.5 font-semibold text-slate-500">Notice Period</td><td className="px-3 py-1.5 text-slate-800 font-medium">{data.employmentTerms.noticePeriodDays} Days written notice</td></tr>
                <tr className="even:bg-slate-50/60"><td className="px-3 py-1.5 font-semibold text-slate-500">Work Mode</td><td className="px-3 py-1.5 text-slate-800 font-medium">{data.employmentTerms.workMode}</td></tr>
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed font-sans text-justify mt-1">
            As a full-time member of JEVXO, you will be entitled to company benefits, mentorship, and equity consideration based on company performance milestones. You agree to adhere to standard confidentiality and code of conduct policies.
          </p>

          <div className="grid grid-cols-2 gap-8 pt-8 mt-4 border-t border-slate-200">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold mb-2">Authorized Signatory (JEVXO):</p>
              <div className="w-40 border-t border-slate-400 pt-1" />
              <p className="text-[11.5px] font-bold text-slate-900">{data.firstParty.representedBy}</p>
              <p className="text-[10px] text-slate-500">{data.firstParty.role} • JEVXO</p>
            </div>

            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold mb-2">Candidate Acceptance:</p>
              {data.secondParty.signatureImg ? (
                <div className="h-9 mb-1">
                  <Image src={data.secondParty.signatureImg} alt="Candidate Signature" width={120} height={36} className="max-h-9 object-contain" />
                </div>
              ) : (
                <div className="h-9 flex items-center text-[10px] text-amber-600 font-semibold italic">
                  * Pending Digital Signature
                </div>
              )}
              <div className="w-40 border-t border-slate-400 pt-1" />
              <p className="text-[11.5px] font-bold text-slate-900">{data.secondParty.fullName || "Candidate Name"}</p>
              <p className="text-[10px] text-slate-500">{data.employmentTerms.designation}</p>
            </div>
          </div>
        </div>

        <DocumentFooter
          email="info@jevxo.com"
          website="www.jevxo.com"
          address="Silicon Tower, Hi-Tech Park, Rajshahi"
          pageNum={1}
          totalPages={1}
        />
      </DocumentLayout>
    </div>
  );
}

"use client";

import React from "react";
import Image from "next/image";
import { ContractAgreementPayload } from "@/types";
import { A4_WIDTH } from "../../components/A4DocumentScaler";
import { buildVerifyUrl } from "@/lib/verifyUrl";
import DocumentLayout from "./DocumentLayout";
import DocumentHeader from "./DocumentHeader";
import DocumentMetadata from "./DocumentMetadata";
import DocumentFooter from "./DocumentFooter";

interface ProjectContractDocumentProps {
  data: ContractAgreementPayload;
  previewRef?: React.RefObject<HTMLDivElement | null>;
}

export default function ProjectContractDocument({
  data,
  previewRef,
}: ProjectContractDocumentProps) {
  const verifyUrl = buildVerifyUrl(data.agreementId);

  return (
    <div
      id="contract-agreement-container"
      className="flex flex-col select-text a4-document-sheet"
      style={{ width: A4_WIDTH }}
    >
      <DocumentLayout pageNum={1} refProp={previewRef}>
        <div className="z-10 flex flex-col px-10 pt-7 pb-4 gap-3 bg-white text-slate-900">
          <header className="flex justify-between items-center border-b-2 border-slate-900 pb-2 mb-1">
            <DocumentHeader />
            <DocumentMetadata
              refId={data.agreementId}
              idLabel="Type"
              idValue="Contract Agreement"
              verifyUrl={verifyUrl}
            />
          </header>

          <div className="text-center my-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-3 py-0.5 rounded-full">
              Project Employment Deed
            </span>
            <h1 className="font-extrabold text-[18px] uppercase tracking-wide text-slate-900 mt-1 font-sans">
              Contractual Project-Based Agreement
            </h1>
          </div>

          <p className="text-[11.5px] text-slate-600 leading-relaxed font-sans text-justify">
            This Contractual Agreement is entered into between <strong>{data.firstParty.companyName}</strong> (represented by {data.firstParty.representedBy}, {data.firstParty.role}), and <strong>{data.secondParty.fullName || "The Contractor"}</strong> (NID: {data.secondParty.nidNumber || "Pending"}, Address: {data.secondParty.presentAddress || "N/A"}).
          </p>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-[11px] border-collapse font-sans">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="px-3 py-1.5 text-left font-bold uppercase w-[35%]">Contract Clause</th>
                  <th className="px-3 py-1.5 text-left font-bold uppercase">Specifications</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="even:bg-slate-50/60"><td className="px-3 py-1.5 font-semibold text-slate-500">Project Title</td><td className="px-3 py-1.5 font-bold text-slate-900">{data.projectTerms.projectName}</td></tr>
                <tr className="even:bg-slate-50/60"><td className="px-3 py-1.5 font-semibold text-slate-500">Contractor Role</td><td className="px-3 py-1.5 text-slate-800 font-medium">{data.secondParty.position}</td></tr>
                <tr className="even:bg-slate-50/60"><td className="px-3 py-1.5 font-semibold text-slate-500">Duration &amp; Term</td><td className="px-3 py-1.5 text-slate-800 font-medium">{data.projectTerms.duration} ({data.projectTerms.effectiveDate} to {data.projectTerms.expiryDate})</td></tr>
                <tr className="even:bg-slate-50/60"><td className="px-3 py-1.5 font-semibold text-slate-500">Remuneration Amount</td><td className="px-3 py-1.5 font-bold text-emerald-700">{data.projectTerms.remunerationAmount} {data.projectTerms.currency}</td></tr>
                <tr className="even:bg-slate-50/60"><td className="px-3 py-1.5 font-semibold text-slate-500">Milestone Payout</td><td className="px-3 py-1.5 text-slate-800 font-medium">{data.projectTerms.paymentMilestones}</td></tr>
                <tr className="even:bg-slate-50/60"><td className="px-3 py-1.5 font-semibold text-slate-500">Notice Period</td><td className="px-3 py-1.5 text-slate-800 font-medium">{data.projectTerms.noticePeriodDays} Days written notice</td></tr>
              </tbody>
            </table>
          </div>

          <div className="space-y-1 text-[11px] text-slate-600 leading-relaxed font-sans mt-1">
            <h4 className="font-bold uppercase text-[10.5px] text-slate-900 tracking-wider">Project Scope &amp; Deliverables:</h4>
            <p className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-700 italic">
              {data.projectTerms.projectScope || "Delivery of milestones in accordance with JEVXO agile sprint standards."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-8 mt-4 border-t border-slate-200">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold mb-2">First Party (JEVXO):</p>
              <div className="w-40 border-t border-slate-400 pt-1" />
              <p className="text-[11.5px] font-bold text-slate-900">{data.firstParty.representedBy}</p>
              <p className="text-[10px] text-slate-500">{data.firstParty.role} • JEVXO</p>
            </div>

            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold mb-2">Second Party (Contractor):</p>
              {data.secondParty.signatureImg ? (
                <div className="h-9 mb-1">
                  <Image src={data.secondParty.signatureImg} alt="Contractor Signature" width={120} height={36} className="max-h-9 object-contain" />
                </div>
              ) : (
                <div className="h-9 flex items-center text-[10px] text-amber-600 font-semibold italic">
                  * Pending Digital E-Signature
                </div>
              )}
              <div className="w-40 border-t border-slate-400 pt-1" />
              <p className="text-[11.5px] font-bold text-slate-900">{data.secondParty.fullName || "Contractor Name"}</p>
              <p className="text-[10px] text-slate-500">{data.secondParty.position || "Specialist"}</p>
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

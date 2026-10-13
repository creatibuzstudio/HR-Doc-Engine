"use client";

import React from "react";
import { HiringNoticePayload } from "@/types";
import { A4_WIDTH } from "../../components/A4DocumentScaler";
import { buildVerifyUrl } from "@/lib/verifyUrl";
import DocumentLayout from "./DocumentLayout";
import DocumentHeader from "./DocumentHeader";
import DocumentMetadata from "./DocumentMetadata";
import DocumentFooter from "./DocumentFooter";

interface HRHiringNoticeProps {
  data: HiringNoticePayload;
  previewRef?: React.RefObject<HTMLDivElement | null>;
}

export default function HRHiringNoticeDocument({
  data,
  previewRef,
}: HRHiringNoticeProps) {
  const verifyUrl = buildVerifyUrl(data.refId);

  return (
    <div
      id="hr-hiring-notice-container"
      className="flex flex-col select-text a4-document-sheet"
      style={{ width: A4_WIDTH }}
    >
      <DocumentLayout pageNum={1} refProp={previewRef}>
        <div className="z-10 flex flex-col px-10 pt-7 pb-4 gap-3 bg-white text-slate-900">
          <header className="flex justify-between items-center border-b-2 border-slate-900 pb-2 mb-1">
            <DocumentHeader />
            <DocumentMetadata
              refId={data.refId}
              idLabel="Type"
              idValue="HR Circular"
              verifyUrl={verifyUrl}
            />
          </header>

          <div className="text-center my-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-3 py-0.5 rounded-full">
              Internal HR Circular
            </span>
            <h1 className="font-extrabold text-[20px] uppercase tracking-wide text-slate-900 mt-2 font-sans">
              {data.title || "Job Requisition Notice"}
            </h1>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-2.5 text-[12px] font-sans space-y-1">
            <div className="grid grid-cols-[5rem_1fr]">
              <span className="text-slate-400 font-semibold">Date:</span>
              <span className="text-slate-700 font-medium">{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
            <div className="grid grid-cols-[5rem_1fr]">
              <span className="text-slate-400 font-semibold">To:</span>
              <span className="text-slate-900 font-bold">{data.recipient.role} — {data.recipient.name}</span>
            </div>
            <div className="grid grid-cols-[5rem_1fr]">
              <span className="text-slate-400 font-semibold">Subject:</span>
              <span className="text-slate-900 font-bold">Initiation of Recruitment for {data.title}</span>
            </div>
          </div>

          <p className="text-[12px] text-slate-600 leading-relaxed font-sans">
            Dear <strong className="text-slate-900">{data.recipient.name || data.recipient.role}</strong>,
          </p>

          <p className="text-[12px] text-slate-600 leading-relaxed font-sans text-justify">
            We are formally notifying you that the <strong>{data.department}</strong> is initiating recruitment for <strong>{data.title}</strong> to onboard <strong>{data.vacancies} qualified candidate(s)</strong>. The recruitment timeline is set from <strong>{data.startDate}</strong> to <strong>{data.endDate}</strong>.
          </p>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm mt-1">
            <table className="w-full text-[11px] border-collapse font-sans">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="px-3 py-1.5 text-left font-bold uppercase tracking-wide w-[38%]">Field</th>
                  <th className="px-3 py-1.5 text-left font-bold uppercase tracking-wide">Specification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="even:bg-slate-50/60"><td className="px-3 py-1.5 font-semibold text-slate-500">Department</td><td className="px-3 py-1.5 text-slate-800 font-medium">{data.department}</td></tr>
                <tr className="even:bg-slate-50/60"><td className="px-3 py-1.5 font-semibold text-slate-500">Vacancies</td><td className="px-3 py-1.5 text-slate-800 font-medium">{data.vacancies}</td></tr>
                <tr className="even:bg-slate-50/60"><td className="px-3 py-1.5 font-semibold text-slate-500">Employment Type</td><td className="px-3 py-1.5 text-slate-800 font-medium">{data.employmentType}</td></tr>
                <tr className="even:bg-slate-50/60"><td className="px-3 py-1.5 font-semibold text-slate-500">Work Mode &amp; Location</td><td className="px-3 py-1.5 text-slate-800 font-medium">{data.workMode} ({data.location})</td></tr>
                <tr className="even:bg-slate-50/60"><td className="px-3 py-1.5 font-semibold text-slate-500">Experience Required</td><td className="px-3 py-1.5 text-slate-800 font-medium">{data.experienceRequired}</td></tr>
              </tbody>
            </table>
          </div>

          <div className="mt-1">
            <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-700 mb-1.5 font-sans">
              Required Skill Tags:
            </h4>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex flex-wrap gap-1.5">
              {data.skills.map((skill) => (
                <span key={skill} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-2 border-t border-slate-200">
            <p className="text-[11px] text-slate-500 mb-2">Prepared By:</p>
            <div className="w-36 border-t border-slate-400 pt-1" />
            <p className="text-[12px] font-bold text-slate-900">{data.preparedBy.name}</p>
            <p className="text-[10px] text-slate-500">{data.preparedBy.designation} • JEVXO</p>
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

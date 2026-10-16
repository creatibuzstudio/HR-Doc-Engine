"use client";

import React from "react";
import { motion } from "motion/react";
import { FileText, Calendar } from "lucide-react";
import { SecondParty, DocSettings } from "@/types";
import { Field, IconInput, StepHeader } from "@/components/forms/FormPrimitives";

export interface ContractualStep2TermsProps {
  secondParty: SecondParty;
  setSecondParty: React.Dispatch<React.SetStateAction<SecondParty>>;
  docSettings: DocSettings;
  setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>;
  onClearError: () => void;
  currentYearStr: string;
}

export function ContractualStep2Terms({
  secondParty,
  setSecondParty,
  docSettings,
  setDocSettings,
  onClearError,
  currentYearStr,
}: ContractualStep2TermsProps) {
  const handleRefSerialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 3);
    setDocSettings((p) => ({
      ...p,
      refIdSerial: digits,
      refId: digits ? `CRB-CON-REF-${currentYearStr}-${digits.padStart(3, "0")}` : "",
    }));
  };

  const handleConSerialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 3);
    setSecondParty((p) => ({
      ...p,
      partnerIdSerial: digits,
      partnerId: digits ? `CRB-CON-${currentYearStr}-${digits.padStart(3, "0")}` : "",
    }));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <StepHeader
        title="Section 2: Contract Specifications & Terms"
        desc="Set employment type, subject line, issue date, and customized terms."
      />

      {/* Employment Type Selector */}
      <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-[#334155]">
          Employment Type *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              onClearError();
              setDocSettings((p) => ({
                ...p,
                employmentType: "Project-Based Contract",
                contractSubject: `Subject: ${
                  secondParty.position || "Full Stack Developer"
                } For A Project-Based Contract`,
              }));
            }}
            className={`p-3.5 rounded-xl border-2 text-left transition flex items-center justify-between cursor-pointer ${
              docSettings.employmentType === "Project-Based Contract"
                ? "border-[#22C55E] bg-[#F0FDF4] text-[#166534]"
                : "border-[#E2E8F0] bg-white text-[#475569] hover:border-[#CBD5E1]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                  docSettings.employmentType === "Project-Based Contract"
                    ? "bg-[#22C55E] text-white"
                    : "border border-slate-300"
                }`}
              >
                {docSettings.employmentType === "Project-Based Contract" && "✓"}
              </div>
              <span className="text-sm font-bold">Project-Based Contract</span>
            </div>
            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Milestone
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClearError();
              setDocSettings((p) => ({
                ...p,
                employmentType: "Full-Time Contract",
                contractSubject: `Subject: ${
                  secondParty.position || "Full Stack Developer"
                } For A Full-Time Contract`,
              }));
            }}
            className={`p-3.5 rounded-xl border-2 text-left transition flex items-center justify-between cursor-pointer ${
              docSettings.employmentType === "Full-Time Contract"
                ? "border-[#22C55E] bg-[#F0FDF4] text-[#166534]"
                : "border-[#E2E8F0] bg-white text-[#475569] hover:border-[#CBD5E1]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                  docSettings.employmentType === "Full-Time Contract"
                    ? "bg-[#22C55E] text-white"
                    : "border border-slate-300"
                }`}
              >
                {docSettings.employmentType === "Full-Time Contract" && "✓"}
              </div>
              <span className="text-sm font-bold">Full-Time Contract</span>
            </div>
            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Monthly
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Date Of Issue *">
          <IconInput
            icon={Calendar}
            type="text"
            placeholder="e.g. Oct 15 - 2026"
            value={docSettings.date}
            onChange={(e) => {
              onClearError();
              setDocSettings((p) => ({ ...p, date: e.target.value }));
            }}
          />
        </Field>

        <Field label="Subject Line *">
          <IconInput
            icon={FileText}
            type="text"
            placeholder="e.g. Subject: Creative Lead For A Project-Based Contract"
            value={docSettings.contractSubject || ""}
            onChange={(e) => {
              onClearError();
              setDocSettings((p) => ({ ...p, contractSubject: e.target.value }));
            }}
          />
        </Field>
      </div>

      {/* Contract Serials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl">
        <div>
          <label className="text-xs font-semibold text-[#475569] block mb-1">
            Agreement Reference ID (Unique) *
          </label>
          <div className="flex items-stretch bg-white border border-[#CBD5E1] rounded-xl overflow-hidden h-11">
            <div className="flex items-center px-3 bg-[#F1F5F9] border-r border-[#CBD5E1] text-[#64748B] font-mono text-xs font-bold">
              CRB-CON-REF-{currentYearStr}-
            </div>
            <input
              type="text"
              maxLength={3}
              value={docSettings.refIdSerial || ""}
              onChange={handleRefSerialChange}
              className="flex-1 px-3 text-sm font-mono font-bold focus:outline-none"
              placeholder="001"
            />
          </div>
          <p className="text-[11px] font-mono text-emerald-600 font-bold mt-1">
            {docSettings.refId || `CRB-CON-REF-${currentYearStr}-001`}
          </p>
        </div>

        <div>
          <label className="text-xs font-semibold text-[#475569] block mb-1">
            Contractor ID *
          </label>
          <div className="flex items-stretch bg-white border border-[#CBD5E1] rounded-xl overflow-hidden h-11">
            <div className="flex items-center px-3 bg-[#F1F5F9] border-r border-[#CBD5E1] text-[#64748B] font-mono text-xs font-bold">
              CRB-CON-{currentYearStr}-
            </div>
            <input
              type="text"
              maxLength={3}
              value={secondParty.partnerIdSerial || ""}
              onChange={handleConSerialChange}
              className="flex-1 px-3 text-sm font-mono font-bold focus:outline-none"
              placeholder="001"
            />
          </div>
          <p className="text-[11px] font-mono text-emerald-600 font-bold mt-1">
            {secondParty.partnerId || `CRB-CON-${currentYearStr}-001`}
          </p>
        </div>
      </div>

      {/* Terms Customization */}
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-[#0F172A] block mb-1">
            Term 01 — Scope Of Work And Deliverables
          </label>
          <textarea
            rows={3}
            value={docSettings.scopeOfWork || ""}
            onChange={(e) =>
              setDocSettings((p) => ({ ...p, scopeOfWork: e.target.value }))
            }
            className="w-full text-xs p-3 border border-[#CBD5E1] rounded-xl focus:border-[#FF5722] focus:outline-none bg-[#FAFAFA]"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#0F172A] block mb-1">
            Term 02 — Compensation And Payment
          </label>
          <textarea
            rows={3}
            value={docSettings.compensationDetails || ""}
            onChange={(e) =>
              setDocSettings((p) => ({ ...p, compensationDetails: e.target.value }))
            }
            className="w-full text-xs p-3 border border-[#CBD5E1] rounded-xl focus:border-[#FF5722] focus:outline-none bg-[#FAFAFA]"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#0F172A] block mb-1">
            Term 03 — Confidentiality And Data Protection
          </label>
          <textarea
            rows={2}
            value={docSettings.confidentialityTerms || ""}
            onChange={(e) =>
              setDocSettings((p) => ({ ...p, confidentialityTerms: e.target.value }))
            }
            className="w-full text-xs p-3 border border-[#CBD5E1] rounded-xl focus:border-[#FF5722] focus:outline-none bg-[#FAFAFA]"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#0F172A] block mb-1">
            Term 04 — Intellectual Property And Work Ownership
          </label>
          <textarea
            rows={3}
            value={docSettings.ipOwnershipTerms || ""}
            onChange={(e) =>
              setDocSettings((p) => ({ ...p, ipOwnershipTerms: e.target.value }))
            }
            className="w-full text-xs p-3 border border-[#CBD5E1] rounded-xl focus:border-[#FF5722] focus:outline-none bg-[#FAFAFA]"
          />
        </div>
      </div>
    </motion.div>
  );
}

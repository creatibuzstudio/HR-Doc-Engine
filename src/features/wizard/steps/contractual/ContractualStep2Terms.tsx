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
      refId: digits ? `CBS/REF-${currentYearStr}/${digits.padStart(3, "0")}` : "",
    }));
  };

  const handleConSerialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 3);
    setSecondParty((p) => ({
      ...p,
      partnerIdSerial: digits,
      partnerId: digits ? `CBS-EMP-${digits.padStart(3, "0")}` : "",
    }));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <StepHeader
        title="Section 2: Contract Specifications"
        desc="Set subject line, issue date, and document reference numbers."
      />

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 bg-nav border border-gray-300/20 rounded-2xl">
        <div>
          <label className="text-xs font-semibold text-[#475569] block mb-1">
            Agreement Reference ID (Ref No) *
          </label>
          <div className="flex items-stretch bg-card border border-gray-300/25 rounded-xl overflow-hidden h-11">
            <div className="flex items-center px-3 bg-card border-r border-gray-300/50 text-[#64748B] font-mono text-xs font-bold">
              CBS/REF-{currentYearStr}/
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
          <p className="text-xs font-mono text-emerald-600 font-bold mt-1 ml-27">
            {docSettings.refId || `CBS/REF-${currentYearStr}/001`}
          </p>
        </div>

        <div>
          <label className="text-xs font-semibold text-[#475569] block mb-1">
            Employee / Contractor ID (ID No) *
          </label>
          <div className="flex items-stretch bg-card border border-gray-300/25 rounded-xl overflow-hidden h-11">
            <div className="flex items-center px-3 bg-card border-r border-gray-300/50 text-[#64748B] font-mono text-xs font-bold">
              CBS-EMP-
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
          <p className="text-xs font-mono text-emerald-600 font-bold mt-1 ml-21">
            {secondParty.partnerId || "CBS-EMP-001"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

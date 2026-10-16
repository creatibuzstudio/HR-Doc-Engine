"use client";

import React from "react";
import { motion } from "motion/react";
import { FileText, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { FirstParty, DocSettings } from "@/types";
import HRRecipientStep from "../steps/hr/HRRecipientStep";
import HRJobDetailsStep from "../steps/hr/HRJobDetailsStep";
import { HRSignatureStep } from "../steps/hr/HRSignatureStep";

const STEP_LABELS = ["1. Recipient & Title", "2. Job Details", "3. HR Signature"];
const TOTAL_STEPS = 3;

interface HRHiringNoticeWizardProps {
  activeStep: number;
  firstParty: FirstParty;
  setFirstParty: React.Dispatch<React.SetStateAction<FirstParty>>;
  validationError: string;
  onClearError: () => void;
  onNext: () => void;
  onPrev: () => void;
  docSettings: DocSettings;
  setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>;
}

export default function HRHiringNoticeWizard({
  activeStep,
  firstParty,
  setFirstParty,
  validationError,
  onClearError,
  onNext,
  onPrev,
  docSettings,
  setDocSettings,
}: HRHiringNoticeWizardProps) {
  const stepContent =
    activeStep === 1 ? (
      <HRRecipientStep
        docSettings={docSettings}
        setDocSettings={setDocSettings}
      />
    ) : activeStep === 2 ? (
      <HRJobDetailsStep
        docSettings={docSettings}
        setDocSettings={setDocSettings}
      />
    ) : (
      <HRSignatureStep
        firstParty={firstParty}
        setFirstParty={setFirstParty}
        onClearError={onClearError}
        docSettings={docSettings}
        setDocSettings={setDocSettings}
      />
    );

  return (
    <motion.section
      key="hr-hiring-wizard"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto w-full px-4 py-8 md:py-12"
    >
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl md:text-2xl font-bold text-[#0F172A] flex items-center gap-2">
            <FileText className="text-[#7C3AED] w-6 h-6" /> HR Hiring Notice
          </h2>
          <span className="text-xs bg-violet-50 border border-violet-200 px-3 py-1 rounded-full text-violet-700 font-bold">
            Step {activeStep} of {TOTAL_STEPS}
          </span>
        </div>
        <div className="w-full bg-violet-100 h-2 rounded-full overflow-hidden flex">
          {Array.from({ length: TOTAL_STEPS }).map((_, idx) => (
            <div
              key={idx}
              className={`h-full flex-1 transition-all duration-300 ${
                idx + 1 <= activeStep ? "bg-[#7C3AED]" : "bg-violet-100"
              } ${idx < TOTAL_STEPS - 1 ? "border-r border-white" : ""}`}
            />
          ))}
        </div>
        <div className="flex gap-2 mt-4 flex-wrap">
          {STEP_LABELS.map((label, idx) => (
            <span
              key={idx}
              className={`text-[10px] font-bold px-3 py-1 rounded-full border transition ${
                idx + 1 === activeStep
                  ? "bg-[#7C3AED] border-[#7C3AED] text-white"
                  : idx + 1 < activeStep
                  ? "bg-violet-50 border-[#7C3AED] text-[#7C3AED]"
                  : "bg-white border-violet-200 text-[#94A3B8]"
              }`}
            >
              {idx + 1 < activeStep ? (
                <span className="inline-flex items-center gap-1">
                  <Check className="w-2.5 h-2.5" />
                  {label}
                </span>
              ) : (
                label
              )}
            </span>
          ))}
        </div>
      </div>
      <div className="bg-white border border-[#DBEAFE] rounded-3xl p-6 md:p-8 shadow-sm min-h-[340px]">
        {validationError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl">
            {validationError}
          </div>
        )}
        {stepContent}
      </div>
      <div className="flex justify-between mt-6 gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={activeStep === 1}
          className="flex items-center gap-2 px-5 py-3 border border-[#DBEAFE] hover:border-[#7C3AED] text-[#334155] font-bold text-sm rounded-2xl transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 px-7 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-sm rounded-2xl transition shadow-md shadow-violet-500/20 cursor-pointer"
        >
          {activeStep === TOTAL_STEPS ? (
            <>
              <Check className="w-4 h-4" /> Preview Notice
            </>
          ) : (
            <>
              Next <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </motion.section>
  );
}

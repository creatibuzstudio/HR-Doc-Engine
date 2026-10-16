"use client";

import React from "react";
import { motion } from "motion/react";
import { Award, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { FirstParty, SecondParty, DocSettings } from "@/types";
import { CertificateLookupStep } from "../steps/certificate/CertificateLookupStep";
import { CertificateSignatureStep } from "../steps/certificate/CertificateSignatureStep";

const STEP_LABELS = ["1. Intern Lookup & Hydration", "2. Signature Block"];
const TOTAL_STEPS = 2;

interface InternCertificateWizardProps {
  activeStep: number;
  secondParty: SecondParty;
  setSecondParty: React.Dispatch<React.SetStateAction<SecondParty>>;
  firstParty: FirstParty;
  setFirstParty: React.Dispatch<React.SetStateAction<FirstParty>>;
  validationError: string;
  onClearError: () => void;
  onNext: () => void;
  onPrev: () => void;
  docSettings: DocSettings;
  setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>;
}

export default function InternCertificateWizard({
  activeStep,
  secondParty,
  setSecondParty,
  firstParty,
  setFirstParty,
  validationError,
  onClearError,
  onNext,
  onPrev,
  docSettings,
  setDocSettings,
}: InternCertificateWizardProps) {
  const stepContent =
    activeStep === 1 ? (
      <CertificateLookupStep
        secondParty={secondParty}
        setSecondParty={setSecondParty}
        docSettings={docSettings}
        setDocSettings={setDocSettings}
        onClearError={onClearError}
      />
    ) : (
      <CertificateSignatureStep
        firstParty={firstParty}
        setFirstParty={setFirstParty}
        onClearError={onClearError}
      />
    );

  return (
    <motion.section
      key="internCertificateForm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto w-full px-4 py-8 md:py-12"
    >
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl md:text-2xl font-bold text-[#0F172A] flex items-center gap-2">
            <Award className="text-[#6366F1] w-6 h-6" />
            Intern Certificate Wizard
          </h2>
          <span className="text-xs bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full text-[#6366F1] font-bold">
            Step {activeStep} of {TOTAL_STEPS}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#DBEAFE] h-2 rounded-full overflow-hidden flex">
          {Array.from({ length: TOTAL_STEPS }).map((_, idx) => (
            <div
              key={idx}
              className={`h-full flex-1 transition-all duration-300 ${
                idx + 1 <= activeStep ? "bg-[#6366F1]" : "bg-[#DBEAFE]"
              } ${idx < TOTAL_STEPS - 1 ? "border-r border-white" : ""}`}
            />
          ))}
        </div>

        {/* Step pills */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {STEP_LABELS.map((label, idx) => (
            <span
              key={idx}
              className={`text-[10px] font-bold px-3 py-1 rounded-full border transition ${
                idx + 1 === activeStep
                  ? "bg-[#6366F1] border-[#6366F1] text-white"
                  : idx + 1 < activeStep
                  ? "bg-indigo-50 border-[#6366F1] text-[#6366F1]"
                  : "bg-white border-[#DBEAFE] text-[#94A3B8]"
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

      {/* Content box */}
      <div className="bg-white border border-[#DBEAFE] rounded-3xl p-6 md:p-8 shadow-sm min-h-[340px]">
        {validationError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl">
            {validationError}
          </div>
        )}
        {stepContent}
      </div>

      {/* Footer navigation */}
      <div className="flex justify-between mt-6 gap-3">
        <button
          onClick={onPrev}
          disabled={activeStep === 1}
          className="flex items-center gap-2 px-5 py-3 border border-[#DBEAFE] hover:border-[#6366F1] text-[#334155] font-bold text-sm rounded-2xl transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-7 py-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold text-sm rounded-2xl transition shadow-md shadow-[#6366F1]/20 cursor-pointer"
        >
          {activeStep === TOTAL_STEPS ? (
            <>
              <Check className="w-4 h-4" /> Preview Certificate
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

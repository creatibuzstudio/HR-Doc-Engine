"use client";

import React, { useEffect } from "react";
import { motion } from "motion/react";
import { FileText, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { FirstParty, SecondParty, DocSettings } from "@/types";
import { ContractualStep1Candidate } from "../steps/contractual/ContractualStep1Candidate";
import { ContractualStep2Terms } from "../steps/contractual/ContractualStep2Terms";
import { ContractualStep3Auth } from "../steps/contractual/ContractualStep3Auth";

const STEP_LABELS = ["1. Candidate Info", "2. Contract Terms", "3. Authorization"];
const TOTAL_STEPS = 3;

interface ContractualFormWizardProps {
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

export default function ContractualFormWizard({
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
}: ContractualFormWizardProps) {
  const currentYearStr = new Date().getFullYear().toString().slice(-2);

  // Auto-fetch next Contractual sequential IDs on mount
  useEffect(() => {
    let cancelled = false;
    fetch("/api/check-id?action=nextContract")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const empId = data.employeeId || data.partnerId || data.contractualId;
        const refNo = data.contractRef || data.contractualRefId || data.agreementId;
        const conSerial = empId?.split(/[-/]/).pop() || "001";
        const refSerial = refNo?.split(/[-/]/).pop() || "001";
        setSecondParty((p) => ({
          ...p,
          partnerId: empId,
          partnerIdSerial: conSerial,
        }));
        setDocSettings((p) => ({
          ...p,
          contractRef: refNo,
          refId: refNo,
          refIdSerial: refSerial,
          employmentType: p.employmentType || "Project-Based Contract",
          contractSubject:
            p.contractSubject ||
            `Subject: ${secondParty.position || "Full Stack Developer"} For A ${p.employmentType || "Project-Based Contract"
            }`,
          scopeOfWork:
            p.scopeOfWork ||
            "All deliverables must be completed strictly in accordance with the approved project scope. Any substantial modifications to the scope, timeline, or deliverables require prior mutual written approval from both parties.",
          compensationDetails:
            p.compensationDetails ||
            "The Agency will issue payments strictly in accordance with the mutually agreed schedule, milestones, and written acceptance criteria. Furthermore, any approved out-of-scope work will be evaluated and compensated separately.",
          confidentialityTerms:
            p.confidentialityTerms ||
            "All confidential information, client data, credentials, and project assets must remain strictly protected and non-disclosed to unauthorized parties during and after the engagement, per applicable law.",
          ipOwnershipTerms:
            p.ipOwnershipTerms ||
            "Ownership of deliverables transfers upon receipt of full payment for the relevant work. Pre-existing tools, third-party assets, and licensed materials remain subject to their respective rights and licenses.",
        }));
      })
      .catch(console.error);

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.section
      key="contractualForm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto w-full px-4 py-8 md:py-12"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
            <div className="p-2 bg-primary/20 text-primary rounded-xl">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            Joining Offer Letter &amp; Work Agreement
          </h2>
          <span className="text-xs bg-secondary border border-border px-3 py-1 rounded-full text-primary font-bold">
            Step {activeStep} of {TOTAL_STEPS}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden flex border border-border">
          {Array.from({ length: TOTAL_STEPS }).map((_, idx) => (
            <div
              key={idx}
              className={`h-full flex-1 transition-all duration-300 ${idx + 1 <= activeStep ? "bg-primary" : "bg-transparent"
                } ${idx < TOTAL_STEPS - 1 ? "border-r border-border" : ""}`}
            />
          ))}
        </div>

        {/* Step pills */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {STEP_LABELS.map((label, idx) => (
            <span
              key={idx}
              className={`text-[10px] font-bold px-3 py-1 rounded-full border transition ${idx + 1 === activeStep
                ? "bg-primary border-primary text-primary-foreground"
                : idx + 1 < activeStep
                  ? "bg-secondary border-border text-primary"
                  : "bg-secondary/40 border-border text-muted-foreground"
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

      {/* Step content container */}
      <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm min-h-[380px]">
        {validationError && (
          <div className="mb-5 p-3.5 bg-destructive/15 border border-destructive/30 text-destructive text-xs font-semibold rounded-xl flex items-center justify-between">
            <span>{validationError}</span>
            <button
              onClick={onClearError}
              className="text-destructive hover:opacity-80 text-xs font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {activeStep === 1 && (
          <ContractualStep1Candidate
            secondParty={secondParty}
            setSecondParty={setSecondParty}
            setDocSettings={setDocSettings}
            onClearError={onClearError}
          />
        )}

        {activeStep === 2 && (
          <ContractualStep2Terms
            secondParty={secondParty}
            setSecondParty={setSecondParty}
            docSettings={docSettings}
            setDocSettings={setDocSettings}
            onClearError={onClearError}
            currentYearStr={currentYearStr}
          />
        )}

        {activeStep === 3 && (
          <ContractualStep3Auth
            firstParty={firstParty}
            setFirstParty={setFirstParty}
            onClearError={onClearError}
          />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6 gap-3">
        <button
          onClick={onPrev}
          disabled={activeStep === 1}
          className="flex items-center gap-2 px-5 py-3 border border-border hover:border-primary text-foreground bg-secondary hover:bg-accent font-bold text-sm rounded-2xl transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-7 py-3 bg-primary hover:opacity-95 text-primary-foreground font-bold text-sm rounded-2xl transition shadow-lg shadow-primary/25 cursor-pointer"
        >
          {activeStep === TOTAL_STEPS ? (
            <>
              Preview Agreement <ChevronRight className="w-4 h-4" />
            </>
          ) : (
            <>
              Continue <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </motion.section>
  );
}

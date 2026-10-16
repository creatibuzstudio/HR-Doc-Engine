"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  Check,
  User,
  Briefcase,
  Mail,
  Phone,
  ShieldCheck,
  MapPin,
  Calendar,
  Hash,
  Upload,
} from "lucide-react";
import SignaturePad from "@/features/candidate-portal/components/SignaturePad";
import { FirstParty, SecondParty, DocSettings } from "@/types";
import { Field, IconInput, StepHeader } from "@/shared/ui/FormPrimitives";

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
  const [conWarning, setConWarning] = useState("");
  const [refWarning, setRefWarning] = useState("");

  // Auto-fetch next Contractual sequential IDs on mount
  useEffect(() => {
    let cancelled = false;
    fetch("/api/check-id?action=nextContract")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const conSerial = data.contractualId?.split("-").pop() || "001";
        const refSerial = data.contractualRefId?.split("-").pop() || "001";
        setSecondParty((p) => ({
          ...p,
          partnerId: data.contractualId,
          partnerIdSerial: conSerial,
        }));
        setDocSettings((p) => ({
          ...p,
          refId: data.contractualRefId,
          refIdSerial: refSerial,
          employmentType: p.employmentType || "Project-Based Contract",
          contractSubject:
            p.contractSubject ||
            `Subject: ${secondParty.position || "Full Stack Developer"} For A ${
              p.employmentType || "Project-Based Contract"
            }`,
          scopeOfWork:
            p.scopeOfWork ||
            "You Agree To Complete The Assigned Tasks, Deliverables, Revisions, And Documentation Specified In The Approved Project Scope. Any Substantial Change To The Scope, Timeline, Or Deliverables Must Be Approved By Both Parties Before Implementation.",
          compensationDetails:
            p.compensationDetails ||
            "The Agency Will Pay The Agreed Project Fee According To The Payment Schedule Specified In This Offer. Payment Milestones, Acceptance Criteria, And Any Applicable Deductions Must Be Agreed Upon In Writing. Approved Additional Work May Be Compensated Separately.",
          confidentialityTerms:
            p.confidentialityTerms ||
            "You Must Protect All Confidential Information, Client Data, Credentials, Business Documents, Project Files, And Internal Communications. Such Information Must Not Be Disclosed, Misused, Or Shared With Unauthorized Individuals During Or After The Engagement, Subject To Applicable Law.",
          ipOwnershipTerms:
            p.ipOwnershipTerms ||
            "Ownership And Transfer Of Project Deliverables, Including Designs, Source Files, Code, And Other Work Products, Will Be Governed By The Written Agreement And Applicable Law. Unless Otherwise Agreed, The Transfer Of Ownership To The Agency Or Its Client Will Take Effect Upon Receipt Of The Agreed Payment For The Relevant Deliverables. Pre-Existing Tools, Third-Party Assets, And Properly Licensed Materials Remain Subject To Their Applicable Rights And Licenses.",
        }));
      })
      .catch(console.error);

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onClearError();
      if (typeof reader.result === "string") {
        setFirstParty((p) => ({ ...p, signatureImg: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

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
              className={`h-full flex-1 transition-all duration-300 ${
                idx + 1 <= activeStep ? "bg-primary" : "bg-transparent"
              } ${idx < TOTAL_STEPS - 1 ? "border-r border-border" : ""}`}
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

        {/* ── STEP 1: Candidate / Contractor Details ────────────────────────── */}
        {activeStep === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <StepHeader
              title="Section 1: Contractor / Candidate Information"
              desc="Enter the contractor or employee details for the work agreement."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Candidate / Contractor Full Name *">
                <IconInput
                  icon={User}
                  type="text"
                  placeholder="e.g. Ashikur Rahman Ovi"
                  value={secondParty.fullName}
                  onChange={(e) => {
                    onClearError();
                    setSecondParty((p) => ({ ...p, fullName: e.target.value }));
                  }}
                />
              </Field>

              <Field label="Position / Role *">
                <IconInput
                  icon={Briefcase}
                  type="text"
                  placeholder="e.g. Full Stack Developer"
                  value={secondParty.position}
                  onChange={(e) => {
                    onClearError();
                    const newPos = e.target.value;
                    setSecondParty((p) => ({ ...p, position: newPos }));
                    setDocSettings((prev) => ({
                      ...prev,
                      contractSubject: `Subject: ${newPos} For A ${
                        prev.employmentType || "Project-Based Contract"
                      }`,
                    }));
                  }}
                />
              </Field>

              <Field label="Email Address *">
                <IconInput
                  icon={Mail}
                  type="email"
                  placeholder="e.g. candidate@example.com"
                  value={secondParty.email}
                  onChange={(e) => {
                    onClearError();
                    setSecondParty((p) => ({ ...p, email: e.target.value }));
                  }}
                />
              </Field>

              <Field label="Phone / Mobile Number *">
                <IconInput
                  icon={Phone}
                  type="text"
                  placeholder="e.g. +880 1581-782193"
                  value={secondParty.mobileNumber}
                  onChange={(e) => {
                    onClearError();
                    setSecondParty((p) => ({ ...p, mobileNumber: e.target.value }));
                  }}
                />
              </Field>

              <Field label="National ID / Passport Number">
                <IconInput
                  icon={ShieldCheck}
                  type="text"
                  placeholder="e.g. 5501234567"
                  value={secondParty.nidNumber}
                  onChange={(e) =>
                    setSecondParty((p) => ({ ...p, nidNumber: e.target.value }))
                  }
                />
              </Field>

              <Field label="Current Address">
                <IconInput
                  icon={MapPin}
                  type="text"
                  placeholder="e.g. Dhaka, Bangladesh"
                  value={secondParty.presentAddress}
                  onChange={(e) =>
                    setSecondParty((p) => ({ ...p, presentAddress: e.target.value }))
                  }
                />
              </Field>
            </div>
          </motion.div>
        )}

        {/* ── STEP 2: Contract Specifications & Terms ─────────────────────── */}
        {activeStep === 2 && (
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
        )}

        {/* ── STEP 3: Founder & CEO Authorization ─────────────────────────── */}
        {activeStep === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <StepHeader
              title="Section 3: Founder & CEO Authorization"
              desc="Sign or verify your signature as the issuing authority (Md. Abdul Hakim, Founder & CEO)."
            />

            <div className="p-4 bg-[#FFF8F5] border border-[#FF5722]/30 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#0F172A] block">
                  Authorizing Executive
                </span>
                <span className="text-sm font-extrabold text-[#EA580C]">
                  {firstParty.representedBy || "Md. Abdul Hakim"} (Founder &amp; CEO)
                </span>
                <span className="text-[11px] text-[#64748B] block mt-0.5">
                  Creatibuz Studio &middot; {firstParty.ceoMobile || "+8801968657353"}
                </span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FF5722] text-white px-3 py-1 rounded-full">
                Issuer
              </span>
            </div>

            <SignaturePad
              onSave={(dataUrl) => {
                onClearError();
                setFirstParty((p) => ({ ...p, signatureImg: dataUrl }));
              }}
              onClear={() => setFirstParty((p) => ({ ...p, signatureImg: "" }))}
              savedImage={firstParty.signatureImg}
            />

            <div className="flex items-center gap-4 my-2 text-[#64748B] text-xs font-bold uppercase tracking-wider">
              <div className="flex-1 h-[1px] bg-[#E2E8F0]" />
              <span>Or Upload Signature File</span>
              <div className="flex-1 h-[1px] bg-[#E2E8F0]" />
            </div>

            <div className="relative border-2 border-dashed border-[#CBD5E1] hover:border-[#FF5722]/60 rounded-2xl p-6 bg-[#F8FAFC]/50 hover:bg-[#F8FAFC] transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                onChange={handleSignatureUpload}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <Upload className="w-8 h-8 text-[#64748B] group-hover:text-[#FF5722] transition transform group-hover:scale-105" />
              <p className="text-xs text-[#334155] font-semibold uppercase tracking-wider">
                Click or drag &amp; drop signature image
              </p>
              <p className="text-[10px] text-[#64748B]">PNG, JPG, or SVG transparent signature.</p>
            </div>

            {firstParty.signatureImg && (
              <div className="p-4 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white border border-[#CBD5E1] rounded-xl shrink-0">
                    <img
                      src={firstParty.signatureImg}
                      alt="Founder Signature Preview"
                      className="w-16 h-8 object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-[#22C55E] font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Founder Signature Active
                    </p>
                    <p className="text-[10px] text-[#64748B]">
                      Ready for single-click dispatch to contractor.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFirstParty((p) => ({ ...p, signatureImg: "" }))}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}
          </motion.div>
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

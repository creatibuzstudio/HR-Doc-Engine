"use client";

import React from "react";
import { motion } from "motion/react";
import { Download, RefreshCw, FileText } from "lucide-react";
import CandidateSidebar from "./CandidateSidebar";
import WorkspaceCanvas from "@/features/workspace/components/WorkspaceCanvas";
import { FirstParty, SecondParty, DocSettings } from "@/types";

interface CandidatePortalProps {
  firstParty: FirstParty;
  secondParty: SecondParty;
  setSecondParty: React.Dispatch<React.SetStateAction<SecondParty>>;
  docSettings: DocSettings;
  setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>;
  isExporting: boolean;
  isCompleted: boolean;
  onExport: () => void;
  offerId: string;
  previewRefs: React.RefObject<HTMLDivElement | null>[];
  agreementTemplate?: string;
}

export default function CandidatePortal({
  firstParty,
  secondParty,
  setSecondParty,
  docSettings,
  setDocSettings,
  isExporting,
  isCompleted,
  onExport,
  offerId,
  previewRefs,
  agreementTemplate,
}: CandidatePortalProps) {
  const isHrHiring = agreementTemplate === "hrHiringNotice";

  // When signature is updated, stamp the date in docSettings
  const handleSignatureSaved = (hasSignature: boolean) => {
    setDocSettings((prev) => ({
      ...prev,
      partnerSignedDate: hasSignature
        ? new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
        : "",
    }));
  };

  // ── HR Notice: read-only view with PDF download only ─────────────────────
  if (isHrHiring) {
    return (
      <motion.section
        key="candidatePortalHR"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 flex flex-col xl:flex-row w-full relative min-h-0"
      >
        <div className="w-full xl:w-[360px] bg-card border-b xl:border-b-0 xl:border-r border-border flex flex-col shrink-0 xl:sticky xl:top-15 xl:h-[calc(100vh-60px)] xl:overflow-y-auto">
          <div className="p-6 space-y-5 flex-1">
            <div className="space-y-2">
              <span className="text-[10px] bg-primary/10 border border-primary/30 text-primary font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block">
                HR Recruitment Notice
              </span>
              <h2 className="text-xl font-bold text-foreground">Hiring Notice</h2>
              <p className="text-muted-foreground text-xs leading-relaxed">
                This is an official HR Hiring Notice from{" "}
                <strong className="text-foreground">{firstParty.companyName}</strong>.
                This notice is for your information and records — no action is required.
              </p>
            </div>

            <div className="bg-secondary/40 border border-border rounded-2xl p-4 space-y-2.5 text-xs">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-3.5 h-3.5 text-primary" />
                <span className="font-bold text-primary uppercase tracking-wide text-[10px]">Notice Details</span>
              </div>
              {docSettings.hrNoticeRefId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">Ref ID:</span>
                  <span className="font-bold text-foreground font-mono text-[11px]">{docSettings.hrNoticeRefId}</span>
                </div>
              )}
              {docSettings.hrPositionName && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">Position:</span>
                  <span className="font-bold text-foreground">{docSettings.hrPositionName}</span>
                </div>
              )}
              {docSettings.hrDepartment && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">Department:</span>
                  <span className="font-bold text-foreground">{docSettings.hrDepartment}</span>
                </div>
              )}
              {docSettings.hrVacancies != null && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">Vacancies:</span>
                  <span className="font-bold text-foreground">{docSettings.hrVacancies}</span>
                </div>
              )}
              {docSettings.hrEmploymentType && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">Type:</span>
                  <span className="font-bold text-foreground">{docSettings.hrEmploymentType}</span>
                </div>
              )}
              {(docSettings.hrRecruitmentStartDate || docSettings.hrRecruitmentEndDate) && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">Period:</span>
                  <span className="font-bold text-foreground text-right">
                    {docSettings.hrRecruitmentStartDate || "—"} → {docSettings.hrRecruitmentEndDate || "—"}
                  </span>
                </div>
              )}
            </div>

            <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl text-[11px] text-foreground font-medium leading-relaxed">
              You may download the official PDF of this notice for your records using the button below.
            </div>
          </div>

          <div className="p-5 border-t border-border bg-card shrink-0">
            <button
              onClick={onExport}
              disabled={isExporting}
              className="w-full py-3.5 px-6 bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed font-bold text-white text-sm rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer"
            >
              {isExporting ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> Generating PDF…</>
              ) : (
                <><Download className="w-4 h-4" /> Download Notice PDF</>
              )}
            </button>
            <p className="text-[10px] text-muted-foreground text-center mt-2 font-medium">A4 · Single page · Official HR Document</p>
          </div>
        </div>

        <WorkspaceCanvas
          firstParty={firstParty}
          secondParty={secondParty}
          settings={docSettings}
          previewRefs={previewRefs}
          isExporting={isExporting}
          onExport={onExport}
          isDemo={false}
          agreementTemplate={agreementTemplate}
        />
      </motion.section>
    );
  }

  // ── Offer Document Signing Portal ──────────────────────────────────────────
  return (
    <motion.section
      key="candidatePortal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col w-full relative min-h-0"
    >
      <div className="flex-1 min-h-0 flex flex-col xl:flex-row">
        <div className="sticky top-0 h-screen shrink-0">
          <CandidateSidebar
            firstParty={firstParty}
            secondParty={secondParty}
            setSecondParty={setSecondParty}
            isExporting={isExporting}
            isCompleted={isCompleted}
            onExport={onExport}
            offerId={offerId}
            agreementTemplate={agreementTemplate}
            onSignatureSaved={handleSignatureSaved}
          />
        </div>
        <WorkspaceCanvas
          firstParty={firstParty}
          secondParty={secondParty}
          settings={docSettings}
          previewRefs={previewRefs}
          isExporting={isExporting}
          onExport={onExport}
          isDemo={false}
          agreementTemplate={agreementTemplate}
        />
      </div>
    </motion.section>
  );
}

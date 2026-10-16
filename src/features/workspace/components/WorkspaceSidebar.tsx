"use client";

import React from "react";
import { Settings, User, BookOpen, Mail, RefreshCw, Download } from "lucide-react";
import { FirstParty, SecondParty, DocSettings, AgreementTemplate } from "@/types";
import { InternshipSettingsTab, HRSettingsTab, InternCertificateSettingsTab, ContractualSettingsTab } from "./sidebar/SettingsTab";
import { FirstPartyTab, SecondPartyTab } from "./sidebar/PartiesTab";

// ─── Main sidebar tabs configuration ─────────────────────────────────────────
const CONTRACT_TABS = [
  { id: "settings", label: "Contract Terms", icon: Settings },
  { id: "secondParty", label: "Contractor Info", icon: User },
  { id: "firstParty", label: "Issuer (Creatibuz)", icon: BookOpen },
];

const INTERN_TABS = [
  { id: "settings", label: "Offer Terms", icon: Settings },
  { id: "secondParty", label: "Intern Details", icon: User },
  { id: "firstParty", label: "Company Info", icon: BookOpen },
];

const HR_TABS = [
  { id: "settings", label: "Notice Details", icon: Settings },
  { id: "firstParty", label: "HR / Approval", icon: BookOpen },
];

const CERT_TABS = [
  { id: "settings", label: "Cert Details", icon: Settings },
  { id: "secondParty", label: "Intern Details", icon: User },
  { id: "firstParty", label: "Issuer Info", icon: BookOpen },
];

interface WorkspaceSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  docSettings: DocSettings;
  setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>;
  secondParty: SecondParty;
  setSecondParty: React.Dispatch<React.SetStateAction<SecondParty>>;
  firstParty: FirstParty;
  setFirstParty: React.Dispatch<React.SetStateAction<FirstParty>>;
  isExporting: boolean;
  onExport: () => void;
  isDemo: boolean;
  isOfferSent: boolean;
  onSendOffer: () => void;
  isOpeningModal?: boolean;
  agreementTemplate?: AgreementTemplate;
}

export default function WorkspaceSidebar({
  activeTab,
  setActiveTab,
  docSettings,
  setDocSettings,
  secondParty,
  setSecondParty,
  firstParty,
  setFirstParty,
  isExporting,
  onExport,
  isDemo,
  isOfferSent,
  onSendOffer,
  isOpeningModal = false,
  agreementTemplate,
}: WorkspaceSidebarProps) {
  const isContractual = agreementTemplate === "contractual";
  const isInternship = agreementTemplate === "internship";
  const isHrHiring = agreementTemplate === "hrHiringNotice";
  const isCertificate = agreementTemplate === "internCertificate";

  return (
    <div className="w-full xl:w-[500px] bg-card border-b xl:border-b-0 xl:border-r border-border flex flex-col xl:h-full overflow-hidden shrink-0">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <span className={`text-[10px] border font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block ${
            isContractual
              ? "bg-primary/10 border-primary/30 text-primary"
              : isCertificate
              ? "bg-indigo-950/40 border-indigo-500/30 text-indigo-400"
              : isInternship
              ? "bg-sky-950/40 border-sky-500/30 text-sky-400"
              : isHrHiring
              ? "bg-violet-950/40 border-violet-500/30 text-violet-400"
              : "bg-primary/10 border-primary/20 text-primary"
          }`}>
            {isContractual ? "Contractual Offer Ready!" : isCertificate ? "Intern Certificate Ready!" : isInternship ? "Internship Offer Ready!" : "HR Hiring Notice Ready!"}
          </span>
          <h2 className="text-xl font-bold text-foreground">
            Document Workspace
          </h2>
          <p className="text-muted-foreground text-xs">
            {isContractual
              ? "Fine-tune scope of work, compensation, and contract terms with live document preview."
              : isCertificate
              ? "Adjust certificate details with live landscape preview."
              : isInternship
              ? "Adjust internship offer details with live preview."
              : "Adjust hiring notice details with live document preview."}
          </p>
        </div>

        {/* Tab headers */}
        <div className="flex border-b border-border">
          {(isCertificate ? CERT_TABS : isInternship ? INTERN_TABS : isHrHiring ? HR_TABS : CONTRACT_TABS).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 pb-3 text-xs font-bold tracking-wide border-b-2 transition flex flex-col md:flex-row items-center justify-center gap-1.5 cursor-pointer ${activeTab === id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="space-y-5">
          {activeTab === "settings" && (
            isCertificate ? (
              <InternCertificateSettingsTab docSettings={docSettings} setDocSettings={setDocSettings} />
            ) : isInternship ? (
              <InternshipSettingsTab docSettings={docSettings} setDocSettings={setDocSettings} />
            ) : isHrHiring ? (
              <HRSettingsTab docSettings={docSettings} setDocSettings={setDocSettings} />
            ) : (
              <ContractualSettingsTab docSettings={docSettings} setDocSettings={setDocSettings} />
            )
          )}
          {activeTab === "secondParty" && (
            <SecondPartyTab secondParty={secondParty} setSecondParty={setSecondParty} />
          )}
          {activeTab === "firstParty" && (
            <FirstPartyTab firstParty={firstParty} setFirstParty={setFirstParty} />
          )}
        </div>
        {/* Export footer */}
        <div className="p-6 bg-card border-t border-border space-y-3 shrink-0">
          {isDemo ? (
            <div className="w-full py-4 px-6 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold rounded-2xl text-center">
              PDF Export Disabled in Demo Mode
            </div>
          ) : (isHrHiring || isCertificate) ? (
            /* HR Notice or Certificate: two-button layout — Email + Download PDF */
            <div className="space-y-2.5">
              <button
                onClick={onSendOffer}
                disabled={isOfferSent || isOpeningModal}
                className={`w-full py-3.5 px-6 font-bold text-white text-sm rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer disabled:bg-emerald-600 disabled:hover:bg-emerald-600 disabled:cursor-not-allowed ${
                  isCertificate
                    ? "bg-[#6366F1] hover:bg-[#4F46E5] shadow-indigo-500/10 hover:shadow-indigo-500/25"
                    : "bg-[#7C3AED] hover:bg-[#6D28D9] shadow-violet-500/10 hover:shadow-violet-500/25"
                }`}
              >
                {isOpeningModal ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> {isCertificate ? "Preparing Certificate…" : "Preparing Notice…"}</>
                ) : isOfferSent ? (
                  <><Mail className="w-4 h-4" /> {isCertificate ? "Certificate Sent Successfully" : "Notice Sent Successfully"}</>
                ) : (
                  <><Mail className="w-4 h-4" /> {isCertificate ? "Email Certificate to Intern" : "Email Notice to Recipient"}</>
                )}
              </button>
              <button
                onClick={onExport}
                disabled={isExporting}
                className="w-full py-3 px-6 bg-secondary border border-border hover:border-primary text-foreground font-bold text-sm rounded-2xl flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
              >
                {isExporting ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Generating PDF…</>
                ) : (
                  <><Download className="w-4 h-4" /> Download PDF</>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              <button
                onClick={onSendOffer}
                disabled={isOfferSent || isOpeningModal}
                className="w-full py-3.5 px-6 bg-primary hover:opacity-90 disabled:bg-emerald-600 disabled:hover:bg-emerald-600 disabled:cursor-not-allowed font-bold text-primary-foreground text-sm rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-md shadow-primary/20 cursor-pointer"
              >
                {isOpeningModal ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Preparing Offer Link…</>
                ) : isOfferSent ? (
                  <><Mail className="w-4 h-4" /> Sent Offer Letter Successfully</>
                ) : (
                  <><Mail className="w-4 h-4" /> Send Offer to Candidate</>
                )}
              </button>
              <button
                onClick={onExport}
                disabled={isExporting}
                className="w-full py-3 px-6 bg-secondary border border-border hover:border-primary text-foreground font-bold text-sm rounded-2xl flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
              >
                {isExporting ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Generating PDF…</>
                ) : (
                  <><Download className="w-4 h-4" /> Download PDF</>
                )}
              </button>
            </div>
          )}
          <div className="flex justify-between text-[11px] text-muted-foreground px-1 font-semibold">
            <span>A4 dimensions output</span>
            <span>1 page automatic layout</span>
          </div>
        </div>
      </div>
    </div>
  );
}

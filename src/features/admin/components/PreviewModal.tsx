"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { X, Loader2, Download, ExternalLink, FileText, Layout } from "lucide-react";
import {
  FirstParty,
  SecondParty,
  DocSettings,
  AgreementTemplate,
} from "@/types";
import { DEFAULT_COMPANY_DETAILS } from "@/data/defaults";
import A4DocumentScaler from "@/features/document-preview/components/A4DocumentScaler";
import InternshipDocumentPreview from "@/features/document-preview/components/InternshipDocumentPreview";
import ContractualOfferDocument from "@/features/document-preview/templates/document/ContractualOfferDocument";
import HRHiringNoticeDocument from "@/features/document-preview/templates/document/HRHiringNoticeDocument";
import InternCertificatePreview from "@/features/document-preview/components/InternCertificatePreview";

interface Props {
  agreementId: string | null;
  onClose: () => void;
}

export default function PreviewModal({ agreementId, onClose }: Props) {
  const [firstParty, setFirstParty] = useState<FirstParty | null>(null);
  const [secondParty, setSecondParty] = useState<SecondParty | null>(null);
  const [docSettings, setDocSettings] = useState<DocSettings | null>(null);
  const [agreementTemplate, setAgreementTemplate] = useState<AgreementTemplate>("contractual");
  const [letterPDFdata, setLetterPDFdata] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"pdf" | "live">("live");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dummyRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  // Close on ESC
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!agreementId) return;
    setFirstParty(null);
    setSecondParty(null);
    setDocSettings(null);
    setLetterPDFdata(null);
    setViewMode("live");
    setError("");
    setLoading(true);

    fetch(`/api/offers/${encodeURIComponent(agreementId)}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load agreement.");
        return r.json();
      })
      .then((data) => {
        const candidate = data.candidateDetails;
        if (candidate) {
          setFirstParty({
            companyName: DEFAULT_COMPANY_DETAILS.companyName,
            representedBy: DEFAULT_COMPANY_DETAILS.founderCEO,
            role: "Founder & CEO",
            ceoName: DEFAULT_COMPANY_DETAILS.founderCEO,
            ceoMobile: DEFAULT_COMPANY_DETAILS.ceoMobile,
            cooName: DEFAULT_COMPANY_DETAILS.coFounderCOO,
            cooMobile: DEFAULT_COMPANY_DETAILS.cooMobile,
            hrName: DEFAULT_COMPANY_DETAILS.coFounderCOO,
            hrMobile: DEFAULT_COMPANY_DETAILS.cooMobile,
            currentAddress: DEFAULT_COMPANY_DETAILS.officeAddress,
            permanentAddress: DEFAULT_COMPANY_DETAILS.officeAddress,
            mobileNumber: DEFAULT_COMPANY_DETAILS.contactNumber,
            nidNumber: "2874935543",
            email: DEFAULT_COMPANY_DETAILS.email,
            website: DEFAULT_COMPANY_DETAILS.website,
            signatureImg: DEFAULT_COMPANY_DETAILS.signatureImg,
          });
          setSecondParty({
            partnerId: candidate.employeeId || "",
            partnerIdSerial: "",
            fullName: candidate.fullName || "",
            email: candidate.email || "",
            guardianName: "",
            guardianRelation: "Father",
            mobileNumber: candidate.contactNumber || "",
            guardianMobile: "",
            presentAddress: candidate.livingAddress || "",
            permanentAddress: candidate.livingAddress || "",
            dob: "",
            nidNumber: "",
            position: candidate.position || "",
            bloodGroup: "Select",
            photoUrl: "",
            signatureImg: candidate.signatureImg || "",
          });
          setDocSettings({
            agreementTemplate: "contractual",
            contractRef: data.contractRef,
            refId: data.contractRef,
            employmentType: data.employmentType || "Project-Based Contract",
            contractSubject: data.contractSubject || "",
            date: data.issueDate || "",
          });
        } else {
          setFirstParty(data.firstParty);
          setSecondParty(data.secondParty);
          setDocSettings(data.docSettings);
        }
        if (data.letterPDFdata) {
          setLetterPDFdata(data.letterPDFdata);
          setViewMode("pdf");
        } else {
          setViewMode("live");
        }
        const t =
          (data.docSettings?.agreementTemplate as AgreementTemplate) ||
          (data.docType?.toLowerCase().includes("intern")
            ? "internship"
            : data.docType?.toLowerCase().includes("hiring")
            ? "hrHiringNotice"
            : data.docType?.toLowerCase().includes("certificate")
            ? "internCertificate"
            : "contractual");
        setAgreementTemplate(t);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [agreementId]);

  // CRITICAL FIX: Do not render modal when agreementId is null!
  if (!agreementId) return null;

  const isInternship = agreementTemplate === "internship";
  const isHrHiring = agreementTemplate === "hrHiringNotice";
  const isCert = agreementTemplate === "internCertificate";
  const pdfApiUrl = `/api/offers/${encodeURIComponent(agreementId)}/pdf`;

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 md:p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 border-b border-border bg-card/90 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-foreground text-sm md:text-base">Document Review</h2>
              {letterPDFdata ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  MongoDB PDF
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  Pending Signature
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{agreementId}</p>
          </div>

          <div className="flex items-center gap-2">
            {letterPDFdata && (
              <div className="flex items-center bg-secondary/80 p-0.5 rounded-lg border border-border text-xs">
                <button
                  onClick={() => setViewMode("pdf")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-bold transition cursor-pointer ${
                    viewMode === "pdf"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  Stored PDF
                </button>
                <button
                  onClick={() => setViewMode("live")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-bold transition cursor-pointer ${
                    viewMode === "live"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Layout className="w-3.5 h-3.5" />
                  Live Layout
                </button>
              </div>
            )}

            {letterPDFdata && (
              <>
                <a
                  href={pdfApiUrl}
                  download={`${agreementId}.pdf`}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg text-xs font-bold transition"
                  title="Download Stored PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </a>
                <a
                  href={pdfApiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition cursor-pointer ml-1"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-4 bg-background">
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-xs text-muted-foreground font-medium">Retrieving document from MongoDB...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400">
              {error}
            </div>
          )}

          {!loading && letterPDFdata && viewMode === "pdf" && (
            <div className="w-full h-full min-h-[72vh] flex flex-col">
              <iframe
                src={`${pdfApiUrl}#toolbar=1`}
                className="w-full flex-1 min-h-[72vh] rounded-xl border border-border bg-white shadow-inner"
                title="Document PDF Preview"
              />
            </div>
          )}

          {!loading && (!letterPDFdata || viewMode === "live") && firstParty && docSettings && (
            <div>
              {!letterPDFdata && (
                <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-500 flex items-center justify-between">
                  <span>Candidate has not finalized signature yet. Showing live layout preview:</span>
                </div>
              )}
              <A4DocumentScaler pageCount={1} orientation={isCert ? "landscape" : "portrait"}>
                {isCert && secondParty ? (
                  <InternCertificatePreview
                    firstParty={firstParty}
                    secondParty={secondParty}
                    settings={docSettings}
                    previewRefs={dummyRefs}
                  />
                ) : isHrHiring ? (
                  <HRHiringNoticeDocument
                    firstParty={firstParty}
                    settings={docSettings}
                    previewRefs={dummyRefs}
                  />
                ) : isInternship && secondParty ? (
                  <InternshipDocumentPreview
                    firstParty={firstParty}
                    secondParty={secondParty}
                    settings={docSettings}
                    previewRefs={dummyRefs}
                  />
                ) : secondParty ? (
                  <ContractualOfferDocument
                    firstParty={firstParty}
                    secondParty={secondParty}
                    settings={docSettings}
                    innerRef={dummyRefs[0]}
                  />
                ) : null}
              </A4DocumentScaler>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

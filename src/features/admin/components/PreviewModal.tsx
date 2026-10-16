"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, Loader2 } from "lucide-react";
import {
  FirstParty,
  SecondParty,
  DocSettings,
  AgreementTemplate,
} from "@/types";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dummyRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  useEffect(() => {
    if (!agreementId) return;
    setFirstParty(null);
    setSecondParty(null);
    setDocSettings(null);
    setError("");
    setLoading(true);

    fetch(`/api/offers/${encodeURIComponent(agreementId)}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load agreement.");
        return r.json();
      })
      .then((data) => {
        setFirstParty(data.firstParty);
        setSecondParty(data.secondParty);
        setDocSettings(data.docSettings);
        const t = (data.docSettings?.agreementTemplate as AgreementTemplate) ||
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

  const isInternship = agreementTemplate === "internship";
  const isHrHiring = agreementTemplate === "hrHiringNotice";
  const isCert = agreementTemplate === "internCertificate";

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="font-bold text-foreground text-base">Document Preview</h2>
            <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{agreementId}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-4 py-4 bg-background">
          {loading && (
            <div className="flex justify-center py-16">
              <Loader2 className="w-7 h-7 animate-spin text-primary" />
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400">
              {error}
            </div>
          )}

          {!loading && firstParty && docSettings && (
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
          )}
        </div>
      </div>
    </div>
  );
}

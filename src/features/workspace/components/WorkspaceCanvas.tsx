"use client";

import React from "react";
import InternshipDocumentPreview from "@/features/document-preview/components/InternshipDocumentPreview";
import InternCertificatePreview from "@/features/document-preview/components/InternCertificatePreview";
import HRHiringNoticeDocument from "@/features/document-preview/templates/document/HRHiringNoticeDocument";
import ContractualOfferDocument from "@/features/document-preview/templates/document/ContractualOfferDocument";
import A4DocumentScaler from "@/features/document-preview/components/A4DocumentScaler";
import {
  FirstParty,
  SecondParty,
  DocSettings,
} from "@/types";

interface WorkspaceCanvasProps {
  firstParty: FirstParty;
  secondParty: SecondParty;
  settings: DocSettings;
  previewRefs: React.RefObject<HTMLDivElement | null>[];
  isExporting: boolean;
  onExport: () => void;
  isDemo: boolean;
  agreementTemplate?: string;
}

export default function WorkspaceCanvas({
  firstParty,
  secondParty,
  settings,
  previewRefs,
  isExporting,
  isDemo,
  agreementTemplate,
}: WorkspaceCanvasProps) {
  const template = agreementTemplate ?? settings.agreementTemplate ?? "contractual";
  const isInternship = template === "internship";
  const isHrHiring = template === "hrHiringNotice";
  const isCertificate = template === "internCertificate";

  return (
    <div className="flex-1 bg-background flex flex-col items-center justify-start p-6 overflow-y-auto scroll-smooth">
      <div className={`w-full transition-all duration-300 ${isCertificate ? "max-w-[1180px]" : "max-w-[860px]"}`}>
        <A4DocumentScaler pageCount={1} orientation={isCertificate ? "landscape" : "portrait"}>
          {isCertificate ? (
            <InternCertificatePreview
              firstParty={firstParty}
              secondParty={secondParty}
              settings={settings}
              previewRefs={previewRefs}
            />
          ) : isHrHiring ? (
            <HRHiringNoticeDocument
              firstParty={firstParty}
              settings={settings}
              previewRefs={previewRefs}
            />
          ) : isInternship ? (
            <InternshipDocumentPreview
              firstParty={firstParty}
              secondParty={secondParty}
              settings={settings}
              previewRefs={previewRefs}
            />
          ) : (
            <ContractualOfferDocument
              firstParty={firstParty}
              secondParty={secondParty}
              settings={settings}
              innerRef={previewRefs[0]}
              isExporting={isExporting}
            />
          )}
        </A4DocumentScaler>
      </div>
      <div className="h-10 shrink-0" />
    </div>
  );
}

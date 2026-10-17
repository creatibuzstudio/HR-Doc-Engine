import React from "react";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";
import { arrayBufferToBase64 } from "@/lib/utils/pdfUtils";
import {
  SecondParty,
  DocSettings,
  AppState,
  AgreementTemplate,
} from "@/types";

interface AgreementExportParams {
  isExporting: boolean;
  setIsExporting: (v: boolean) => void;
  appState: AppState;
  isCandidateSigned: boolean;
  agreementTemplate: AgreementTemplate;
  previewRefs: React.RefObject<HTMLDivElement | null>[];
  offerId: string;
  secondParty: SecondParty;
  docSettings: DocSettings;
  setIsCandidateSigned: (v: boolean) => void;
}

export function useAgreementExport({
  isExporting,
  setIsExporting,
  appState,
  isCandidateSigned,
  agreementTemplate,
  previewRefs,
  offerId,
  secondParty,
  docSettings,
  setIsCandidateSigned,
}: AgreementExportParams) {
  const handleExportPDF = async () => {
    if (isExporting || (appState === "candidatePortal" && isCandidateSigned))
      return;
    setIsExporting(true);
    document.documentElement.classList.add("a4-exporting");
    try {
      const isLandscape = agreementTemplate === "internCertificate";
      const pdf = new jsPDF({
        orientation: isLandscape ? "l" : "p",
        unit: "mm",
        format: "a4",
        compress: true,
      });
      const pages = previewRefs
        .map((ref) => ref.current)
        .filter(
          (el): el is HTMLDivElement =>
            el != null && el.style.display !== "none",
        );
      if (!pages.length) {
        throw new Error("No document pages were available for PDF generation.");
      }
      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i] as HTMLElement, {
          scale: 2,
          useCORS: true,
          logging: false,
          allowTaint: false,
          backgroundColor: "#ffffff",
        });
        pdf.addImage(
          canvas.toDataURL("image/jpeg", 0.82),
          "JPEG",
          0,
          0,
          isLandscape ? 297 : 210,
          isLandscape ? 210 : 297,
          undefined,
          "FAST",
        );
        if (i < pages.length - 1) pdf.addPage();
      }

      if (appState === "candidatePortal") {
        const pdfData = arrayBufferToBase64(pdf.output("arraybuffer"));

        if (agreementTemplate === "hrHiringNotice") {
          const noticeName =
            docSettings.hrNoticeTitle?.trim() || "HR Hiring Notice";
          pdf.save(
            `${noticeName} - ${docSettings.hrNoticeRefId || "CREATIBUZ"}.pdf`,
          );
          document.documentElement.classList.remove("a4-exporting");
          setIsExporting(false);
          return;
        }

        const res = await fetch(`/api/offers/sign`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            offerId,
            signatureImg: secondParty.signatureImg,
            letterPDFdata: pdfData,
          }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(
            data?.error ||
              "Failed to finalize the agreement. Please try again.",
          );
        }

        setIsCandidateSigned(true);
        toast.success(
          data?.message ||
            "The fully executed document has been emailed to you and the Founder.",
        );
      } else {
        const isHrNotice = agreementTemplate === "hrHiringNotice";
        const isCertificate = agreementTemplate === "internCertificate";
        const isInternship = agreementTemplate === "internship";
        if (isHrNotice) {
          const noticeName = docSettings.hrNoticeTitle
            ? docSettings.hrNoticeTitle.trim()
            : "HR Hiring Notice";
          pdf.save(
            `${noticeName} - ${docSettings.hrNoticeRefId || "CREATIBUZ"}.pdf`,
          );
        } else if (isCertificate) {
          const internName = secondParty.fullName
            ? secondParty.fullName.trim()
            : "Intern";
          pdf.save(`${internName} - Internship Certificate.pdf`);
        } else if (isInternship) {
          const internName = secondParty.fullName
            ? secondParty.fullName.trim()
            : "Intern";
          pdf.save(`${internName} - Internship Offer Letter.pdf`);
        } else {
          const candidateName = secondParty.fullName
            ? secondParty.fullName.trim()
            : "Contractor";
          pdf.save(
            `${candidateName} - Joining Offer Letter & Work Agreement.pdf`,
          );
        }
      }
    } catch (err: unknown) {
      const e = err as Error;
      console.error("PDF export error:", e);
      toast.error("We had an issue generating your PDF: " + e.message);
    } finally {
      document.documentElement.classList.remove("a4-exporting");
      setIsExporting(false);
    }
  };

  return { handleExportPDF };
}

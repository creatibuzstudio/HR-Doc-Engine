import React from "react";
import { arrayBufferToBase64 } from "@/lib/utils/pdfUtils";
import {
  FirstParty,
  SecondParty,
  DocSettings,
  AgreementTemplate,
} from "@/types";

interface OfferSubmissionParams {
  firstParty: FirstParty;
  secondParty: SecondParty;
  docSettings: DocSettings;
  docType: string;
  agreementTemplate: AgreementTemplate;
  previewRefs: React.RefObject<HTMLDivElement | null>[];
  setisOpeningModal: (v: boolean) => void;
  setCandidateLink: (v: string) => void;
  setOfferId: (v: string) => void;
  setHrNoticePdfBase64: (v: string) => void;
  setEmailModalOpen: (v: boolean) => void;
}

export function useOfferSubmission({
  firstParty,
  secondParty,
  docSettings,
  docType,
  agreementTemplate,
  previewRefs,
  setisOpeningModal,
  setCandidateLink,
  setOfferId,
  setHrNoticePdfBase64,
  setEmailModalOpen,
}: OfferSubmissionParams) {
  const handleSendOffer = async () => {
    const isHrHiring = agreementTemplate === "hrHiringNotice";
    const isCertificate = agreementTemplate === "internCertificate";

    let hrNoticePdfBase64 = "";
    if (isHrHiring || isCertificate) {
      setisOpeningModal(true);
      try {
        document.documentElement.classList.add("a4-exporting");
        const { jsPDF } = await import("jspdf");
        const html2canvas = (await import("html2canvas-pro")).default;
        const pdf = new jsPDF({
          orientation: isCertificate ? "l" : "p",
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
        if (pages.length) {
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
              isCertificate ? 297 : 210,
              isCertificate ? 210 : 297,
              undefined,
              "FAST",
            );
            if (i < pages.length - 1) pdf.addPage();
          }
          hrNoticePdfBase64 = arrayBufferToBase64(pdf.output("arraybuffer"));
        }
      } catch (pdfErr) {
        console.warn("PDF pre-generation failed:", pdfErr);
      } finally {
        document.documentElement.classList.remove("a4-exporting");
      }
    } else {
      setisOpeningModal(true);
    }

    const tempId = Math.random().toString(36).substring(2, 11);
    const stateToSave = {
      firstParty,
      secondParty,
      docSettings,
      agreementTemplate,
    };
    localStorage.setItem(
      "creatibuz_offer_" + tempId,
      JSON.stringify(stateToSave),
    );

    let saved = false;
    let dbAgreementId = "";

    const endpoint = isCertificate ? "/api/offers/certificate" : "/api/offers";

    for (let i = 0; i < 3; i++) {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstParty,
            secondParty,
            docSettings,
            docType: isCertificate ? "Intern Certificate" : docType,
            agreementTemplate,
            ...(hrNoticePdfBase64 ? { letterPDFdata: hrNoticePdfBase64 } : {}),
          }),
        });

        if (res.ok) {
          const data = await res.json();
          dbAgreementId = data.agreementId;
          saved = true;
          break;
        }
      } catch (e) {
        console.error("Save attempt failed", e);
      }
      await new Promise((r) => setTimeout(r, 300));
    }

    setisOpeningModal(false);

    if (!saved || !dbAgreementId) {
      alert("Failed to save offer to database. Please try again.");
      return;
    }

    const link = `${window.location.origin}${window.location.pathname}?candidateView=${encodeURIComponent(dbAgreementId)}`;
    setCandidateLink(link);
    setOfferId(dbAgreementId);
    if ((isHrHiring || isCertificate) && hrNoticePdfBase64) {
      setHrNoticePdfBase64(hrNoticePdfBase64);
    }
    setEmailModalOpen(true);
  };

  return { handleSendOffer };
}

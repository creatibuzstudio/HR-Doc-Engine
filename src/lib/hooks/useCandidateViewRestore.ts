import { useEffect } from "react";
import {
  FirstParty,
  SecondParty,
  DocSettings,
  AppState,
  AgreementTemplate,
} from "@/types";

interface CandidateViewRestoreParams {
  setFirstParty: React.Dispatch<React.SetStateAction<FirstParty>>;
  setSecondParty: React.Dispatch<React.SetStateAction<SecondParty>>;
  setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>;
  setAgreementTemplate: React.Dispatch<React.SetStateAction<AgreementTemplate>>;
  setIsCandidateSigned: React.Dispatch<React.SetStateAction<boolean>>;
  setOfferId: React.Dispatch<React.SetStateAction<string>>;
  setIsDemo: React.Dispatch<React.SetStateAction<boolean>>;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  setIsLoadingOffer: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useCandidateViewRestore({
  setFirstParty,
  setSecondParty,
  setDocSettings,
  setAgreementTemplate,
  setIsCandidateSigned,
  setOfferId,
  setIsDemo,
  setAppState,
  setIsLoadingOffer,
}: CandidateViewRestoreParams) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const candidateViewId = params.get("candidateView");
    if (!candidateViewId) return;

    setIsLoadingOffer(true);
    const targetUrl = `/api/offers?id=${encodeURIComponent(candidateViewId)}`;
    fetch(targetUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Offer not found on backend.");
        return res.json();
      })
      .then((data) => {
        setFirstParty(data.firstParty);
        setSecondParty(data.secondParty);
        const refNo = data.contractRef || data.agreementId || candidateViewId;
        const empId =
          data.candidateDetails?.employeeId ||
          data.partnerId ||
          data.secondParty?.partnerId;

        setDocSettings({
          ...data.docSettings,
          refId: refNo,
          contractRefId: refNo,
          contractualRefId: refNo,
          contractRef: refNo,
          contractualId: empId,
          contractId: empId,
          partnerId: empId,
          ...(data.signedAt
            ? {
                partnerSignedDate: new Date(data.signedAt).toLocaleDateString(
                  "en-US",
                  { year: "numeric", month: "long", day: "numeric" },
                ),
              }
            : {}),
        });
        setAgreementTemplate(
          (data.docSettings?.agreementTemplate as AgreementTemplate) || "contractual",
        );
        setIsCandidateSigned(
          Boolean(
            data.partnerSigned ||
              data.isCandidateSigned ||
              data.status === "FINALISED" ||
              data.status === "FULLY_EXECUTED",
          ),
        );
        setOfferId(candidateViewId);
        setIsDemo(false);
        setAppState("candidatePortal");
        setIsLoadingOffer(false);
      })
      .catch((err) => {
        console.warn("Backend fetch failed, trying localStorage fallback:", err);
        const stored =
          localStorage.getItem("creatibuz_offer_" + candidateViewId) ||
          localStorage.getItem("jevxo_offer_" + candidateViewId);
        if (stored) {
          try {
            const data = JSON.parse(stored);
            setFirstParty(data.firstParty);
            const refNo = data.contractRef || data.agreementId || candidateViewId;
            const empId =
              data.candidateDetails?.employeeId ||
              data.partnerId ||
              data.secondParty?.partnerId;
            setDocSettings({
              ...data.docSettings,
              refId: refNo,
              contractRefId: refNo,
              contractualRefId: refNo,
              contractRef: refNo,
              contractualId: empId,
              contractId: empId,
              partnerId: empId,
            });
            setAgreementTemplate(
              (data.agreementTemplate as AgreementTemplate) ||
                data.docSettings?.agreementTemplate ||
                "contractual",
            );
            setIsCandidateSigned(
              Boolean(data.partnerSigned || data.status === "FULLY_EXECUTED"),
            );
            setOfferId(candidateViewId);
            setIsDemo(false);
            setAppState("candidatePortal");
          } catch (e) {
            console.error("Error loading offer data from localStorage", e);
          }
        }
        setIsLoadingOffer(false);
      });
  }, [
    setFirstParty,
    setSecondParty,
    setDocSettings,
    setAgreementTemplate,
    setIsCandidateSigned,
    setOfferId,
    setIsDemo,
    setAppState,
    setIsLoadingOffer,
  ]);
}

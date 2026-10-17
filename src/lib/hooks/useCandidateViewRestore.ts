import { useEffect } from "react";
import {
  FirstParty,
  SecondParty,
  DocSettings,
  AppState,
  AgreementTemplate,
} from "@/types";
import { DEFAULT_COMPANY_DETAILS } from "@/data/defaults";

const defaultCompanyFirstParty: FirstParty = {
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
};

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
        const candidate = data.candidateDetails;
        if (candidate) {
          setFirstParty(defaultCompanyFirstParty);
          setSecondParty((p) => ({
            ...p,
            partnerId: candidate.employeeId || "",
            fullName: candidate.fullName || "",
            email: candidate.email || "",
            mobileNumber: candidate.contactNumber || "",
            presentAddress: candidate.livingAddress || "",
            position: candidate.position || "",
            signatureImg: candidate.signatureImg || "",
          }));
        } else if (data.secondParty) {
          setFirstParty(data.firstParty || defaultCompanyFirstParty);
          setSecondParty(data.secondParty);
        }

        const refNo = data.contractRef || data.agreementId || candidateViewId;

        setDocSettings((p) => ({
          ...p,
          contractRef: refNo,
          refId: refNo,
          date: data.issueDate || p.date,
          employmentType: data.employmentType || p.employmentType,
          contractSubject: data.contractSubject || p.contractSubject,
          ...(candidate?.signatureDate || data.signedAt
            ? {
                partnerSignedDate: new Date(
                  candidate?.signatureDate || data.signedAt,
                ).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }),
              }
            : {}),
        }));
        setAgreementTemplate(
          (data.agreementTemplate as AgreementTemplate) ||
            (data.docSettings?.agreementTemplate as AgreementTemplate) ||
            "contractual",
        );
        setIsCandidateSigned(
          Boolean(
            data.isCandidateSigned ||
              data.partnerSigned ||
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
            const candidate = data.candidateDetails;
            if (candidate) {
              setFirstParty(defaultCompanyFirstParty);
              setSecondParty((p) => ({
                ...p,
                partnerId: candidate.employeeId || "",
                fullName: candidate.fullName || "",
                email: candidate.email || "",
                mobileNumber: candidate.contactNumber || "",
                presentAddress: candidate.livingAddress || "",
                position: candidate.position || "",
                signatureImg: candidate.signatureImg || "",
              }));
            } else if (data.secondParty) {
              setFirstParty(data.firstParty || defaultCompanyFirstParty);
              setSecondParty(data.secondParty);
            }
            const refNo = data.contractRef || data.agreementId || candidateViewId;
            setDocSettings((p) => ({
              ...p,
              contractRef: refNo,
              refId: refNo,
              date: data.issueDate || p.date,
              employmentType: data.employmentType || p.employmentType,
              contractSubject: data.contractSubject || p.contractSubject,
            }));
            setAgreementTemplate(
              (data.agreementTemplate as AgreementTemplate) ||
                data.docSettings?.agreementTemplate ||
                "contractual",
            );
            setIsCandidateSigned(
              Boolean(
                data.isCandidateSigned ||
                  data.partnerSigned ||
                  data.status === "FINALISED" ||
                  data.status === "FULLY_EXECUTED",
              ),
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

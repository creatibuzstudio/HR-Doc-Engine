import { useEffect } from "react";
import {
  FirstParty,
  SecondParty,
  DocSettings,
  AppState,
  AgreementTemplate,
} from "@/types";
import { useCandidateViewRestore } from "./useCandidateViewRestore";

interface IdPrefetchParams {
  cache: { nextIds?: { agreementId: string; partnerId: string } | null };
  agreementTemplate: AgreementTemplate;
  setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>;
  setSecondParty: React.Dispatch<React.SetStateAction<SecondParty>>;
  setFirstParty: React.Dispatch<React.SetStateAction<FirstParty>>;
  setAgreementTemplate: React.Dispatch<React.SetStateAction<AgreementTemplate>>;
  setIsCandidateSigned: React.Dispatch<React.SetStateAction<boolean>>;
  setOfferId: React.Dispatch<React.SetStateAction<string>>;
  setIsDemo: React.Dispatch<React.SetStateAction<boolean>>;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  setIsLoadingOffer: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useIdPrefetch({
  cache,
  agreementTemplate,
  setDocSettings,
  setSecondParty,
  setFirstParty,
  setAgreementTemplate,
  setIsCandidateSigned,
  setOfferId,
  setIsDemo,
  setAppState,
  setIsLoadingOffer,
}: IdPrefetchParams) {
  // Restore candidate view state if candidateView param exists
  useCandidateViewRestore({
    setFirstParty,
    setSecondParty,
    setDocSettings,
    setAgreementTemplate,
    setIsCandidateSigned,
    setOfferId,
    setIsDemo,
    setAppState,
    setIsLoadingOffer,
  });

  // Initial fetching of IDs — use prefetched cache when available
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("candidateView")
    )
      return;

    if (cache.nextIds) {
      const { agreementId, partnerId } = cache.nextIds;
      setDocSettings((p) => ({
        ...p,
        refId: agreementId,
        refIdSerial: agreementId.split("-").pop(),
      }));
      setSecondParty((p) => ({
        ...p,
        partnerId,
        partnerIdSerial: partnerId.split("-").pop(),
      }));
      return;
    }

    async function fetchNextIds() {
      try {
        const res = await fetch("/api/check-id?action=next");
        if (res.ok) {
          const data = await res.json();
          setDocSettings((p) => ({
            ...p,
            refId: data.agreementId,
            refIdSerial: data.agreementId.split("-").pop(),
          }));
          setSecondParty((p) => ({
            ...p,
            partnerId: data.partnerId,
            partnerIdSerial: data.partnerId.split("-").pop(),
          }));
        }
      } catch (err) {
        console.error("Failed to fetch next IDs", err);
      }
    }
    fetchNextIds();
  }, [cache.nextIds, setDocSettings, setSecondParty]);

  // Pre-load intern IDs
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("candidateView")
    )
      return;
    if (agreementTemplate !== "internship") return;
    async function fetchNextInternIds() {
      try {
        const res = await fetch("/api/check-id?action=nextIntern");
        if (res.ok) {
          const data = await res.json();
          const internSerial = data.internId?.split("-").pop() || "001";
          const refSerial = data.internRefId?.split("-").pop() || "001";
          setDocSettings((p) => ({
            ...p,
            internId: data.internId,
            internIdSerial: internSerial,
            internRefId: data.internRefId,
            internRefIdSerial: refSerial,
          }));
          setSecondParty((p) => ({
            ...p,
            partnerId: data.internId,
            partnerIdSerial: internSerial,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch next intern IDs", err);
      }
    }
    fetchNextInternIds();
  }, [agreementTemplate, setDocSettings, setSecondParty]);

  // Pre-load HR Hiring Notice IDs
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("candidateView")
    )
      return;
    if (agreementTemplate !== "hrHiringNotice") return;
    async function fetchNextHrIds() {
      try {
        const res = await fetch("/api/check-id?action=nextHrHiring");
        if (res.ok) {
          const data = await res.json();
          const refSerial = data.hrNoticeRefId?.split("-").pop() || "001";
          const idSerial = data.hrNoticeId?.split("-").pop() || "001";
          setDocSettings((p) => ({
            ...p,
            hrNoticeRefId: data.hrNoticeRefId,
            hrNoticeRefIdSerial: refSerial,
            hrNoticeId: data.hrNoticeId,
            hrNoticeIdSerial: idSerial,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch next HR hiring IDs", err);
      }
    }
    fetchNextHrIds();
  }, [agreementTemplate, setDocSettings]);

  // Pre-load Certificate IDs
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("candidateView")
    )
      return;
    if (agreementTemplate !== "internCertificate") return;
    async function fetchNextCertIds() {
      try {
        const res = await fetch("/api/check-id?action=nextCert");
        if (res.ok) {
          const data = await res.json();
          setDocSettings((p) => ({
            ...p,
            certId: data.certId,
            certIdSerial: data.certId?.split("-").pop() || "001",
            certRefId: data.certRefId,
            certRefIdSerial: data.certRefId?.split("-").pop() || "001",
          }));
        }
      } catch (err) {
        console.error("Failed to fetch next certificate IDs", err);
      }
    }
    fetchNextCertIds();
  }, [agreementTemplate, setDocSettings]);
}


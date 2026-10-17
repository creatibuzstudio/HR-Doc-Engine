"use client";

import { useState, useRef } from "react";
import {
  DEFAULT_COMPANY_DETAILS,
  DEFAULT_CANDIDATE_DETAILS,
} from "@/data/defaults";
import {
  FirstParty,
  SecondParty,
  DocSettings,
  AppState,
  AgreementTemplate,
} from "@/types";
import { useDataCache } from "@/lib/context/DataCacheContext";
import { validateStepLogic } from "./useStepValidation";
import { useIdPrefetch } from "./useIdPrefetch";
import { useOfferSubmission } from "./useOfferSubmission";
import { useAgreementExport } from "./useAgreementExport";
import { getTemplateSelectionConfig } from "@/lib/templateSelectionDefaults";

function getDefaultIssueDate() {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function useAppOrchestrator() {
  const { cache } = useDataCache();
  const [appState, setAppState] = useState<AppState>("home");
  const [docType, setDocType] = useState<string>("Contractual Offer Letter & Work Agreement (Featured)");
  const [agreementTemplate, setAgreementTemplate] =
    useState<AgreementTemplate>("contractual");
  const [activeStep, setActiveStep] = useState(1);
  const [isDemo, setIsDemo] = useState(false);

  const [firstParty, setFirstParty] = useState<FirstParty>({
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
  const [secondParty, setSecondParty] = useState<SecondParty>({
    partnerId: DEFAULT_CANDIDATE_DETAILS.employeeId,
    partnerIdSerial: "",
    fullName: DEFAULT_CANDIDATE_DETAILS.fullName,
    email: DEFAULT_CANDIDATE_DETAILS.email,
    guardianName: "",
    guardianRelation: "Father",
    mobileNumber: DEFAULT_CANDIDATE_DETAILS.contactNumber,
    guardianMobile: "",
    presentAddress: DEFAULT_CANDIDATE_DETAILS.livingAddress,
    permanentAddress: DEFAULT_CANDIDATE_DETAILS.livingAddress,
    dob: "",
    nidNumber: "",
    position: DEFAULT_CANDIDATE_DETAILS.position,
    bloodGroup: "Select",
    photoUrl: "",
    signatureImg: DEFAULT_CANDIDATE_DETAILS.signatureImg,
  });
  const [docSettings, setDocSettings] = useState<DocSettings>({
    date: getDefaultIssueDate(),
    minimumServicePeriod: 3,
    equityShare: 7,
    noticePeriod: 15,
    agreementTemplate: "contractual",
  });

  const [sameAddress, setSameAddress] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isOpeningModal, setisOpeningModal] = useState(false);
  const [isLoadingOffer, setIsLoadingOffer] = useState(false);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState("settings");
  const [validationError, setValidationError] = useState("");
  const [isCandidateSigned, setIsCandidateSigned] = useState(false);
  const [isOfferSent, setIsOfferSent] = useState(false);

  const [offerId, setOfferId] = useState("");
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [candidateLink, setCandidateLink] = useState("");
  const [hrNoticePdfBase64, setHrNoticePdfBase64] = useState("");

  const previewRef0 = useRef<HTMLDivElement>(null);
  const previewRef1 = useRef<HTMLDivElement>(null);
  const previewRef2 = useRef<HTMLDivElement>(null);
  const previewRef3 = useRef<HTMLDivElement>(null);
  const previewRef4 = useRef<HTMLDivElement>(null);
  const previewRefs = [
    previewRef0,
    previewRef1,
    previewRef2,
    previewRef3,
    previewRef4,
  ];

  useIdPrefetch({
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
  });

  const { handleSendOffer } = useOfferSubmission({
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
  });

  const { handleExportPDF } = useAgreementExport({
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
  });

  const handleTemplateSelect = (
    type:
      | "contractual"
      | "internship"
      | "hrHiringNotice"
      | "internCertificate",
  ) => {
    const config = getTemplateSelectionConfig(type, docSettings, secondParty);
    setAgreementTemplate(config.agreementTemplate);
    setDocType(config.docType);
    setDocSettings(config.docSettings);
    setIsOfferSent(false);
    setActiveStep(1);
    setAppState("form");
  };

  const getIdLabel = (): string | undefined => {
    if (agreementTemplate === "internship") return "Internee ID";
    return undefined;
  };

  const validateStep = () => {
    return validateStepLogic({
      activeStep,
      agreementTemplate,
      secondParty,
      firstParty,
      docSettings,
    });
  };

  const ACTIVE_TOTAL_STEPS =
    agreementTemplate === "internCertificate" ? 2 : 3;

  const handleNext = () => {
    const error = validateStep();
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError("");
    if (activeStep < ACTIVE_TOTAL_STEPS) {
      setActiveStep((s) => s + 1);
    } else {
      setIsOfferSent(false);
      setAppState("workspace");
    }
  };

  const handlePrev = () => {
    if (activeStep > 1) setActiveStep((s) => s - 1);
  };

  const handleAddressToggle = (checked: boolean) => {
    setSameAddress(checked);
    if (checked) {
      setSecondParty((p) => ({ ...p, permanentAddress: p.presentAddress }));
    }
  };

  const getBackLabel = () => {
    if (appState === "form") return "← Back to Doc Select";
    if (appState === "workspace") return "← Back to Form";
    if (appState === "docTypeSelect") return "← Back to Home";
    if (appState === "adminDashboard") return "← Back to Doc Select";
    return null;
  };

  const handleHeaderBack = () => {
    if (appState === "form") {
      setAppState("docTypeSelect");
    } else if (appState === "workspace") {
      setAppState("form");
      const lastStep = agreementTemplate === "internCertificate" ? 2 : 3;
      setActiveStep(lastStep);
    } else if (appState === "docTypeSelect") {
      setAppState("home");
    } else if (appState === "adminDashboard") {
      setAppState("docTypeSelect");
    }
  };

  return {
    appState,
    setAppState,
    docType,
    setDocType,
    agreementTemplate,
    setAgreementTemplate,
    activeStep,
    setActiveStep,
    isDemo,
    setIsDemo,
    firstParty,
    setFirstParty,
    secondParty,
    setSecondParty,
    docSettings,
    setDocSettings,
    sameAddress,
    setSameAddress,
    isExporting,
    isOpeningModal,
    isLoadingOffer,
    activeWorkspaceTab,
    setActiveWorkspaceTab,
    validationError,
    setValidationError,
    isCandidateSigned,
    isOfferSent,
    setIsOfferSent,
    offerId,
    setOfferId,
    emailModalOpen,
    setEmailModalOpen,
    candidateLink,
    setCandidateLink,
    hrNoticePdfBase64,
    previewRefs,
    handleTemplateSelect,
    getIdLabel,
    handleSendOffer,
    validateStep,
    handleNext,
    handlePrev,
    handleAddressToggle,
    handleExportPDF,
    getBackLabel,
    handleHeaderBack,
  };
}

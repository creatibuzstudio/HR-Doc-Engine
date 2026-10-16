"use client";

import React from "react";
import { FirstParty, SecondParty, DocSettings, AgreementTemplate } from "@/types";
import ContractualFormWizard from "./ContractualFormWizard";
import InternCertificateWizard from "./InternCertificateWizard";
import InternshipFormWizard from "./InternshipFormWizard";
import HRHiringNoticeWizard from "./HRHiringNoticeWizard";

interface WizardSwitchProps {
  agreementTemplate: AgreementTemplate;
  activeStep: number;
  secondParty: SecondParty;
  setSecondParty: React.Dispatch<React.SetStateAction<SecondParty>>;
  firstParty: FirstParty;
  setFirstParty: React.Dispatch<React.SetStateAction<FirstParty>>;
  sameAddress: boolean;
  onAddressToggle: (checked: boolean) => void;
  validationError: string;
  onClearError: () => void;
  onNext: () => void;
  onPrev: () => void;
  docSettings: DocSettings;
  setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>;
}

export default function WizardSwitch({
  agreementTemplate,
  activeStep,
  secondParty,
  setSecondParty,
  firstParty,
  setFirstParty,
  validationError,
  onClearError,
  onNext,
  onPrev,
  docSettings,
  setDocSettings,
}: WizardSwitchProps) {
  if (agreementTemplate === "internCertificate") {
    return (
      <InternCertificateWizard
        key="internCertificateForm"
        activeStep={activeStep}
        secondParty={secondParty}
        setSecondParty={setSecondParty}
        firstParty={firstParty}
        setFirstParty={setFirstParty}
        validationError={validationError}
        onClearError={onClearError}
        onNext={onNext}
        onPrev={onPrev}
        docSettings={docSettings}
        setDocSettings={setDocSettings}
      />
    );
  }

  if (agreementTemplate === "internship") {
    return (
      <InternshipFormWizard
        key="internshipForm"
        activeStep={activeStep}
        secondParty={secondParty}
        setSecondParty={setSecondParty}
        firstParty={firstParty}
        setFirstParty={setFirstParty}
        validationError={validationError}
        onClearError={onClearError}
        onNext={onNext}
        onPrev={onPrev}
        docSettings={docSettings}
        setDocSettings={setDocSettings}
      />
    );
  }

  if (agreementTemplate === "hrHiringNotice") {
    return (
      <HRHiringNoticeWizard
        key="hrHiringNoticeForm"
        activeStep={activeStep}
        firstParty={firstParty}
        setFirstParty={setFirstParty}
        validationError={validationError}
        onClearError={onClearError}
        onNext={onNext}
        onPrev={onPrev}
        docSettings={docSettings}
        setDocSettings={setDocSettings}
      />
    );
  }

  return (
    <ContractualFormWizard
      key="contractualForm"
      activeStep={activeStep}
      secondParty={secondParty}
      setSecondParty={setSecondParty}
      firstParty={firstParty}
      setFirstParty={setFirstParty}
      validationError={validationError}
      onClearError={onClearError}
      onNext={onNext}
      onPrev={onPrev}
      docSettings={docSettings}
      setDocSettings={setDocSettings}
    />
  );
}

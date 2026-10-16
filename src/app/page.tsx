"use client";

import React from "react";
import { AnimatePresence } from "motion/react";
import { useAppOrchestrator } from "@/lib/hooks/useAppOrchestrator";
import { SAMPLE_SECOND_PARTY } from "@/data/defaults";
import { DataCacheProvider, useDataCache } from "@/lib/context/DataCacheContext";

import Hero from "@/components/layout/Hero";
import AppHeader from "@/components/layout/AppHeader";
import Login from "@/features/auth/components/Login";
import DocTypeSelector from "@/features/doc-select/components/DocTypeSelector";
import WizardSwitch from "@/features/wizard/components/WizardSwitch";
import CeoWorkspace from "@/features/workspace/components/CeoWorkspace";
import CandidatePortal from "@/features/candidate-portal/components/CandidatePortal";
import EmailPortalModal from "@/features/email/components/EmailPortalModal";
import AdminDashboard from "@/features/admin/components/AdminDashboard";

export default function Home() {
  return (
    <DataCacheProvider>
      <MainApp />
    </DataCacheProvider>
  );
}

function MainApp() {
  const { prefetch } = useDataCache();
  const {
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
    emailModalOpen,
    setEmailModalOpen,
    candidateLink,
    hrNoticePdfBase64,
    previewRefs,
    handleTemplateSelect,
    getIdLabel,
    handleSendOffer,
    handleNext,
    handlePrev,
    handleAddressToggle,
    handleExportPDF,
    getBackLabel,
    handleHeaderBack,
  } = useAppOrchestrator();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
      <AppHeader
        isLoadingOffer={isLoadingOffer}
        isExporting={isExporting}
        appState={appState}
        setAppState={setAppState}
        agreementTemplate={agreementTemplate}
        docType={docType}
        getBackLabel={getBackLabel}
        handleHeaderBack={handleHeaderBack}
        setActiveStep={setActiveStep}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {appState === "home" && (
            <Hero
              key="home"
              onStart={() => setAppState("login")}
              onDemo={() => {
                setSecondParty(SAMPLE_SECOND_PARTY);
                setSameAddress(false);
                setAppState("form");
                setDocType("Contractual Offer Letter & Work Agreement (Featured)");
                setAgreementTemplate("contractual");
                setDocSettings((prev) => ({
                  ...prev,
                  agreementTemplate: "contractual",
                }));
                setIsDemo(true);
              }}
            />
          )}

          {appState === "login" && (
            <Login
              key="login"
              onLoginSuccess={() => {
                void prefetch();
                setAppState("docTypeSelect");
              }}
              onBackToHome={() => setAppState("home")}
            />
          )}

          {appState === "docTypeSelect" && (
            <DocTypeSelector
              key="docTypeSelect"
              onSelect={handleTemplateSelect}
              onOpenAdmin={() => setAppState("adminDashboard")}
            />
          )}

          {appState === "adminDashboard" && (
            <AdminDashboard
              key="adminDashboard"
              onBack={() => setAppState("docTypeSelect")}
            />
          )}

          {appState === "form" && (
            <WizardSwitch
              agreementTemplate={agreementTemplate}
              activeStep={activeStep}
              secondParty={secondParty}
              setSecondParty={setSecondParty}
              firstParty={firstParty}
              setFirstParty={setFirstParty}
              sameAddress={sameAddress}
              onAddressToggle={handleAddressToggle}
              validationError={validationError}
              onClearError={() => setValidationError("")}
              onNext={handleNext}
              onPrev={handlePrev}
              docSettings={docSettings}
              setDocSettings={setDocSettings}
            />
          )}

          {appState === "workspace" && (
            <CeoWorkspace
              activeWorkspaceTab={activeWorkspaceTab}
              setActiveWorkspaceTab={setActiveWorkspaceTab}
              docSettings={docSettings}
              setDocSettings={setDocSettings}
              secondParty={secondParty}
              setSecondParty={setSecondParty}
              firstParty={firstParty}
              setFirstParty={setFirstParty}
              isExporting={isExporting}
              onExport={handleExportPDF}
              isDemo={isDemo}
              isOfferSent={isOfferSent}
              isOpeningModal={isOpeningModal}
              onSendOffer={handleSendOffer}
              previewRefs={previewRefs}
              docType={docType}
              agreementTemplate={agreementTemplate}
              idLabel={getIdLabel()}
            />
          )}

          {appState === "candidatePortal" && (
            <CandidatePortal
              firstParty={firstParty}
              secondParty={secondParty}
              setSecondParty={setSecondParty}
              docSettings={docSettings}
              setDocSettings={setDocSettings}
              isExporting={isExporting}
              isCompleted={isCandidateSigned}
              onExport={handleExportPDF}
              offerId={offerId}
              previewRefs={previewRefs}
              agreementTemplate={agreementTemplate}
            />
          )}
        </AnimatePresence>
      </main>

      <EmailPortalModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        onSentSuccess={() => setIsOfferSent(true)}
        secondParty={secondParty}
        firstParty={firstParty}
        candidateLink={candidateLink}
        offerId={offerId}
        agreementTemplate={agreementTemplate}
        docSettings={docSettings}
        hrNoticePdfBase64={hrNoticePdfBase64}
      />
    </div>
  );
}

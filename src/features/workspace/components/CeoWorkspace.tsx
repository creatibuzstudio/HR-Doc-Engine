"use client";

import React from "react";
import { motion } from "motion/react";
import WorkspaceSidebar from "./WorkspaceSidebar";
import WorkspaceCanvas from "./WorkspaceCanvas";
import {
  FirstParty,
  SecondParty,
  DocSettings,
  AgreementTemplate,
} from "@/types";

interface CeoWorkspaceProps {
  activeWorkspaceTab: string;
  setActiveWorkspaceTab: (tab: string) => void;
  docSettings: DocSettings;
  setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>;
  secondParty: SecondParty;
  setSecondParty: React.Dispatch<React.SetStateAction<SecondParty>>;
  firstParty: FirstParty;
  setFirstParty: React.Dispatch<React.SetStateAction<FirstParty>>;
  isExporting: boolean;
  onExport: () => void;
  isDemo: boolean;
  isOfferSent: boolean;
  isOpeningModal?: boolean;
  onSendOffer: () => Promise<void> | void;
  previewRefs: React.RefObject<HTMLDivElement | null>[];
  docType?: string;
  agreementTemplate?: AgreementTemplate;
  idLabel?: string;
}

export default function CeoWorkspace({
  activeWorkspaceTab,
  setActiveWorkspaceTab,
  docSettings,
  setDocSettings,
  secondParty,
  setSecondParty,
  firstParty,
  setFirstParty,
  isExporting,
  onExport,
  isDemo,
  isOfferSent,
  isOpeningModal = false,
  onSendOffer,
  previewRefs,
  agreementTemplate,
}: CeoWorkspaceProps) {
  return (
    <motion.section
      key="workspace"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 relative flex flex-col xl:flex-row w-full min-h-0"
    >
      <div className="w-full xl:w-auto xl:sticky xl:top-15 xl:h-screen xl:self-start">
        <div className="xl:h-[calc(100vh-60px)] xl:overflow-y-auto">
          <WorkspaceSidebar
            activeTab={activeWorkspaceTab}
            setActiveTab={setActiveWorkspaceTab}
            docSettings={docSettings}
            setDocSettings={setDocSettings}
            secondParty={secondParty}
            setSecondParty={setSecondParty}
            firstParty={firstParty}
            setFirstParty={setFirstParty}
            isExporting={isExporting}
            onExport={onExport}
            isDemo={isDemo}
            isOfferSent={isOfferSent}
            isOpeningModal={isOpeningModal}
            onSendOffer={onSendOffer}
            agreementTemplate={agreementTemplate}
          />
        </div>
      </div>
      <WorkspaceCanvas
        firstParty={firstParty}
        secondParty={secondParty}
        settings={docSettings}
        previewRefs={previewRefs}
        isExporting={isExporting}
        onExport={onExport}
        isDemo={isDemo}
        agreementTemplate={agreementTemplate}
      />
    </motion.section>
  );
}

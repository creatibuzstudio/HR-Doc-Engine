"use client";

import React from "react";
import { DocSettings } from "@/types";
import { TextInput } from "@/components/forms/FormPrimitives";

interface ContractualSettingsTabProps {
  docSettings: DocSettings;
  setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>;
}

export function ContractualSettingsTab({
  docSettings,
  setDocSettings,
}: ContractualSettingsTabProps) {
  return (
    <div className="space-y-4">
      <TextInput
        label="Date of Issue"
        value={docSettings.date || ""}
        onChange={(e) => setDocSettings((p) => ({ ...p, date: e.target.value }))}
      />

      <TextInput
        label="Subject Line"
        value={docSettings.contractSubject || ""}
        onChange={(e) =>
          setDocSettings((p) => ({ ...p, contractSubject: e.target.value }))
        }
      />

      <TextInput
        label="Agreement Reference ID (Ref No)"
        value={
          docSettings.contractRef ||
          docSettings.contractRefId ||
          docSettings.contractualRefId ||
          docSettings.refId ||
          ""
        }
        onChange={(e) =>
          setDocSettings((p) => ({
            ...p,
            refId: e.target.value,
            contractRefId: e.target.value,
            contractualRefId: e.target.value,
            contractRef: e.target.value,
          }))
        }
      />
    </div>
  );
}

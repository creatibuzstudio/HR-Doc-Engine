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
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          Employment Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(["Project-Based Contract", "Full-Time Contract"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() =>
                setDocSettings((p) => ({
                  ...p,
                  employmentType: type,
                  contractSubject: `Subject: ${
                    p.contractSubject?.replace(/^Subject:\s*/, "").split(" For A ")[0] || "Position"
                  } For A ${type}`,
                }))
              }
              className={`py-2 text-[11px] font-bold rounded-xl border transition cursor-pointer ${
                docSettings.employmentType === type
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary border-border text-foreground hover:border-primary"
              }`}
            >
              {type === "Project-Based Contract" ? "Project-Based" : "Full-Time"}
            </button>
          ))}
        </div>
      </div>

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

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
          Term 01 — Scope Of Work
        </label>
        <textarea
          rows={3}
          value={docSettings.scopeOfWork || ""}
          onChange={(e) =>
            setDocSettings((p) => ({ ...p, scopeOfWork: e.target.value }))
          }
          className="w-full bg-secondary border border-border rounded-lg p-2 text-xs text-foreground focus:border-primary focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
          Term 02 — Compensation
        </label>
        <textarea
          rows={3}
          value={docSettings.compensationDetails || ""}
          onChange={(e) =>
            setDocSettings((p) => ({ ...p, compensationDetails: e.target.value }))
          }
          className="w-full bg-secondary border border-border rounded-lg p-2 text-xs text-foreground focus:border-primary focus:outline-none"
        />
      </div>
    </div>
  );
}

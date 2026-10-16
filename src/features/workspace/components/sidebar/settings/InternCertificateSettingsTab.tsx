"use client";

import React from "react";
import { DocSettings } from "@/types";
import { TextInput } from "@/components/forms/FormPrimitives";
import { toISODate, toDisplayDate, getTodayISO } from "@/lib/utils/dateUtils";

interface InternCertificateSettingsTabProps {
  docSettings: DocSettings;
  setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>;
}

export function InternCertificateSettingsTab({
  docSettings,
  setDocSettings,
}: InternCertificateSettingsTabProps) {
  const set = (patch: Partial<DocSettings>) =>
    setDocSettings((p) => ({ ...p, ...patch }));

  return (
    <div className="space-y-4">
      <TextInput
        label="Date of Issue"
        type="date"
        max={getTodayISO()}
        value={toISODate(docSettings.date)}
        onChange={(e) => set({ date: toDisplayDate(e.target.value) })}
      />
      <TextInput
        label="Performance Rating / Grade"
        value={docSettings.certPerformanceGrade || ""}
        onChange={(e) => set({ certPerformanceGrade: e.target.value })}
      />
      <TextInput
        label="Internship Start Date"
        type="date"
        max={getTodayISO()}
        value={toISODate(docSettings.certStartDate || "")}
        onChange={(e) => set({ certStartDate: toDisplayDate(e.target.value) })}
      />
      <TextInput
        label="Internship End Date"
        type="date"
        max={getTodayISO()}
        min={toISODate(docSettings.certStartDate || "")}
        value={toISODate(docSettings.certEndDate || "")}
        onChange={(e) => set({ certEndDate: toDisplayDate(e.target.value) })}
      />
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-[#334155] uppercase tracking-wide">
          Certificate ID
        </label>
        <input
          type="text"
          value={docSettings.certId || ""}
          readOnly
          className="w-full bg-[#F1F5F9] border border-[#DBEAFE] rounded-lg py-2 px-3 text-xs text-[#0F172A] font-mono font-bold"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-[#334155] uppercase tracking-wide">
          Certificate Reference ID
        </label>
        <input
          type="text"
          value={docSettings.certRefId || ""}
          readOnly
          className="w-full bg-[#F1F5F9] border border-[#DBEAFE] rounded-lg py-2 px-3 text-xs text-[#0F172A] font-mono font-bold"
        />
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { DocSettings } from "@/types";
import { Field, Input, Select } from "./HRPrimitives";

const RECIPIENT_ROLES = ["CEO", "CTO", "Founder", "CMO"];

interface HRRecipientStepProps {
  docSettings: DocSettings;
  setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>;
}

export default function HRRecipientStep({
  docSettings,
  setDocSettings,
}: HRRecipientStepProps) {
  const set = (patch: Partial<DocSettings>) =>
    setDocSettings((p) => ({ ...p, ...patch }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="md:col-span-2">
        <h3 className="text-[#0F172A] font-bold text-base">
          Recipient &amp; Notice Information
        </h3>
        <p className="text-[#64748B] text-xs mt-1">
          Define who this notice is addressed to, their contact, and the formal title.
        </p>
      </div>
      <Field label="Recipient Role *">
        <Select
          value={docSettings.hrRecipientRole || ""}
          onChange={(e) => set({ hrRecipientRole: e.target.value })}
        >
          <option value="">— Select Recipient Role —</option>
          {RECIPIENT_ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
          <option value="Other">Other</option>
        </Select>
        {docSettings.hrRecipientRole === "Other" && (
          <Input
            className="mt-2"
            value={docSettings.hrRecipientRoleCustom || ""}
            onChange={(e) => set({ hrRecipientRoleCustom: e.target.value })}
            placeholder="e.g. Managing Director"
            autoFocus
          />
        )}
      </Field>
      <Field label="Recipient Name *">
        <Input
          value={docSettings.hrRecipientName || ""}
          onChange={(e) => set({ hrRecipientName: e.target.value })}
          placeholder="e.g. Md Abdul Hakim"
        />
      </Field>
      <Field label="Recipient Email * (notice will be sent here)">
        <Input
          type="email"
          value={docSettings.hrRecipientEmail || ""}
          onChange={(e) => set({ hrRecipientEmail: e.target.value })}
          placeholder="e.g. info@creatibuzstudio.com"
        />
      </Field>
      <Field label="Notice Reference ID">
        <Input
          value={docSettings.hrNoticeRefId || ""}
          readOnly
          className="font-mono text-xs opacity-70"
        />
      </Field>
      <Field label="Notice Title *">
        <Input
          value={docSettings.hrNoticeTitle || ""}
          onChange={(e) => set({ hrNoticeTitle: e.target.value })}
          placeholder="e.g. UI/UX Designer Recruitment"
        />
      </Field>
    </div>
  );
}

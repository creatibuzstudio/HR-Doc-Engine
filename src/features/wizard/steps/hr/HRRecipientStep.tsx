"use client";

import React, { useEffect } from "react";
import { DocSettings } from "@/types";
import { Field, Input, Select } from "./HRPrimitives";
import { StepHeader } from "@/components/forms/FormPrimitives";

const RECIPIENT_ROLES = ["CEO", "CTO", "Founder", "Managing Director", "Department Head"];

interface HRRecipientStepProps {
  docSettings: DocSettings;
  setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>;
  onClearError?: () => void;
}

export default function HRRecipientStep({
  docSettings,
  setDocSettings,
  onClearError,
}: HRRecipientStepProps) {
  const set = (patch: Partial<DocSettings>) => {
    onClearError?.();
    setDocSettings((p) => ({ ...p, ...patch }));
  };

  useEffect(() => {
    if (!docSettings.date) {
      setDocSettings((p) => ({
        ...p,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      }));
    }
    if (!docSettings.hrRecipientRole) {
      setDocSettings((p) => ({
        ...p,
        hrRecipientRole: "CEO",
        hrRecipientName: p.hrRecipientName || "Md. Abdul Hakim",
        hrRecipientEmail: p.hrRecipientEmail || "info@creatibuzstudio.com",
        hrNoticeTitle: p.hrNoticeTitle || "Internal Hiring & Recruitment Circular",
        hrSubject: p.hrSubject || "Subject: Formal Requisition For New Talent Recruitment",
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <StepHeader
        title="Section 1: Executive Recipient & Notice Header"
        desc="Specify the executive whom this requisition is submitted to, along with notice identifiers."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Notice Date *">
          <Input
            value={docSettings.date || ""}
            onChange={(e) => set({ date: e.target.value })}
            placeholder="e.g. November 06, 2026"
          />
        </Field>

        <Field label="Notice Reference ID">
          <Input
            value={docSettings.hrNoticeRefId || `CBS/HR-REF-26/001`}
            onChange={(e) => set({ hrNoticeRefId: e.target.value })}
            className="font-mono text-xs text-primary font-bold"
            placeholder="e.g. CBS/HR-REF-26/001"
          />
        </Field>

        <Field label="Recipient Executive Role *">
          <Select
            value={docSettings.hrRecipientRole || "CEO"}
            onChange={(e) => {
              const role = e.target.value;
              set({
                hrRecipientRole: role,
                hrRecipientName:
                  role === "CEO" || role === "Founder"
                    ? "Md. Abdul Hakim"
                    : docSettings.hrRecipientName,
                hrRecipientEmail:
                  role === "CEO" || role === "Founder"
                    ? "info@creatibuzstudio.com"
                    : docSettings.hrRecipientEmail,
              });
            }}
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
              placeholder="e.g. Chief Operating Officer"
              autoFocus
            />
          )}
        </Field>

        <Field label="Recipient Executive Name *">
          <Input
            value={docSettings.hrRecipientName || ""}
            onChange={(e) => set({ hrRecipientName: e.target.value })}
            placeholder="e.g. Md. Abdul Hakim"
          />
        </Field>

        <div className="md:col-span-2">
          <Field label="Recipient Email Address * (Internal Dispatch Target)">
            <Input
              type="email"
              value={docSettings.hrRecipientEmail || ""}
              onChange={(e) => set({ hrRecipientEmail: e.target.value })}
              placeholder="e.g. info@creatibuzstudio.com"
            />
          </Field>
        </div>

        <Field label="Notice Title *">
          <Input
            value={docSettings.hrNoticeTitle || ""}
            onChange={(e) => set({ hrNoticeTitle: e.target.value })}
            placeholder="e.g. Recruitment Notice: Product Engineer"
          />
        </Field>

        <Field label="Formal Subject Line *">
          <Input
            value={docSettings.hrSubject || ""}
            onChange={(e) => set({ hrSubject: e.target.value })}
            placeholder="e.g. Requisition for UI/UX Designer Onboarding"
          />
        </Field>
      </div>
    </div>
  );
}

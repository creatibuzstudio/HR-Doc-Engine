import React from "react";
import { FormField, FormInput, FormSelect } from "../components/FormFields";
import { HiringNoticePayload } from "@/types";

interface Step1Props {
  data: HiringNoticePayload;
  onChange: (updates: Partial<HiringNoticePayload>) => void;
}

export default function Step1Recipient({ data, onChange }: Step1Props) {
  const roles = ["CEO", "CTO", "Founder", "Managing Director"];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Document Notice ID">
          <FormInput
            value={data.noticeId}
            disabled
            className="bg-card text-muted-foreground font-mono"
          />
        </FormField>
        <FormField label="Reference Serial">
          <FormInput
            value={data.refId}
            disabled
            className="bg-card text-muted-foreground font-mono"
          />
        </FormField>
      </div>

      <FormField label="Requisition Notice Title">
        <FormInput
          placeholder="e.g. Senior Full-Stack Engineer Requisition"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField label="Target Approver Role">
          <FormSelect
            value={data.recipient.role}
            onChange={(e) =>
              onChange({
                recipient: { ...data.recipient, role: e.target.value },
              })
            }
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </FormSelect>
        </FormField>

        <FormField label="Approver Full Name">
          <FormInput
            placeholder="e.g. Imtiaz Ahmed Tuhin"
            value={data.recipient.name}
            onChange={(e) =>
              onChange({
                recipient: { ...data.recipient, name: e.target.value },
              })
            }
          />
        </FormField>

        <FormField label="Approver Email Address">
          <FormInput
            type="email"
            placeholder="e.g. ceo@jevxo.com"
            value={data.recipient.email}
            onChange={(e) =>
              onChange({
                recipient: { ...data.recipient, email: e.target.value },
              })
            }
          />
        </FormField>
      </div>
    </div>
  );
}

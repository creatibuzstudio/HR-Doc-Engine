import React from "react";
import { FormField, FormInput } from "../components/FormFields";
import { HiringNoticePayload } from "@/types";

interface Step3Props {
  data: HiringNoticePayload;
  onChange: (updates: Partial<HiringNoticePayload>) => void;
}

export default function Step3Approver({ data, onChange }: Step3Props) {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl border border-border/70 bg-card mb-4 text-xs text-muted-foreground leading-relaxed">
        Please verify the HR Department official preparing this hiring document. Once created, the requisition notice will be generated in A4 PDF format and recorded in the database registry.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Prepared By (HR Name)">
          <FormInput
            placeholder="e.g. Juwel Khan Shanto"
            value={data.preparedBy.name}
            onChange={(e) =>
              onChange({
                preparedBy: { ...data.preparedBy, name: e.target.value },
              })
            }
          />
        </FormField>

        <FormField label="Designation / Position">
          <FormInput
            placeholder="e.g. Head of HR Department"
            value={data.preparedBy.designation}
            onChange={(e) =>
              onChange({
                preparedBy: {
                  ...data.preparedBy,
                  designation: e.target.value,
                },
              })
            }
          />
        </FormField>
      </div>

      <FormField label="Experience Required Note">
        <FormInput
          placeholder="e.g. 2+ years of production experience in React & Node.js"
          value={data.experienceRequired}
          onChange={(e) => onChange({ experienceRequired: e.target.value })}
        />
      </FormField>
    </div>
  );
}

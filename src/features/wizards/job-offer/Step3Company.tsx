import React from "react";
import { FormField, FormInput } from "../components/FormFields";
import { JobOfferPayload } from "@/types";

interface Step3Props {
  data: JobOfferPayload;
  onChange: (updates: Partial<JobOfferPayload>) => void;
}

export default function Step3Company({ data, onChange }: Step3Props) {
  const updateFirstParty = (
    field: keyof JobOfferPayload["firstParty"],
    value: string
  ) => {
    onChange({
      firstParty: { ...data.firstParty, [field]: value },
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Employing Entity">
          <FormInput
            value={data.firstParty.companyName}
            onChange={(e) => updateFirstParty("companyName", e.target.value)}
          />
        </FormField>
        <FormField label="Authorized Signatory">
          <FormInput
            value={data.firstParty.representedBy}
            onChange={(e) => updateFirstParty("representedBy", e.target.value)}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Official Contact Email">
          <FormInput
            type="email"
            value={data.firstParty.email}
            onChange={(e) => updateFirstParty("email", e.target.value)}
          />
        </FormField>
        <FormField label="Signatory Role">
          <FormInput
            value={data.firstParty.role}
            onChange={(e) => updateFirstParty("role", e.target.value)}
          />
        </FormField>
      </div>

      <FormField label="Registered Company Address">
        <FormInput
          value={data.firstParty.currentAddress}
          onChange={(e) => updateFirstParty("currentAddress", e.target.value)}
        />
      </FormField>

      <div className="p-4 rounded-xl border border-border/80 bg-secondary/50 text-xs text-muted-foreground">
        Permanent offer letters generated will feature JEVXO corporate letterhead, benefits clauses, probation metrics, and a countersigning block for the candidate.
      </div>
    </div>
  );
}

import React from "react";
import { FormField, FormInput } from "../components/FormFields";
import { ContractAgreementPayload } from "@/types";

interface Step3Props {
  data: ContractAgreementPayload;
  onChange: (updates: Partial<ContractAgreementPayload>) => void;
}

export default function Step3Company({ data, onChange }: Step3Props) {
  const updateFirstParty = (
    field: keyof ContractAgreementPayload["firstParty"],
    value: string
  ) => {
    onChange({
      firstParty: { ...data.firstParty, [field]: value },
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Company Name">
          <FormInput
            value={data.firstParty.companyName}
            onChange={(e) => updateFirstParty("companyName", e.target.value)}
          />
        </FormField>
        <FormField label="Represented By (Founder / CEO)">
          <FormInput
            value={data.firstParty.representedBy}
            onChange={(e) => updateFirstParty("representedBy", e.target.value)}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Company Official Email">
          <FormInput
            type="email"
            value={data.firstParty.email}
            onChange={(e) => updateFirstParty("email", e.target.value)}
          />
        </FormField>
        <FormField label="Company Contact Mobile">
          <FormInput
            value={data.firstParty.mobileNumber}
            onChange={(e) => updateFirstParty("mobileNumber", e.target.value)}
          />
        </FormField>
      </div>

      <FormField label="Registered Office Address">
        <FormInput
          value={data.firstParty.currentAddress}
          onChange={(e) => updateFirstParty("currentAddress", e.target.value)}
        />
      </FormField>

      <div className="p-4 rounded-xl border border-border/80 bg-secondary/50 text-xs text-muted-foreground">
        Upon saving, this agreement will be recorded in the database and an invitation link will be available to share with the contractor for digital signing.
      </div>
    </div>
  );
}

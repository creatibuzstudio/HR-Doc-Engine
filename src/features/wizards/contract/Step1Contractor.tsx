import React from "react";
import { FormField, FormInput } from "../components/FormFields";
import { ContractAgreementPayload } from "@/types";

interface Step1Props {
  data: ContractAgreementPayload;
  onChange: (updates: Partial<ContractAgreementPayload>) => void;
}

export default function Step1Contractor({ data, onChange }: Step1Props) {
  const updateSecondParty = (
    field: keyof ContractAgreementPayload["secondParty"],
    value: string
  ) => {
    onChange({
      secondParty: { ...data.secondParty, [field]: value },
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Agreement ID">
          <FormInput
            value={data.agreementId}
            disabled
            className="bg-card text-muted-foreground font-mono"
          />
        </FormField>
        <FormField label="Contractor ID">
          <FormInput
            value={data.contractorId}
            disabled
            className="bg-card text-muted-foreground font-mono"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Contractor Full Name">
          <FormInput
            placeholder="e.g. Golam Rabbi"
            value={data.secondParty.fullName}
            onChange={(e) => updateSecondParty("fullName", e.target.value)}
          />
        </FormField>
        <FormField label="Role / Specialist Position">
          <FormInput
            placeholder="e.g. Lead Frontend Engineer"
            value={data.secondParty.position}
            onChange={(e) => updateSecondParty("position", e.target.value)}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField label="Email Address">
          <FormInput
            type="email"
            placeholder="contractor@example.com"
            value={data.secondParty.email}
            onChange={(e) => updateSecondParty("email", e.target.value)}
          />
        </FormField>
        <FormField label="Mobile Number">
          <FormInput
            placeholder="+880 1XXXXXXXXX"
            value={data.secondParty.mobileNumber}
            onChange={(e) => updateSecondParty("mobileNumber", e.target.value)}
          />
        </FormField>
        <FormField label="National ID / Passport">
          <FormInput
            placeholder="NID Number"
            value={data.secondParty.nidNumber}
            onChange={(e) => updateSecondParty("nidNumber", e.target.value)}
          />
        </FormField>
      </div>

      <FormField label="Present Address">
        <FormInput
          placeholder="Present residential address"
          value={data.secondParty.presentAddress}
          onChange={(e) => updateSecondParty("presentAddress", e.target.value)}
        />
      </FormField>
    </div>
  );
}

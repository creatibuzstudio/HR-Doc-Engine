import React from "react";
import { FormField, FormInput } from "../components/FormFields";
import { JobOfferPayload } from "@/types";

interface Step1Props {
  data: JobOfferPayload;
  onChange: (updates: Partial<JobOfferPayload>) => void;
}

export default function Step1Candidate({ data, onChange }: Step1Props) {
  const updateCandidate = (
    field: keyof JobOfferPayload["secondParty"],
    value: string
  ) => {
    onChange({
      secondParty: { ...data.secondParty, [field]: value },
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Offer Reference ID">
          <FormInput
            value={data.offerId}
            disabled
            className="bg-card text-muted-foreground font-mono"
          />
        </FormField>
        <FormField label="Employee Serial ID">
          <FormInput
            value={data.employeeId}
            disabled
            className="bg-card text-muted-foreground font-mono"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Candidate Full Name">
          <FormInput
            placeholder="e.g. Ayesha Siddiqa"
            value={data.secondParty.fullName}
            onChange={(e) => updateCandidate("fullName", e.target.value)}
          />
        </FormField>
        <FormField label="Designation / Position Offered">
          <FormInput
            placeholder="e.g. Senior Software Engineer"
            value={data.employmentTerms.designation}
            onChange={(e) =>
              onChange({
                employmentTerms: {
                  ...data.employmentTerms,
                  designation: e.target.value,
                },
              })
            }
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField label="Candidate Email">
          <FormInput
            type="email"
            placeholder="candidate@example.com"
            value={data.secondParty.email}
            onChange={(e) => updateCandidate("email", e.target.value)}
          />
        </FormField>
        <FormField label="Contact Mobile">
          <FormInput
            placeholder="+880 1XXXXXXXXX"
            value={data.secondParty.mobileNumber}
            onChange={(e) => updateCandidate("mobileNumber", e.target.value)}
          />
        </FormField>
        <FormField label="National ID / Passport">
          <FormInput
            placeholder="NID Number"
            value={data.secondParty.nidNumber}
            onChange={(e) => updateCandidate("nidNumber", e.target.value)}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Present Residential Address">
          <FormInput
            placeholder="Current living address"
            value={data.secondParty.presentAddress}
            onChange={(e) => updateCandidate("presentAddress", e.target.value)}
          />
        </FormField>
        <FormField label="Permanent Address">
          <FormInput
            placeholder="Permanent home address"
            value={data.secondParty.permanentAddress || ""}
            onChange={(e) => updateCandidate("permanentAddress", e.target.value)}
          />
        </FormField>
      </div>
    </div>
  );
}

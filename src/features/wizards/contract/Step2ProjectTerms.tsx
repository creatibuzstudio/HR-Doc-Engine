import React from "react";
import { FormField, FormInput } from "../components/FormFields";
import { ContractAgreementPayload } from "@/types";

interface Step2Props {
  data: ContractAgreementPayload;
  onChange: (updates: Partial<ContractAgreementPayload>) => void;
}

export default function Step2ProjectTerms({ data, onChange }: Step2Props) {
  const updateTerms = (
    field: keyof ContractAgreementPayload["projectTerms"],
    value: string | number
  ) => {
    onChange({
      projectTerms: { ...data.projectTerms, [field]: value },
    });
  };

  return (
    <div className="space-y-4">
      <FormField label="Assigned Project Name">
        <FormInput
          placeholder="e.g. JEVXO Mobile App Development & Infrastructure"
          value={data.projectTerms.projectName}
          onChange={(e) => updateTerms("projectName", e.target.value)}
        />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Contract Duration">
          <FormInput
            placeholder="e.g. 3 Months / Milestone Based"
            value={data.projectTerms.duration}
            onChange={(e) => updateTerms("duration", e.target.value)}
          />
        </FormField>
        <FormField label="Total Remuneration (BDT)">
          <FormInput
            type="number"
            min={0}
            placeholder="e.g. 60000"
            value={data.projectTerms.remunerationAmount}
            onChange={(e) =>
              updateTerms("remunerationAmount", parseFloat(e.target.value) || 0)
            }
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Effective Start Date">
          <FormInput
            type="date"
            value={data.projectTerms.effectiveDate}
            onChange={(e) => updateTerms("effectiveDate", e.target.value)}
          />
        </FormField>
        <FormField label="Project Expiry Date">
          <FormInput
            type="date"
            value={data.projectTerms.expiryDate}
            onChange={(e) => updateTerms("expiryDate", e.target.value)}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Payment Milestones Breakdown">
          <FormInput
            placeholder="e.g. 50% on UI delivery, 50% on QA completion"
            value={data.projectTerms.paymentMilestones}
            onChange={(e) => updateTerms("paymentMilestones", e.target.value)}
          />
        </FormField>
        <FormField label="Notice Period (Days)">
          <FormInput
            type="number"
            min={0}
            value={data.projectTerms.noticePeriodDays}
            onChange={(e) =>
              updateTerms("noticePeriodDays", parseInt(e.target.value, 10) || 15)
            }
          />
        </FormField>
      </div>

      <FormField label="Project Scope & Deliverables Summary">
        <textarea
          rows={3}
          placeholder="Outline the core responsibilities, sprint deliveries, and expected project quality standards..."
          value={data.projectTerms.projectScope}
          onChange={(e) => updateTerms("projectScope", e.target.value)}
          className="w-full bg-secondary border border-border focus:border-primary rounded-xl py-2.5 px-3.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none transition"
        />
      </FormField>
    </div>
  );
}

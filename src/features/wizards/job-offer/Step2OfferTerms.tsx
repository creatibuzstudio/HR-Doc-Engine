import React from "react";
import { FormField, FormInput, FormSelect } from "../components/FormFields";
import { JobOfferPayload } from "@/types";

interface Step2Props {
  data: JobOfferPayload;
  onChange: (updates: Partial<JobOfferPayload>) => void;
}

export default function Step2OfferTerms({ data, onChange }: Step2Props) {
  const updateTerms = (
    field: keyof JobOfferPayload["employmentTerms"],
    value: string | number
  ) => {
    onChange({
      employmentTerms: { ...data.employmentTerms, [field]: value },
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Assigned Department">
          <FormInput
            placeholder="e.g. Software Engineering & Innovation"
            value={data.employmentTerms.department}
            onChange={(e) => updateTerms("department", e.target.value)}
          />
        </FormField>
        <FormField label="Official Joining Date">
          <FormInput
            type="date"
            value={data.employmentTerms.joiningDate}
            onChange={(e) => updateTerms("joiningDate", e.target.value)}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField label="Fixed Gross Monthly Salary (BDT)">
          <FormInput
            type="number"
            min={0}
            placeholder="e.g. 75000"
            value={data.employmentTerms.grossSalaryMonthly}
            onChange={(e) =>
              updateTerms("grossSalaryMonthly", parseFloat(e.target.value) || 0)
            }
          />
        </FormField>
        <FormField label="Probation Period (Months)">
          <FormInput
            type="number"
            min={0}
            value={data.employmentTerms.probationPeriodMonths}
            onChange={(e) =>
              updateTerms("probationPeriodMonths", parseInt(e.target.value, 10) || 3)
            }
          />
        </FormField>
        <FormField label="Notice Period (Days)">
          <FormInput
            type="number"
            min={0}
            value={data.employmentTerms.noticePeriodDays}
            onChange={(e) =>
              updateTerms("noticePeriodDays", parseInt(e.target.value, 10) || 30)
            }
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Work Mode">
          <FormSelect
            value={data.employmentTerms.workMode}
            onChange={(e) =>
              updateTerms(
                "workMode",
                e.target.value as "Remote" | "Onsite" | "Hybrid"
              )
            }
          >
            <option value="Onsite">Onsite (Silicon Tower, Rajshahi)</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
          </FormSelect>
        </FormField>
        <FormField label="Currency">
          <FormInput
            value={data.employmentTerms.currency}
            disabled
            className="bg-card text-muted-foreground font-mono"
          />
        </FormField>
      </div>
    </div>
  );
}

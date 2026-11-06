"use client";

import React from "react";
import { DocSettings } from "@/types";
import { Field, Input, Select, DateField, SkillTagInput } from "./HRPrimitives";
import { StepHeader } from "@/components/forms/FormPrimitives";
import { getTodayISO, toISODate } from "@/lib/utils/dateUtils";

const EMPLOYMENT_TYPES = ["Full-Time", "Contract", "Part-Time", "Internship", "Freelance"];
const WORK_MODES = ["Remote", "Hybrid", "Onsite"];

interface HRJobDetailsStepProps {
  docSettings: DocSettings;
  setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>;
  onClearError?: () => void;
}

export default function HRJobDetailsStep({
  docSettings,
  setDocSettings,
  onClearError,
}: HRJobDetailsStepProps) {
  const set = (patch: Partial<DocSettings>) => {
    onClearError?.();
    setDocSettings((p) => ({ ...p, ...patch }));
  };

  const skills = docSettings.hrRequiredSkills || [];
  const addSkill = (s: string) => set({ hrRequiredSkills: [...skills, s] });
  const removeSkill = (i: number) =>
    set({ hrRequiredSkills: skills.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-6">
      <StepHeader
        title="Section 2: Recruitment & Role Specifications"
        desc="Define position particulars, department, required competencies, and target timeline."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Position Title *">
          <Input
            value={docSettings.hrPositionName || ""}
            onChange={(e) => set({ hrPositionName: e.target.value })}
            placeholder="e.g. Senior Full-Stack Engineer"
          />
        </Field>

        <Field label="Number of Vacancies *">
          <Input
            type="number"
            min={1}
            max={99}
            value={docSettings.hrVacancies ?? 1}
            onChange={(e) =>
              set({ hrVacancies: Math.max(1, parseInt(e.target.value) || 1) })
            }
          />
        </Field>

        <Field label="Department *">
          <Input
            value={docSettings.hrDepartment || ""}
            onChange={(e) => set({ hrDepartment: e.target.value })}
            placeholder="e.g. Product Engineering Department"
          />
        </Field>

        <Field label="Employment Type *">
          <Select
            value={docSettings.hrEmploymentType || "Full-Time"}
            onChange={(e) => set({ hrEmploymentType: e.target.value })}
          >
            <option value="">— Select Employment Type —</option>
            {EMPLOYMENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Work Arrangement *">
          <Select
            value={docSettings.hrWorkMode || "Remote"}
            onChange={(e) => set({ hrWorkMode: e.target.value })}
          >
            <option value="">— Select Work Mode —</option>
            {WORK_MODES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Work Location / Base">
          <Input
            value={docSettings.hrLocation || ""}
            onChange={(e) => set({ hrLocation: e.target.value })}
            placeholder="e.g. Dhaka, Bangladesh (or Remote)"
          />
        </Field>

        <DateField
          label="Recruitment Start Date"
          value={docSettings.hrRecruitmentStartDate || ""}
          onChange={(v) => set({ hrRecruitmentStartDate: v })}
          min={getTodayISO()}
        />

        <DateField
          label="Recruitment End Date"
          value={docSettings.hrRecruitmentEndDate || ""}
          onChange={(v) => set({ hrRecruitmentEndDate: v })}
          min={toISODate(docSettings.hrRecruitmentStartDate || "") || getTodayISO()}
        />

        <Field label="Experience Required">
          <Select
            value={docSettings.hrExperienceRequired || "1+ year"}
            onChange={(e) => set({ hrExperienceRequired: e.target.value })}
          >
            <option value="">— Select Experience Level —</option>
            <option value="Fresher / Entry Level">Fresher / Entry Level</option>
            <option value="Less than 1 year">Less than 1 year</option>
            <option value="1+ year">1+ year</option>
            <option value="2+ years">2+ years</option>
            <option value="3+ years">3+ years</option>
            <option value="5+ years">5+ years</option>
            <option value="7+ years">7+ years</option>
          </Select>
        </Field>

        <Field label="Target Salary / Compensation Budget">
          <Input
            value={docSettings.hrExperienceNote || ""}
            onChange={(e) => set({ hrExperienceNote: e.target.value })}
            placeholder="e.g. BDT 45,000 - 65,000 / month negotiable"
          />
        </Field>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-header-text uppercase tracking-wide mb-1.5">
            Key Competencies &amp; Required Skills *
          </label>
          <SkillTagInput skills={skills} onAdd={addSkill} onRemove={removeSkill} />
          <p className="text-[11px] text-muted-foreground mt-1.5">
            Type required technologies or skills and press Enter (e.g. TypeScript, Next.js, Node.js).
          </p>
        </div>
      </div>
    </div>
  );
}

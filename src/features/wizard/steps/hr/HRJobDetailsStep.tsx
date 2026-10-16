"use client";

import React from "react";
import { DocSettings } from "@/types";
import { Field, Input, Select, DateField, SkillTagInput } from "./HRPrimitives";
import { getTodayISO, toISODate } from "@/lib/utils/dateUtils";

const EMPLOYMENT_TYPES = ["Internship", "Part-Time", "Full-Time", "Contract", "Freelance"];
const WORK_MODES = ["Onsite", "Remote", "Hybrid"];

interface HRJobDetailsStepProps {
  docSettings: DocSettings;
  setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>;
}

export default function HRJobDetailsStep({
  docSettings,
  setDocSettings,
}: HRJobDetailsStepProps) {
  const set = (patch: Partial<DocSettings>) =>
    setDocSettings((p) => ({ ...p, ...patch }));

  const skills = docSettings.hrRequiredSkills || [];
  const addSkill = (s: string) => set({ hrRequiredSkills: [...skills, s] });
  const removeSkill = (i: number) =>
    set({ hrRequiredSkills: skills.filter((_, idx) => idx !== i) });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="md:col-span-2">
        <h3 className="text-[#0F172A] font-bold text-base">
          Recruitment &amp; Job Details
        </h3>
        <p className="text-[#64748B] text-xs mt-1">
          Specify position, department, employment terms, and required skills.
        </p>
      </div>
      <Field label="Position Name *">
        <Input
          value={docSettings.hrPositionName || ""}
          onChange={(e) => set({ hrPositionName: e.target.value })}
          placeholder="e.g. UI/UX Designer"
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
          placeholder="e.g. Design Department"
        />
      </Field>
      <Field label="Employment Type *">
        <Select
          value={docSettings.hrEmploymentType || ""}
          onChange={(e) => set({ hrEmploymentType: e.target.value })}
        >
          <option value="">— Select —</option>
          {EMPLOYMENT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Work Mode *">
        <Select
          value={docSettings.hrWorkMode || ""}
          onChange={(e) => set({ hrWorkMode: e.target.value })}
        >
          <option value="">— Select —</option>
          {WORK_MODES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Location">
        <Input
          value={docSettings.hrLocation || ""}
          onChange={(e) => set({ hrLocation: e.target.value })}
          placeholder="e.g. Tangail"
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
        min={
          toISODate(docSettings.hrRecruitmentStartDate || "") || getTodayISO()
        }
      />
      <div>
        <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wide mb-1.5">
          Required Skills *
        </label>
        <SkillTagInput skills={skills} onAdd={addSkill} onRemove={removeSkill} />
        <p className="text-[10px] text-[#94A3B8] mt-1">
          Press Enter or &ldquo;,&rdquo; after each skill.
        </p>
      </div>
      <Field label="Experience Required">
        <Select
          value={docSettings.hrExperienceRequired || ""}
          onChange={(e) => set({ hrExperienceRequired: e.target.value })}
        >
          <option value="">— Select Level —</option>
          <option value="Fresher / No Experience Required">
            Fresher / No Experience Required
          </option>
          <option value="Less than 1 year">Less than 1 year</option>
          <option value="1+ year">1+ year</option>
          <option value="2+ years">2+ years</option>
          <option value="3+ years">3+ years</option>
          <option value="4+ years">4+ years</option>
          <option value="5+ years">5+ years</option>
          <option value="7+ years">7+ years</option>
          <option value="10+ years">10+ years</option>
        </Select>
      </Field>
    </div>
  );
}

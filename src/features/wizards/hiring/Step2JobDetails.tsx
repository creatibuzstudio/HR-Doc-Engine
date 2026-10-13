import React, { useState } from "react";
import { FormField, FormInput, FormSelect } from "../components/FormFields";
import { HiringNoticePayload } from "@/types";
import { Plus, X } from "lucide-react";

interface Step2Props {
  data: HiringNoticePayload;
  onChange: (updates: Partial<HiringNoticePayload>) => void;
}

export default function Step2JobDetails({ data, onChange }: Step2Props) {
  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    if (skillInput.trim() && !data.skills.includes(skillInput.trim())) {
      onChange({ skills: [...data.skills, skillInput.trim()] });
      setSkillInput("");
    }
  };

  const removeSkill = (index: number) => {
    onChange({ skills: data.skills.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField label="Department">
          <FormInput
            placeholder="e.g. Engineering / Tech"
            value={data.department}
            onChange={(e) => onChange({ department: e.target.value })}
          />
        </FormField>

        <FormField label="Total Vacancies">
          <FormInput
            type="number"
            min={1}
            value={data.vacancies}
            onChange={(e) =>
              onChange({ vacancies: parseInt(e.target.value, 10) || 1 })
            }
          />
        </FormField>

        <FormField label="Employment Type">
          <FormSelect
            value={data.employmentType}
            onChange={(e) =>
              onChange({
                employmentType: e.target.value as "Full-Time" | "Contractual" | "Internship",
              })
            }
          >
            <option value="Full-Time">Full-Time</option>
            <option value="Contractual">Contractual</option>
            <option value="Internship">Internship</option>
          </FormSelect>
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Work Mode">
          <FormSelect
            value={data.workMode}
            onChange={(e) =>
              onChange({ workMode: e.target.value as "Remote" | "Onsite" | "Hybrid" })
            }
          >
            <option value="Remote">Remote</option>
            <option value="Onsite">Onsite</option>
            <option value="Hybrid">Hybrid</option>
          </FormSelect>
        </FormField>

        <FormField label="Primary Location">
          <FormInput
            placeholder="e.g. Rajshahi, Bangladesh"
            value={data.location}
            onChange={(e) => onChange({ location: e.target.value })}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Recruitment Start Date">
          <FormInput
            type="date"
            value={data.startDate}
            onChange={(e) => onChange({ startDate: e.target.value })}
          />
        </FormField>
        <FormField label="Application Deadline Date">
          <FormInput
            type="date"
            value={data.endDate}
            onChange={(e) => onChange({ endDate: e.target.value })}
          />
        </FormField>
      </div>

      {/* Dynamic Skill Tag Input */}
      <FormField label="Required Skill Tags">
        <div className="flex gap-2 mb-2">
          <FormInput
            placeholder="e.g. React, Next.js, TypeScript"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
          />
          <button
            type="button"
            onClick={addSkill}
            className="px-4 py-2 bg-secondary hover:bg-primary hover:text-primary-foreground border border-border rounded-xl text-xs font-semibold flex items-center gap-1 transition"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {data.skills.map((skill, i) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-card border border-border text-[11px] font-medium"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(i)}
                className="text-muted-foreground hover:text-destructive transition"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </FormField>
    </div>
  );
}

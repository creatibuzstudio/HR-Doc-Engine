"use client";

import React, { useState } from "react";
import { DocSettings } from "@/types";
import { TextInput } from "@/components/forms/FormPrimitives";
import { toISODate, toDisplayDate, getTodayISO } from "@/lib/utils/dateUtils";

interface HRSettingsTabProps {
  docSettings: DocSettings;
  setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>;
}

function SkillInput({
  skills,
  setDocSettings,
}: {
  skills: string[];
  setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>;
}) {
  const [val, setVal] = useState("");
  const add = () => {
    const t = val.trim();
    if (t && !skills.includes(t)) {
      setDocSettings((p) => ({
        ...p,
        hrRequiredSkills: [...(p.hrRequiredSkills || []), t],
      }));
      setVal("");
    }
  };
  return (
    <>
      <input
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add();
          }
        }}
        placeholder="Add skill…"
        className="flex-1 bg-[#F1F5F9] border border-[#DBEAFE] focus:border-[#7C3AED] rounded-lg py-1.5 px-2.5 text-xs text-[#0F172A] focus:outline-none transition"
      />
      <button
        type="button"
        onClick={add}
        className="px-3 py-1.5 bg-[#7C3AED] text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-[#6D28D9] transition"
      >
        Add
      </button>
    </>
  );
}

export function HRSettingsTab({ docSettings, setDocSettings }: HRSettingsTabProps) {
  const set = (patch: Partial<DocSettings>) =>
    setDocSettings((p) => ({ ...p, ...patch }));
  const skills = docSettings.hrRequiredSkills || [];

  return (
    <div className="space-y-4">
      <TextInput
        label="Notice Date"
        type="date"
        max={getTodayISO()}
        value={toISODate(docSettings.date)}
        onChange={(e) => set({ date: toDisplayDate(e.target.value) })}
      />
      <TextInput
        label="Recipient Role"
        value={docSettings.hrRecipientRole || ""}
        onChange={(e) => set({ hrRecipientRole: e.target.value })}
      />
      <TextInput
        label="Notice Title"
        value={docSettings.hrNoticeTitle || ""}
        onChange={(e) => set({ hrNoticeTitle: e.target.value })}
      />
      <TextInput
        label="Subject"
        value={docSettings.hrSubject || ""}
        onChange={(e) => set({ hrSubject: e.target.value })}
      />
      <TextInput
        label="Position Name"
        value={docSettings.hrPositionName || ""}
        onChange={(e) => set({ hrPositionName: e.target.value })}
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold text-[#334155] uppercase tracking-wider">
          Vacancies
        </label>
        <input
          type="number"
          min={1}
          max={99}
          value={docSettings.hrVacancies ?? 1}
          onChange={(e) =>
            set({ hrVacancies: Math.max(1, parseInt(e.target.value) || 1) })
          }
          className="w-full bg-[#F1F5F9] border border-[#DBEAFE] focus:border-[#7C3AED] rounded-xl py-2.5 px-3 text-xs md:text-sm text-[#0F172A] focus:outline-none transition"
        />
      </div>
      <TextInput
        label="Department"
        value={docSettings.hrDepartment || ""}
        onChange={(e) => set({ hrDepartment: e.target.value })}
      />
      <TextInput
        label="Employment Type"
        value={docSettings.hrEmploymentType || ""}
        onChange={(e) => set({ hrEmploymentType: e.target.value })}
      />
      <TextInput
        label="Work Mode"
        value={docSettings.hrWorkMode || ""}
        onChange={(e) => set({ hrWorkMode: e.target.value })}
      />
      <TextInput
        label="Location"
        value={docSettings.hrLocation || ""}
        onChange={(e) => set({ hrLocation: e.target.value })}
      />
      <TextInput
        label="Recruitment Start Date"
        type="date"
        min={getTodayISO()}
        value={toISODate(docSettings.hrRecruitmentStartDate || "")}
        onChange={(e) =>
          set({ hrRecruitmentStartDate: toDisplayDate(e.target.value) })
        }
      />
      <TextInput
        label="Recruitment End Date"
        type="date"
        min={toISODate(docSettings.hrRecruitmentStartDate || "") || getTodayISO()}
        value={toISODate(docSettings.hrRecruitmentEndDate || "")}
        onChange={(e) =>
          set({ hrRecruitmentEndDate: toDisplayDate(e.target.value) })
        }
      />
      <TextInput
        label="Prepared By"
        value={docSettings.hrPreparedByName || ""}
        onChange={(e) => set({ hrPreparedByName: e.target.value })}
      />
      <TextInput
        label="Designation"
        value={docSettings.hrPreparedByDesignation || ""}
        onChange={(e) => set({ hrPreparedByDesignation: e.target.value })}
      />
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-[#334155] uppercase tracking-wide">
          Notice Reference ID
        </label>
        <input
          type="text"
          value={docSettings.hrNoticeRefId || ""}
          readOnly
          className="w-full bg-[#F1F5F9] border border-[#DBEAFE] rounded-lg py-2 px-3 text-xs text-[#0F172A] font-mono font-bold"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold text-[#334155] uppercase tracking-wider">
          Required Skills
        </label>
        <div className="flex gap-2">
          <SkillInput skills={skills} setDocSettings={setDocSettings} />
        </div>
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {skills.map((s, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-800 border border-violet-200 cursor-pointer"
                onClick={() =>
                  set({ hrRequiredSkills: skills.filter((_, idx) => idx !== i) })
                }
              >
                {s} <span className="text-violet-400 font-black">×</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

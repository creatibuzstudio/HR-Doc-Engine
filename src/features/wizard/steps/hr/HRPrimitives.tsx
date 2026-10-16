"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { toISODate, toDisplayDate } from "@/lib/utils/dateUtils";

export const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wide">
    {label}
    <span className="block mt-1.5">{children}</span>
  </label>
);

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full bg-[#F8FAFC] border border-[#DBEAFE] focus:border-[#7C3AED] rounded-xl py-3 px-4 text-sm text-[#0F172A] focus:outline-none transition ${props.className || ""}`}
  />
);

export const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...props}
    className={`w-full bg-[#F8FAFC] border border-[#DBEAFE] focus:border-[#7C3AED] rounded-xl py-3 px-4 text-sm text-[#0F172A] focus:outline-none transition cursor-pointer ${props.className || ""}`}
  />
);

export function DateField({ label, value, onChange, min, max }: { label: string; value: string; onChange: (v: string) => void; min?: string; max?: string }) {
  return (
    <Field label={label}>
      <Input
        type="date"
        value={toISODate(value)}
        min={min}
        max={max}
        onChange={(e) => onChange(toDisplayDate(e.target.value))}
        className="cursor-pointer"
      />
    </Field>
  );
}

export function SkillTagInput({ skills, onAdd, onRemove }: { skills: string[]; onAdd: (s: string) => void; onRemove: (i: number) => void }) {
  const [val, setVal] = useState("");
  const add = () => {
    const t = val.trim();
    if (t && !skills.includes(t)) {
      onAdd(t);
      setVal("");
    }
  };
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add();
            }
          }}
          placeholder='Type a skill and press Enter or ","'
          className="flex-1 bg-[#F8FAFC] border border-[#DBEAFE] focus:border-[#7C3AED] rounded-xl py-2.5 px-4 text-sm text-[#0F172A] focus:outline-none transition"
        />
        <button
          type="button"
          onClick={add}
          className="px-3.5 py-2.5 bg-[#7C3AED] text-white rounded-xl font-bold text-xs flex items-center gap-1 hover:bg-[#6D28D9] transition cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 p-3 bg-violet-50/60 border border-violet-100 rounded-xl min-h-[44px]">
          {skills.map((s, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800 border border-violet-200"
            >
              {s}
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="ml-0.5 text-violet-500 hover:text-violet-900 transition cursor-pointer"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

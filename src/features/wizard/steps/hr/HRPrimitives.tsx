"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { toISODate, toDisplayDate } from "@/lib/utils/dateUtils";

export const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block text-xs font-semibold text-header-text uppercase tracking-wide">
    {label}
    <span className="block mt-1.5">{children}</span>
  </label>
);

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full bg-secondary border border-border focus:border-primary rounded-xl py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none transition ${props.className || ""}`}
  />
);

export const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div className="relative">
    <select
      {...props}
      className={`w-full bg-secondary border border-border focus:border-primary rounded-xl py-3 pl-4 pr-8 text-sm text-foreground focus:outline-none transition cursor-pointer appearance-none ${props.className || ""}`}
    />
    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground text-[10px]">
      ▼
    </div>
  </div>
);

export function DateField({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  min?: string;
  max?: string;
}) {
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

export function SkillTagInput({
  skills,
  onAdd,
  onRemove,
}: {
  skills: string[];
  onAdd: (s: string) => void;
  onRemove: (i: number) => void;
}) {
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
          placeholder='Type a skill and press Enter (e.g. React, Figma, Node.js)'
          className="flex-1 bg-secondary border border-border focus:border-primary rounded-xl py-2.5 px-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none transition"
        />
        <button
          type="button"
          onClick={add}
          className="px-4 py-2.5 bg-primary hover:opacity-95 text-primary-foreground rounded-xl font-bold text-xs flex items-center gap-1 transition shadow-sm cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 p-3 bg-secondary/40 border border-border rounded-xl min-h-[44px]">
          {skills.map((s, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
            >
              {s}
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="ml-0.5 text-muted-foreground hover:text-destructive transition cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

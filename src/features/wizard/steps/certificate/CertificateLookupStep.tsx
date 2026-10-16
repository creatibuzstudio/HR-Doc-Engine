"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { SecondParty, DocSettings } from "@/types";
import { useDataCache, InternOption } from "@/lib/context/DataCacheContext";
import { toISODate, toDisplayDate, getTodayISO } from "@/lib/utils/dateUtils";

const PERFORMANCE_GRADES = [
  "Outstanding",
  "Excellent",
  "Very Good",
  "Good",
  "Satisfactory",
  "Other",
];

type FetchedIntern = InternOption;

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wide">
    {label}
    <span className="block mt-1.5">{children}</span>
  </label>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full bg-[#F8FAFC] border border-[#DBEAFE] focus:border-[#6366F1] rounded-xl py-3 px-4 text-sm text-[#0F172A] focus:outline-none transition ${
      props.className || ""
    }`}
  />
);

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...props}
    className={`w-full bg-[#F8FAFC] border border-[#DBEAFE] focus:border-[#6366F1] rounded-xl py-3 px-4 text-sm text-[#0F172A] focus:outline-none transition cursor-pointer ${
      props.className || ""
    }`}
  />
);

export interface CertificateLookupStepProps {
  secondParty: SecondParty;
  setSecondParty: React.Dispatch<React.SetStateAction<SecondParty>>;
  docSettings: DocSettings;
  setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>;
  onClearError: () => void;
}

export function CertificateLookupStep({
  secondParty,
  setSecondParty,
  docSettings,
  setDocSettings,
  onClearError,
}: CertificateLookupStepProps) {
  const { cache } = useDataCache();
  const interns: FetchedIntern[] = cache.internsList ?? [];
  const loading = cache.internsList === null;

  const [selectedInternId, setSelectedInternId] = useState("");
  const [customGrade, setCustomGrade] = useState("");

  const handleInternChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedInternId(value);
    onClearError();

    const selected = interns.find((i) => i.internId === value);
    if (selected) {
      setSecondParty((prev) => ({
        ...prev,
        fullName: selected.fullName,
        email: selected.email,
        position: selected.position,
        department: selected.department || "Development",
        partnerId: selected.internId,
      }));

      const isCustomGrade =
        !PERFORMANCE_GRADES.includes(selected.performanceGrade) &&
        selected.performanceGrade !== "";
      setCustomGrade(isCustomGrade ? selected.performanceGrade : "");

      setDocSettings((prev) => ({
        ...prev,
        certOriginalAgreementId: selected.agreementId,
        certInternId: selected.internId,
        certStartDate: "July 1, 2026",
        certEndDate: "August 15, 2026",
        certPerformanceGrade: selected.performanceGrade || "Outstanding",
      }));
    } else {
      setSecondParty((prev) => ({
        ...prev,
        fullName: "",
        email: "",
        position: "",
        department: "",
        partnerId: "",
      }));
      setDocSettings((prev) => ({
        ...prev,
        certOriginalAgreementId: "",
        certInternId: "",
        certStartDate: "",
        certEndDate: "",
        certPerformanceGrade: "Outstanding",
      }));
      setCustomGrade("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#DBEAFE] pb-4">
        <h3 className="text-[#0F172A] font-bold text-base">
          Select Intern &amp; Review Details
        </h3>
        <p className="text-[#64748B] text-xs mt-1">
          Select an intern with a fully-executed agreement to load their details. You
          can modify these values if needed.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <Field label="Intern ID Lookup *">
            {loading ? (
              <div className="w-full flex items-center justify-center py-3 bg-[#F8FAFC] border border-[#DBEAFE] rounded-xl text-xs text-slate-400 font-medium">
                <svg
                  className="animate-spin -ml-1 mr-3 h-4 w-4 text-[#6366F1]"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Fetching executed interns...
              </div>
            ) : interns.length === 0 ? (
              <div className="w-full text-center py-3.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold rounded-xl">
                ⚠️ No fully executed internship offer letters found in database.
              </div>
            ) : (
              <Select value={selectedInternId} onChange={handleInternChange}>
                <option value="">— Select Intern —</option>
                {interns.map((i) => (
                  <option key={i.internId} value={i.internId}>
                    {i.internId} — {i.fullName} ({i.position})
                  </option>
                ))}
              </Select>
            )}
          </Field>
        </div>

        {selectedInternId && (
          <>
            <Field label="Intern Name *">
              <Input
                value={secondParty.fullName || ""}
                onChange={(e) =>
                  setSecondParty((p) => ({ ...p, fullName: e.target.value }))
                }
                placeholder="Intern's Full Name"
              />
            </Field>

            <Field label="Internship Position/Role *">
              <Input
                value={secondParty.position || ""}
                onChange={(e) =>
                  setSecondParty((p) => ({ ...p, position: e.target.value }))
                }
                placeholder="e.g. Frontend Developer Intern"
              />
            </Field>

            <Field label="Department *">
              <Input
                value={secondParty.department || ""}
                onChange={(e) =>
                  setSecondParty((p) => ({ ...p, department: e.target.value }))
                }
                placeholder="e.g. Development Department"
              />
            </Field>

            <Field label="Performance Grade *">
              <Select
                value={
                  docSettings.certPerformanceGrade === customGrade
                    ? "Other"
                    : docSettings.certPerformanceGrade || "Outstanding"
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "Other") {
                    setDocSettings((p) => ({ ...p, certPerformanceGrade: customGrade }));
                  } else {
                    setDocSettings((p) => ({ ...p, certPerformanceGrade: val }));
                  }
                }}
              >
                {PERFORMANCE_GRADES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </Select>
              {(docSettings.certPerformanceGrade === customGrade ||
                !PERFORMANCE_GRADES.includes(docSettings.certPerformanceGrade || "")) && (
                <Input
                  className="mt-2"
                  value={customGrade}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCustomGrade(val);
                    setDocSettings((p) => ({ ...p, certPerformanceGrade: val }));
                  }}
                  placeholder="Enter custom grade (e.g. A+, Outstanding Extraordinaire)"
                />
              )}
            </Field>

            <Field label="Internship Start Date *">
              <Input
                type="date"
                max={getTodayISO()}
                value={toISODate(docSettings.certStartDate || "")}
                onChange={(e) =>
                  setDocSettings((p) => ({
                    ...p,
                    certStartDate: toDisplayDate(e.target.value),
                  }))
                }
              />
            </Field>

            <Field label="Internship End Date *">
              <Input
                type="date"
                max={getTodayISO()}
                min={toISODate(docSettings.certStartDate || "")}
                value={toISODate(docSettings.certEndDate || "")}
                onChange={(e) =>
                  setDocSettings((p) => ({
                    ...p,
                    certEndDate: toDisplayDate(e.target.value),
                  }))
                }
              />
            </Field>

            <div className="md:col-span-2 p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
              <p className="text-[11px] font-bold text-indigo-900 uppercase tracking-wide flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-indigo-600" /> Database
                Synchronization Enabled
              </p>
              <p className="text-[10px] text-indigo-700/80 mt-1 leading-relaxed">
                Edits made to name, role, department, or dates will update the original
                agreement (ID:{" "}
                <strong className="font-mono">
                  {docSettings.certOriginalAgreementId}
                </strong>
                ) upon finalizing, maintaining consistent records.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

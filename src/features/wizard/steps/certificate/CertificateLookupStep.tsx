"use client";

import React, { useState } from "react";
import {
  Award,
  Briefcase,
  Building2,
  Calendar,
  Check,
  AlertCircle,
  User,
  Hash,
  Info,
  ChevronDown,
} from "lucide-react";
import { SecondParty, DocSettings } from "@/types";
import { useDataCache, InternOption } from "@/lib/context/DataCacheContext";
import { toISODate, toDisplayDate, getTodayISO } from "@/lib/utils/dateUtils";
import { Field, IconInput, IconSelect, StepHeader } from "@/components/forms/FormPrimitives";

const PERFORMANCE_GRADES = [
  "Outstanding",
  "Excellent",
  "Very Good",
  "Good",
  "Satisfactory",
  "Other",
];

type FetchedIntern = InternOption;

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

  const [selectedInternId, setSelectedInternId] = useState(
    docSettings.certInternId || secondParty.partnerId || ""
  );
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
      <StepHeader
        title="Section 1: Select Intern & Hydrate Certificate"
        desc="Select a completed intern directly from the agreement database. All profile details will be auto-loaded and can be adjusted before certificate generation."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <Field label="Select Executed Intern Record *">
            {loading ? (
              <div className="w-full flex items-center justify-center py-4 bg-secondary border border-border rounded-xl text-xs text-muted-foreground font-medium">
                <svg
                  className="animate-spin -ml-1 mr-3 h-4 w-4 text-primary"
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
                Fetching executed interns from database...
              </div>
            ) : interns.length === 0 ? (
              <div className="w-full p-4 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>
                  No finalized or executed internship offer letters found in the database. You can manually enter details below or verify agreement statuses in the Dashboard.
                </span>
              </div>
            ) : (
              <div className="relative">
                <select
                  value={selectedInternId}
                  onChange={handleInternChange}
                  className="w-full bg-secondary border border-border focus:border-primary rounded-xl py-3 pl-4 pr-10 text-sm text-foreground focus:outline-none transition cursor-pointer appearance-none"
                >
                  <option value="" className="bg-card text-foreground">
                    — Choose an Intern from Database —
                  </option>
                  {interns.map((i) => (
                    <option
                      key={i.internId}
                      value={i.internId}
                      className="bg-card text-foreground"
                    >
                      {i.internId} — {i.fullName} ({i.position || "Intern"})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            )}
          </Field>
        </div>

        {selectedInternId ? (
          <>
            <div className="md:col-span-2 p-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-start gap-3">
              <div className="p-2 bg-primary/20 rounded-xl text-primary shrink-0 mt-0.5">
                <Check className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-primary uppercase tracking-wide">
                  Intern Record Loaded &amp; Synchronized
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                  <span>
                    Intern ID:{" "}
                    <strong className="text-foreground font-mono">
                      {docSettings.certInternId || selectedInternId}
                    </strong>
                  </span>
                  <span>&middot;</span>
                  <span>
                    Agreement Ref:{" "}
                    <strong className="text-foreground font-mono">
                      {docSettings.certOriginalAgreementId || "N/A"}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            <Field label="Intern Full Name *">
              <IconInput
                icon={User}
                value={secondParty.fullName || ""}
                onChange={(e) =>
                  setSecondParty((p) => ({ ...p, fullName: e.target.value }))
                }
                placeholder="Intern's Full Name"
              />
            </Field>

            <Field label="Internship Position / Track *">
              <IconInput
                icon={Briefcase}
                value={secondParty.position || ""}
                onChange={(e) =>
                  setSecondParty((p) => ({ ...p, position: e.target.value }))
                }
                placeholder="e.g. Frontend Developer Intern"
              />
            </Field>

            <Field label="Department *">
              <IconInput
                icon={Building2}
                value={secondParty.department || ""}
                onChange={(e) =>
                  setSecondParty((p) => ({ ...p, department: e.target.value }))
                }
                placeholder="e.g. Engineering & Product"
              />
            </Field>

            <Field label="Performance Rating *">
              <IconSelect
                icon={Award}
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
                  <option key={g} value={g} className="bg-card text-foreground">
                    {g}
                  </option>
                ))}
              </IconSelect>
              {(docSettings.certPerformanceGrade === customGrade ||
                !PERFORMANCE_GRADES.includes(docSettings.certPerformanceGrade || "")) && (
                <div className="mt-2">
                  <IconInput
                    icon={Award}
                    value={customGrade}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomGrade(val);
                      setDocSettings((p) => ({ ...p, certPerformanceGrade: val }));
                    }}
                    placeholder="Enter custom grade (e.g. Magna Cum Laude, A+)"
                  />
                </div>
              )}
            </Field>

            <Field label="Internship Start Date *">
              <IconInput
                icon={Calendar}
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

            <Field label="Internship Completion Date *">
              <IconInput
                icon={Calendar}
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
          </>
        ) : (
          <div className="md:col-span-2 p-8 border border-dashed border-border rounded-2xl bg-secondary/20 flex flex-col items-center justify-center text-center gap-3">
            <div className="p-3 bg-secondary rounded-2xl border border-border text-muted-foreground">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                No Intern Record Selected Yet
              </p>
              <p className="text-xs text-muted-foreground max-w-md mt-1">
                Choose an intern from the dropdown above to automatically load their
                name, role, department, and tenure for the certificate.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

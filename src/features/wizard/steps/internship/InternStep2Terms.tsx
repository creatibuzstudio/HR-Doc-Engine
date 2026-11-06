"use client";

import React from "react";
import { motion } from "motion/react";
import { Calendar, Hash, Building2, Banknote, Clock } from "lucide-react";
import { SecondParty, DocSettings } from "@/types";
import { Field, IconInput, IconSelect, StepHeader } from "@/components/forms/FormPrimitives";
import { toISODate, toDisplayDate, getTodayISO } from "@/lib/utils/dateUtils";

export interface InternStep2Props {
  docSettings: DocSettings;
  setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>;
  secondParty: SecondParty;
  setSecondParty: React.Dispatch<React.SetStateAction<SecondParty>>;
  onClearError?: () => void;
}

export function InternStep2({
  docSettings,
  setDocSettings,
  secondParty,
  setSecondParty,
  onClearError,
}: InternStep2Props) {
  const currentYearStr = new Date().getFullYear().toString().slice(-2);
  const [internWarning, setInternWarning] = React.useState("");
  const [refWarning, setRefWarning] = React.useState("");

  const buildInternId = React.useCallback(
    (serial: string) => (serial ? `CBS-INT-${currentYearStr}-${serial.padStart(3, "0")}` : ""),
    [currentYearStr],
  );
  const buildRefId = React.useCallback(
    (serial: string) => (serial ? `CBS/INT-REF-${currentYearStr}/${serial.padStart(3, "0")}` : ""),
    [currentYearStr],
  );

  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/check-id?action=nextIntern")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const internSerial = data.internId?.split(/[-/]/).pop() || "001";
        const refSerial = data.internRefId?.split(/[-/]/).pop() || "001";
        const assignedInternId = data.internId || `CBS-INT-${currentYearStr}-${internSerial}`;
        const assignedRefId = data.internRefId || `CBS/INT-REF-${currentYearStr}/${refSerial}`;

        setSecondParty((p) => ({
          ...p,
          partnerId: assignedInternId,
          partnerIdSerial: internSerial,
        }));
        setDocSettings((p) => ({
          ...p,
          internId: assignedInternId,
          internIdSerial: internSerial,
          internRefId: assignedRefId,
          internRefIdSerial: refSerial,
          internshipDuration: p.internshipDuration || "3",
          isPaid: p.isPaid ?? true,
          date: p.date || new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        }));
      })
      .catch(console.error);
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!secondParty.partnerId) return;
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/check-id?action=check&partnerId=${secondParty.partnerId}`);
        const d = await r.json();
        setInternWarning(d.partnerTaken ? "⚠️ This Intern ID is already taken." : "");
      } catch {
        /* ignore */
      }
    }, 500);
    return () => clearTimeout(t);
  }, [secondParty.partnerId]);

  React.useEffect(() => {
    if (!docSettings.internRefId) return;
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/check-id?action=check&agreementId=${docSettings.internRefId}`);
        const d = await r.json();
        setRefWarning(d.agreementTaken ? "⚠️ This Ref ID is already taken." : "");
      } catch {
        /* ignore */
      }
    }, 500);
    return () => clearTimeout(t);
  }, [docSettings.internRefId]);

  const handleInternSerialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onClearError?.();
    const serial = e.target.value.replace(/\D/g, "").slice(0, 3);
    const id = buildInternId(serial);
    setSecondParty((p) => ({ ...p, partnerIdSerial: serial, partnerId: id }));
    setDocSettings((p) => ({ ...p, internIdSerial: serial, internId: id }));
  };

  const handleRefSerialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onClearError?.();
    const serial = e.target.value.replace(/\D/g, "").slice(0, 3);
    setDocSettings((p) => ({ ...p, internRefIdSerial: serial, internRefId: buildRefId(serial) }));
  };

  const normalizeInternSerial = () => {
    const serial = (docSettings.internIdSerial || "").padStart(3, "0");
    const id = buildInternId(serial);
    setSecondParty((p) => ({ ...p, partnerIdSerial: serial, partnerId: id }));
    setDocSettings((p) => ({ ...p, internIdSerial: serial, internId: id }));
  };

  const normalizeRefSerial = () => {
    const serial = (docSettings.internRefIdSerial || "").padStart(3, "0");
    setDocSettings((p) => ({ ...p, internRefIdSerial: serial, internRefId: buildRefId(serial) }));
  };

  const updateDuration = (months: number) => {
    onClearError?.();
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + months);
    const expiryStr = expiry.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setDocSettings((p) => ({
      ...p,
      internshipDuration: String(months),
      internExpiryDate: expiryStr,
    }));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <StepHeader
        title="Section 2: Internship Specifications & Terms"
        desc="Configure the term duration, compensation model, department, and document tracking IDs."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Offer Issue Date *">
          <IconInput
            icon={Calendar}
            type="text"
            placeholder="e.g. November 06, 2026"
            value={docSettings.date || ""}
            onChange={(e) => {
              onClearError?.();
              setDocSettings((p) => ({ ...p, date: e.target.value }));
            }}
          />
        </Field>

        <Field label="Assigned Department">
          <IconSelect
            icon={Building2}
            value={secondParty.department || "Software Engineering"}
            onChange={(e) => {
              onClearError?.();
              setSecondParty((p) => ({ ...p, department: e.target.value }));
              setDocSettings((p) => ({ ...p, internDepartment: e.target.value }));
            }}
          >
            <option value="Software Engineering">Software Engineering</option>
            <option value="Full-Stack Web Development">Full-Stack Web Development</option>
            <option value="Creative & UI/UX Design">Creative &amp; UI/UX Design</option>
            <option value="Digital Marketing & Growth">Digital Marketing &amp; Growth</option>
            <option value="Product Operations">Product Operations</option>
          </IconSelect>
        </Field>
      </div>

      {/* Duration slider */}
      <div className="p-5 bg-secondary/60 border border-border rounded-2xl flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-header-text uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Internship Duration
          </label>
          <span className="text-xs text-primary font-bold bg-primary/10 px-3 py-1 border border-primary/20 rounded-full">
            {Number(docSettings.internshipDuration) || 3} Months Tenor
          </span>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={1}
            max={12}
            value={Number(docSettings.internshipDuration) || 3}
            onChange={(e) => updateDuration(parseInt(e.target.value, 10))}
            className="flex-1 accent-primary cursor-pointer h-2 bg-secondary rounded-lg"
          />
          <input
            type="number"
            min={1}
            max={12}
            value={Number(docSettings.internshipDuration) || 3}
            onChange={(e) =>
              updateDuration(Math.min(12, Math.max(1, parseInt(e.target.value) || 1)))
            }
            className="w-16 text-center bg-card border border-border rounded-xl py-2 text-foreground text-xs font-bold focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex justify-between items-center text-[11px] text-muted-foreground pt-1 border-t border-border/50">
          <span>Expected Completion:</span>
          <span className="font-semibold text-foreground">
            {docSettings.internExpiryDate || "Calculated upon selection"}
          </span>
        </div>
      </div>

      {/* Compensation Type & Stipend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Compensation Structure *">
          <div className="grid grid-cols-2 gap-2 h-11">
            {[true, false].map((paid) => (
              <button
                key={String(paid)}
                type="button"
                onClick={() => {
                  onClearError?.();
                  setDocSettings((p) => ({ ...p, isPaid: paid }));
                }}
                className={`text-xs font-bold rounded-xl border transition cursor-pointer flex items-center justify-center ${
                  docSettings.isPaid === paid
                    ? "bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "bg-secondary border-border text-foreground hover:border-primary/50"
                }`}
              >
                {paid ? "Paid Internship" : "Academic / Unpaid"}
              </button>
            ))}
          </div>
        </Field>

        <Field label={docSettings.isPaid ? "Monthly Stipend (BDT) *" : "Monthly Stipend"}>
          <IconInput
            icon={Banknote}
            type="text"
            placeholder={docSettings.isPaid ? "e.g. 10,000 BDT" : "Not applicable (Unpaid)"}
            disabled={!docSettings.isPaid}
            value={docSettings.internStipend || (docSettings.isPaid ? "10,000 BDT" : "None")}
            onChange={(e) => {
              onClearError?.();
              setDocSettings((p) => ({ ...p, internStipend: e.target.value }));
            }}
          />
        </Field>
      </div>

      {/* Unique Identifiers */}
      <div className="bg-secondary/40 border border-border p-5 rounded-2xl">
        <div className="mb-4">
          <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
            <Hash className="w-4 h-4" /> Unique Identification &amp; Reference Codes
          </span>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Enter 3 digits for custom serial, or use the pre-generated sequence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-semibold text-header-text uppercase tracking-wide block mb-1.5">
              Internee ID
            </label>
            <div className="flex items-stretch bg-card border border-border focus-within:border-primary rounded-xl overflow-hidden h-11">
              <div className="flex items-center px-3 bg-secondary border-r border-border text-muted-foreground font-mono text-xs font-bold select-none">
                CBS-INT-{currentYearStr}-
              </div>
              <input
                type="text"
                maxLength={3}
                value={docSettings.internIdSerial || ""}
                onChange={handleInternSerialChange}
                onBlur={normalizeInternSerial}
                className="flex-1 bg-transparent px-3 text-sm font-mono font-bold text-foreground focus:outline-none"
                placeholder="001"
              />
            </div>
            <div className="flex justify-between items-center mt-1.5">
              <p
                className={`text-xs font-mono font-bold ${
                  internWarning ? "text-destructive" : "text-emerald-500"
                }`}
              >
                {docSettings.internId || `CBS-INT-${currentYearStr}-001`}
              </p>
              {internWarning && (
                <p className="text-[10px] text-destructive font-bold">{internWarning}</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-header-text uppercase tracking-wide block mb-1.5">
              Agreement Reference ID
            </label>
            <div className="flex items-stretch bg-card border border-border focus-within:border-primary rounded-xl overflow-hidden h-11">
              <div className="flex items-center px-3 bg-secondary border-r border-border text-muted-foreground font-mono text-xs font-bold select-none">
                CBS/INT-REF-{currentYearStr}/
              </div>
              <input
                type="text"
                maxLength={3}
                value={docSettings.internRefIdSerial || ""}
                onChange={handleRefSerialChange}
                onBlur={normalizeRefSerial}
                className="flex-1 bg-transparent px-3 text-sm font-mono font-bold text-foreground focus:outline-none"
                placeholder="001"
              />
            </div>
            <div className="flex justify-between items-center mt-1.5">
              <p
                className={`text-xs font-mono font-bold ${
                  refWarning ? "text-destructive" : "text-emerald-500"
                }`}
              >
                {docSettings.internRefId || `CBS/INT-REF-${currentYearStr}/001`}
              </p>
              {refWarning && (
                <p className="text-[10px] text-destructive font-bold">{refWarning}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

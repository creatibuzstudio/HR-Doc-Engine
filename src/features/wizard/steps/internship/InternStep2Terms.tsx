"use client";

import React from "react";
import { motion } from "motion/react";
import { Calendar, Hash } from "lucide-react";
import { SecondParty, DocSettings } from "@/types";
import { Field, IconInput, StepHeader } from "@/components/forms/FormPrimitives";
import { toISODate, toDisplayDate, getTodayISO } from "@/lib/utils/dateUtils";

export interface InternStep2Props {
  docSettings: DocSettings;
  setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>;
  secondParty: SecondParty;
  setSecondParty: React.Dispatch<React.SetStateAction<SecondParty>>;
}

export function InternStep2({
  docSettings,
  setDocSettings,
  secondParty,
  setSecondParty,
}: InternStep2Props) {
  const currentYearStr = new Date().getFullYear().toString().slice(-2);
  const [internWarning, setInternWarning] = React.useState("");
  const [refWarning, setRefWarning] = React.useState("");

  const buildInternId = React.useCallback(
    (serial: string) => (serial ? `JVX-INT-${currentYearStr}-${serial.padStart(3, "0")}` : ""),
    [currentYearStr],
  );
  const buildRefId = React.useCallback(
    (serial: string) => (serial ? `JVX-INT-REF-${currentYearStr}-${serial.padStart(3, "0")}` : ""),
    [currentYearStr],
  );

  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/check-id?action=nextIntern")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const internSerial = data.internId?.split("-").pop() || "001";
        const refSerial = data.internRefId?.split("-").pop() || "001";
        setSecondParty((p) => ({ ...p, partnerId: data.internId, partnerIdSerial: internSerial }));
        setDocSettings((p) => ({
          ...p,
          internId: data.internId,
          internIdSerial: internSerial,
          internRefId: data.internRefId,
          internRefIdSerial: refSerial,
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
    const serial = e.target.value.replace(/\D/g, "").slice(0, 3);
    const id = buildInternId(serial);
    setSecondParty((p) => ({ ...p, partnerIdSerial: serial, partnerId: id }));
    setDocSettings((p) => ({ ...p, internIdSerial: serial, internId: id }));
  };

  const handleRefSerialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <StepHeader
        title="Section 2: Internship Terms"
        desc="Set the offer date, duration, compensation type, and unique identifiers."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 md:col-span-2">
          <Field label="Offer Date *">
            <IconInput
              icon={Calendar}
              type="date"
              max={getTodayISO()}
              value={toISODate(docSettings.date || "")}
              onChange={(e) => setDocSettings((p) => ({ ...p, date: toDisplayDate(e.target.value) }))}
            />
          </Field>
        </div>

        <div className="col-span-1 md:col-span-2 p-4 bg-[#F8FAFC] border border-[#DBEAFE] rounded-2xl flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-bold text-[#334155] uppercase tracking-wider">
              Internship Duration
            </label>
            <span className="text-sm text-[#2563EB] font-extrabold bg-[#EFF6FF] px-2 py-0.5 border border-[#DBEAFE] rounded-md">
              {Number(docSettings.internshipDuration) || 1} Months
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={12}
              value={Number(docSettings.internshipDuration) || 1}
              onChange={(e) => {
                const months = parseInt(e.target.value, 10);
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
              }}
              className="flex-1 accent-[#2563EB] cursor-pointer"
            />
            <input
              type="number"
              min={1}
              max={12}
              value={Number(docSettings.internshipDuration) || 1}
              onChange={(e) => {
                const months = Math.min(12, Math.max(1, parseInt(e.target.value) || 1));
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
              }}
              className="w-[60px] text-center bg-white border border-[#DBEAFE] rounded-xl py-1.5 text-[#0F172A] text-xs font-bold focus:outline-none focus:border-[#2563EB]"
            />
          </div>
          <p className="text-[10px] text-[#64748B] italic">
            Term expiry auto-set to:{" "}
            <strong className="text-[#2563EB]">{docSettings.internExpiryDate || "—"}</strong>
          </p>
        </div>

        <Field label="Compensation Type *">
          <div className="grid grid-cols-2 gap-2">
            {[true, false].map((paid) => (
              <button
                key={String(paid)}
                type="button"
                onClick={() => setDocSettings((p) => ({ ...p, isPaid: paid }))}
                className={`py-3 text-xs font-bold rounded-xl border transition cursor-pointer ${
                  docSettings.isPaid === paid
                    ? "bg-[#2563EB]/10 border-[#2563EB] text-[#2563EB]"
                    : "bg-[#F8FAFC] border-[#DBEAFE] text-[#334155] hover:border-[#2563EB]"
                }`}
              >
                {paid ? "Paid Internship" : "Unpaid Internship"}
              </button>
            ))}
          </div>
        </Field>

        <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-blue-50/50 to-indigo-50/20 border border-blue-100/60 p-5 rounded-2xl">
          <div className="mb-4">
            <span className="text-[11px] font-extrabold text-[#2563EB] uppercase tracking-widest flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5" /> UNIQUE IDENTIFIERS
            </span>
            <p className="text-[10px] text-slate-500 mt-1">
              Enter only the last 3 digits. Full IDs are generated automatically.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <label className="text-xs font-semibold text-[#334155] uppercase tracking-wide block mb-1.5">
                Intern ID
              </label>
              <div className="flex items-stretch bg-white border border-[#DBEAFE] focus-within:border-[#2563EB] rounded-xl overflow-hidden h-12">
                <div className="flex items-center px-3 bg-[#F8FAFC] border-r border-[#DBEAFE] text-slate-400 font-bold font-mono text-sm select-none">
                  JVX-INT-{currentYearStr}-
                </div>
                <input
                  type="text"
                  maxLength={3}
                  value={docSettings.internIdSerial || ""}
                  onChange={handleInternSerialChange}
                  onBlur={normalizeInternSerial}
                  className="flex-1 bg-transparent px-4 text-sm font-mono font-black focus:outline-none"
                  placeholder="001"
                />
              </div>
              <div className="flex justify-between items-center mt-1.5">
                <p
                  className={`text-xs font-mono font-bold ${
                    internWarning ? "text-rose-600" : "text-emerald-600"
                  }`}
                >
                  {docSettings.internId}
                </p>
                {internWarning && <p className="text-[10px] text-rose-600 font-bold">{internWarning}</p>}
              </div>
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-[#334155] uppercase tracking-wide block mb-1.5">
                Reference ID
              </label>
              <div className="flex items-stretch bg-white border border-[#DBEAFE] focus-within:border-[#2563EB] rounded-xl overflow-hidden h-12">
                <div className="flex items-center px-3 bg-[#F8FAFC] border-r border-[#DBEAFE] text-slate-400 font-bold font-mono text-xs select-none">
                  JVX-INT-REF-{currentYearStr}-
                </div>
                <input
                  type="text"
                  maxLength={3}
                  value={docSettings.internRefIdSerial || ""}
                  onChange={handleRefSerialChange}
                  onBlur={normalizeRefSerial}
                  className="flex-1 bg-transparent px-4 text-sm font-mono font-black focus:outline-none"
                  placeholder="001"
                />
              </div>
              <div className="flex justify-between items-center mt-1.5">
                <p
                  className={`text-xs font-mono font-bold ${
                    refWarning ? "text-rose-600" : "text-emerald-600"
                  }`}
                >
                  {docSettings.internRefId}
                </p>
                {refWarning && <p className="text-[10px] text-rose-600 font-bold">{refWarning}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

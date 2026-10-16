"use client";

import React from "react";
import { DocSettings } from "@/types";
import { toISODate, toDisplayDate, getTodayISO } from "@/lib/utils/dateUtils";

interface InternshipSettingsTabProps {
  docSettings: DocSettings;
  setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>;
}

export function InternshipSettingsTab({
  docSettings,
  setDocSettings,
}: InternshipSettingsTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          Offer Date
        </label>
        <input
          type="date"
          max={getTodayISO()}
          value={toISODate(docSettings.date)}
          onChange={(e) =>
            setDocSettings((p) => ({ ...p, date: toDisplayDate(e.target.value) }))
          }
          className="w-full bg-secondary border border-border focus:border-primary rounded-xl py-2.5 px-3 text-xs md:text-sm text-foreground focus:outline-none transition cursor-pointer"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Internship Duration
          </label>
          <span className="text-xs text-primary font-extrabold">
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
            className="flex-1 accent-primary cursor-pointer"
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
            className="w-[60px] text-center bg-secondary border border-border rounded-lg py-1 text-foreground text-xs font-bold"
          />
        </div>
        <p className="text-[10px] text-muted-foreground italic">
          Term expiry date:{" "}
          <strong className="text-primary">{docSettings.internExpiryDate || "—"}</strong>
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          Compensation Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[true, false].map((paid) => (
            <button
              key={String(paid)}
              type="button"
              onClick={() => setDocSettings((p) => ({ ...p, isPaid: paid }))}
              className={`py-2.5 text-xs font-bold rounded-xl border transition cursor-pointer ${
                docSettings.isPaid === paid
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary border-border text-foreground hover:border-primary"
              }`}
            >
              {paid ? "Paid" : "Unpaid"}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
          Intern ID
        </label>
        <input
          type="text"
          value={docSettings.internId || ""}
          readOnly
          className="w-full bg-secondary border border-border rounded-lg py-2 px-3 text-xs text-muted-foreground font-mono font-bold"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
          Reference ID
        </label>
        <input
          type="text"
          value={docSettings.internRefId || ""}
          readOnly
          className="w-full bg-secondary border border-border rounded-lg py-2 px-3 text-xs text-muted-foreground font-mono font-bold"
        />
      </div>
    </div>
  );
}

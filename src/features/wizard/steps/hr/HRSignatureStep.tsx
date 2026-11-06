"use client";

import React from "react";
import { motion } from "motion/react";
import { Check, Upload, UserCheck } from "lucide-react";
import { FirstParty, DocSettings } from "@/types";
import SignaturePad from "@/features/candidate-portal/components/SignaturePad";
import { StepHeader } from "@/components/forms/FormPrimitives";

interface HRSignatureStepProps {
  firstParty: FirstParty;
  setFirstParty: React.Dispatch<React.SetStateAction<FirstParty>>;
  onClearError: () => void;
  docSettings: DocSettings;
  setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>;
}

export function HRSignatureStep({
  firstParty,
  setFirstParty,
  onClearError,
  docSettings,
  setDocSettings,
}: HRSignatureStepProps) {
  const set = (patch: Partial<DocSettings>) =>
    setDocSettings((p) => ({ ...p, ...patch }));

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onClearError();
      if (typeof reader.result === "string") {
        setFirstParty((p) => ({ ...p, signatureImg: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const preparedName = docSettings.hrPreparedByName || firstParty.hrName || "Ashikur Rahman Ovi";
  const preparedDesignation = docSettings.hrPreparedByDesignation || "Head of HR Department";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <StepHeader
        title="Section 3: HR Representative Sign-off & Verification"
        desc="Authenticate the recruitment notice with the issuing HR representative's signature."
      />

      {/* Authorizing HR Requisition Box */}
      <div className="p-4 bg-secondary/60 border border-primary/30 rounded-2xl flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-header-text block">
            HR Issuing Officer
          </span>
          <span className="text-sm font-extrabold text-primary">
            {preparedName} ({preparedDesignation})
          </span>
          <span className="text-[11px] text-muted-foreground block mt-0.5">
            {docSettings.hrOrganization || firstParty.companyName || "Creatibuz Studio"} &middot; HR Department
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
          <UserCheck className="w-3 h-3" /> Requisitioner
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-header-text uppercase tracking-wide mb-1.5">
            Prepared By (Name) *
          </label>
          <input
            value={preparedName}
            onChange={(e) => set({ hrPreparedByName: e.target.value })}
            placeholder="e.g. Ashikur Rahman Ovi"
            className="w-full bg-secondary border border-border focus:border-primary rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none transition"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-header-text uppercase tracking-wide mb-1.5">
            Designation / Title *
          </label>
          <input
            value={preparedDesignation}
            onChange={(e) => set({ hrPreparedByDesignation: e.target.value })}
            placeholder="e.g. Head of HR Department"
            className="w-full bg-secondary border border-border focus:border-primary rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none transition"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-header-text uppercase tracking-wide mb-1.5">
            Issuing Organization
          </label>
          <input
            value={docSettings.hrOrganization || firstParty.companyName || "Creatibuz Studio"}
            onChange={(e) => set({ hrOrganization: e.target.value })}
            className="w-full bg-secondary border border-border focus:border-primary rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none transition"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-header-text uppercase tracking-wide mb-1.5">
            Notice Reference ID
          </label>
          <input
            value={docSettings.hrNoticeRefId || "CBS/HR-REF-26/001"}
            readOnly
            className="w-full bg-secondary border border-border rounded-xl py-3 px-4 text-sm text-primary font-mono font-bold"
          />
        </div>
      </div>

      <SignaturePad
        onSave={(dataUrl) => {
          onClearError();
          setFirstParty((p) => ({ ...p, signatureImg: dataUrl }));
        }}
        onClear={() => setFirstParty((p) => ({ ...p, signatureImg: "" }))}
        savedImage={firstParty.signatureImg}
      />

      <div className="flex items-center gap-4 my-2 text-muted-foreground text-xs font-bold uppercase tracking-wider">
        <div className="flex-1 h-[1px] bg-border" />
        <span>Or Upload Signature File</span>
        <div className="flex-1 h-[1px] bg-border" />
      </div>

      <div className="relative border-2 border-dashed border-border hover:border-primary/60 rounded-2xl p-6 bg-secondary/50 hover:bg-secondary transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer group">
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
        />
        <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition transform group-hover:scale-105" />
        <p className="text-xs text-foreground font-semibold uppercase tracking-wider">
          Click or drag &amp; drop signature image
        </p>
        <p className="text-[10px] text-muted-foreground">PNG, JPG, or SVG transparent signature.</p>
      </div>

      {firstParty.signatureImg && (
        <div className="p-4 bg-secondary border border-border rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-card border border-border rounded-xl shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={firstParty.signatureImg}
                alt="HR Signature Preview"
                className="w-16 h-8 object-contain"
              />
            </div>
            <div>
              <p className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5 stroke-[3]" /> HR Signature Active
              </p>
              <p className="text-[10px] text-muted-foreground">Synced to notice document</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFirstParty((p) => ({ ...p, signatureImg: "" }))}
            className="text-xs text-destructive hover:opacity-80 font-semibold px-2 py-1 cursor-pointer"
          >
            Remove
          </button>
        </div>
      )}
    </motion.div>
  );
}

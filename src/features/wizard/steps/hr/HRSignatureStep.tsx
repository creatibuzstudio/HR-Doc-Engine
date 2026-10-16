"use client";

import React from "react";
import { motion } from "motion/react";
import { Check, Upload } from "lucide-react";
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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <StepHeader
        title="Section 3: HR Representative Authorization"
        desc="Sign the hiring notice as the issuing HR authority. This signature will appear on the issued document."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wide mb-1.5">
            Prepared By (Name) *
          </label>
          <input
            value={docSettings.hrPreparedByName || firstParty.hrName || ""}
            onChange={(e) => set({ hrPreparedByName: e.target.value })}
            placeholder="e.g. Juwel Khan Shanto"
            className="w-full bg-[#F8FAFC] border border-[#DBEAFE] focus:border-[#7C3AED] rounded-xl py-3 px-4 text-sm text-[#0F172A] focus:outline-none transition"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wide mb-1.5">
            Designation *
          </label>
          <input
            value={docSettings.hrPreparedByDesignation || ""}
            onChange={(e) => set({ hrPreparedByDesignation: e.target.value })}
            placeholder="e.g. Head of HR Department"
            className="w-full bg-[#F8FAFC] border border-[#DBEAFE] focus:border-[#7C3AED] rounded-xl py-3 px-4 text-sm text-[#0F172A] focus:outline-none transition"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wide mb-1.5">
            Organization
          </label>
          <input
            value={docSettings.hrOrganization || firstParty.companyName || "Creatibuz Studio"}
            onChange={(e) => set({ hrOrganization: e.target.value })}
            className="w-full bg-[#F8FAFC] border border-[#DBEAFE] focus:border-[#7C3AED] rounded-xl py-3 px-4 text-sm text-[#0F172A] focus:outline-none transition"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wide mb-1.5">
            Notice Reference ID
          </label>
          <input
            value={docSettings.hrNoticeRefId || ""}
            readOnly
            className="w-full bg-[#F8FAFC] border border-[#DBEAFE] rounded-xl py-3 px-4 text-sm text-[#0F172A] font-mono opacity-70"
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

      <div className="flex items-center gap-4 my-2 text-[#64748B] text-xs font-bold uppercase tracking-wider">
        <div className="flex-1 h-[1px] bg-[#DBEAFE]" />
        <span>Or</span>
        <div className="flex-1 h-[1px] bg-[#DBEAFE]" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">
          Option B: Upload Signature Photo File
        </label>
        <div className="relative border-2 border-dashed border-[#DBEAFE] hover:border-[#7C3AED]/50 rounded-2xl p-6 bg-[#F8FAFC]/50 hover:bg-[#F8FAFC] transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer group">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
          />
          <Upload className="w-8 h-8 text-[#64748B] group-hover:text-[#7C3AED] transition transform group-hover:scale-105" />
          <p className="text-xs text-[#334155] font-semibold uppercase tracking-wider">
            Drag &amp; drop image file or select
          </p>
          <p className="text-[10px] text-[#64748B] leading-relaxed max-w-[280px]">
            Accepts PNG, JPG, or SVG — clear ink signature with high contrast background.
          </p>
        </div>

        {firstParty.signatureImg && (
          <div className="mt-4 p-4 bg-[#F8FAFC] border border-[#DBEAFE] rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white border border-[#DBEAFE] rounded-xl shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={firstParty.signatureImg}
                  alt="HR Signature Preview"
                  className="w-12 h-8 object-contain bg-white rounded-md"
                />
              </div>
              <div>
                <p className="text-xs text-[#7C3AED] font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> HR Signature Active
                </p>
                <p className="text-[10px] text-[#64748B]">Export-ready image base64 synced</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFirstParty((p) => ({ ...p, signatureImg: "" }))}
              className="text-xs text-rose-600 hover:text-rose-500 font-semibold px-2 py-1 cursor-pointer"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

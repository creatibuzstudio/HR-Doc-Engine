"use client";

import React from "react";
import { motion } from "motion/react";
import { Check, Upload } from "lucide-react";
import { FirstParty } from "@/types";
import SignaturePad from "@/features/candidate-portal/components/SignaturePad";
import { StepHeader } from "@/components/forms/FormPrimitives";

export interface ContractualStep3AuthProps {
  firstParty: FirstParty;
  setFirstParty: React.Dispatch<React.SetStateAction<FirstParty>>;
  onClearError: () => void;
}

export function ContractualStep3Auth({
  firstParty,
  setFirstParty,
  onClearError,
}: ContractualStep3AuthProps) {
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        title="Section 3: Founder & CEO Authorization"
        desc="Sign or verify your signature as the issuing authority (Md. Abdul Hakim, Founder & CEO)."
      />

      <div className="p-4 bg-[#FFF8F5] border border-[#FF5722]/30 rounded-2xl flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-[#0F172A] block">
            Authorizing Executive
          </span>
          <span className="text-sm font-extrabold text-[#EA580C]">
            {firstParty.representedBy || "Md. Abdul Hakim"} (Founder &amp; CEO)
          </span>
          <span className="text-[11px] text-[#64748B] block mt-0.5">
            Creatibuz Studio &middot; {firstParty.ceoMobile || "+8801968657353"}
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FF5722] text-white px-3 py-1 rounded-full">
          Issuer
        </span>
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
        <div className="flex-1 h-[1px] bg-[#E2E8F0]" />
        <span>Or Upload Signature File</span>
        <div className="flex-1 h-[1px] bg-[#E2E8F0]" />
      </div>

      <div className="relative border-2 border-dashed border-[#CBD5E1] hover:border-[#FF5722]/60 rounded-2xl p-6 bg-[#F8FAFC]/50 hover:bg-[#F8FAFC] transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer group">
        <input
          type="file"
          accept="image/*"
          onChange={handleSignatureUpload}
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
        />
        <Upload className="w-8 h-8 text-[#64748B] group-hover:text-[#FF5722] transition transform group-hover:scale-105" />
        <p className="text-xs text-[#334155] font-semibold uppercase tracking-wider">
          Click or drag &amp; drop signature image
        </p>
        <p className="text-[10px] text-[#64748B]">PNG, JPG, or SVG transparent signature.</p>
      </div>

      {firstParty.signatureImg && (
        <div className="p-4 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white border border-[#CBD5E1] rounded-xl shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={firstParty.signatureImg}
                alt="Founder Signature Preview"
                className="w-16 h-8 object-contain"
              />
            </div>
            <div>
              <p className="text-xs text-[#22C55E] font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5 stroke-[3]" /> Founder Signature Active
              </p>
              <p className="text-[10px] text-[#64748B]">
                Ready for single-click dispatch to contractor.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFirstParty((p) => ({ ...p, signatureImg: "" }))}
            className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 cursor-pointer"
          >
            Remove
          </button>
        </div>
      )}
    </motion.div>
  );
}

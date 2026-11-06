"use client";

import React from "react";
import { Check, Upload } from "lucide-react";
import { FirstParty } from "@/types";
import SignaturePad from "@/features/candidate-portal/components/SignaturePad";
import { StepHeader } from "@/components/forms/FormPrimitives";

export interface CertificateSignatureStepProps {
  firstParty: FirstParty;
  setFirstParty: React.Dispatch<React.SetStateAction<FirstParty>>;
  onClearError: () => void;
}

export function CertificateSignatureStep({
  firstParty,
  setFirstParty,
  onClearError,
}: CertificateSignatureStepProps) {
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
    <div className="space-y-6">
      <StepHeader
        title="Section 2: CEO & Founder Certificate Authorization"
        desc="Sign or verify your issuing authority signature (Md. Abdul Hakim, Founder & CEO). This signature will be placed precisely in the certificate signature block."
      />

      <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-foreground block">
            Authorizing Executive
          </span>
          <span className="text-sm font-extrabold text-primary">
            {firstParty.representedBy || "Md. Abdul Hakim"} (Founder &amp; CEO)
          </span>
          <span className="text-[11px] text-muted-foreground block mt-0.5">
            Creatibuz Studio &middot; {firstParty.ceoMobile || "+8801968657353"}
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground px-3 py-1 rounded-full">
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

      <div className="flex items-center gap-4 my-2 text-muted-foreground text-xs font-bold uppercase tracking-wider">
        <div className="flex-1 h-[1px] bg-border" />
        <span>Or Upload Signature File</span>
        <div className="flex-1 h-[1px] bg-border" />
      </div>

      <div className="relative border-2 border-dashed border-border hover:border-primary/60 rounded-2xl p-6 bg-secondary/40 hover:bg-secondary transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer group">
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
        <p className="text-[10px] text-muted-foreground">
          PNG, JPG, or SVG transparent signature.
        </p>
      </div>

      {firstParty.signatureImg && (
        <div className="p-4 bg-secondary border border-border rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-card border border-border rounded-xl shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={firstParty.signatureImg}
                alt="Signature Preview"
                className="w-16 h-8 object-contain"
              />
            </div>
            <div>
              <p className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5 stroke-[3]" /> Certificate Authority Signature Active
              </p>
              <p className="text-[10px] text-muted-foreground">
                Digital signature synced to certificate canvas
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFirstParty((p) => ({ ...p, signatureImg: "" }))}
            className="text-xs text-rose-500 hover:text-rose-400 font-semibold px-2 py-1 cursor-pointer"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}

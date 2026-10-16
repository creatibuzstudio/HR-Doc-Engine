"use client";

import React, { useState } from "react";
import { RefreshCw, Upload, Check } from "lucide-react";
import SignaturePad from "./SignaturePad";
import { FirstParty, SecondParty } from "@/types";

interface CandidateSidebarProps {
  firstParty: FirstParty;
  secondParty: SecondParty;
  setSecondParty: React.Dispatch<React.SetStateAction<SecondParty>>;
  isExporting: boolean;
  isCompleted: boolean;
  onExport: () => void;
  offerId: string;
  isPhotoUploaded?: boolean;
  isPendingCSP?: boolean;
  agreementTemplate?: string;
  onSwitchToIdCard?: () => void;
  onSignatureSaved?: (hasSignature: boolean) => void;
}

export default function CandidateSidebar({
  firstParty,
  secondParty,
  setSecondParty,
  isExporting,
  isCompleted,
  onExport,
  offerId,
  isPhotoUploaded = false,
  isPendingCSP = false,
  agreementTemplate,
  onSwitchToIdCard,
  onSignatureSaved,
}: CandidateSidebarProps) {
  const [sigError, setSigError] = useState("");

  const handleSaveSignature = (dataUrl: string) => {
    setSigError("");
    setSecondParty((p) => {
      const updated = { ...p, signatureImg: dataUrl };
      const stored = localStorage.getItem("jevxo_offer_" + offerId);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          parsed.secondParty = updated;
          localStorage.setItem(
            "jevxo_offer_" + offerId,
            JSON.stringify(parsed),
          );
        } catch (e) {
          console.error(e);
        }
      }

      fetch(`/api/offers/${offerId}/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signatureImg: dataUrl }),
      }).catch((err) => console.error("Failed to save signature:", err));

      return updated;
    });
    if (onSignatureSaved) onSignatureSaved(!!dataUrl);
  };

  const handleClearSignature = () => {
    setSecondParty((p) => {
      const updated = { ...p, signatureImg: "" };
      const stored = localStorage.getItem("jevxo_offer_" + offerId);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          parsed.secondParty = updated;
          localStorage.setItem(
            "jevxo_offer_" + offerId,
            JSON.stringify(parsed),
          );
        } catch (e) {
          console.error(e);
        }
      }

      fetch(`/api/offers/${offerId}/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signatureImg: "" }),
      }).catch((err) => console.error("Failed to clear signature:", err));

      return updated;
    });
    if (onSignatureSaved) onSignatureSaved(false);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        handleSaveSignature(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleActionClick = () => {
    if (isCompleted) return;
    if (!secondParty.signatureImg) {
      setSigError("Please draw and save your signature before exporting.");
      return;
    }
    const isContractual = agreementTemplate === "contractual";
    if (!isContractual && !isPendingCSP && !isPhotoUploaded) {
      setSigError(
        "Please upload your photo in the ID Card tab before signing.",
      );
      if (onSwitchToIdCard) onSwitchToIdCard();
      return;
    }
    setSigError("");
    onExport();
  };

  return (
    <div className="w-full xl:w-[420px] bg-card border-r border-border flex flex-col h-screen sticky top-0 overflow-hidden shrink-0">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {/* Header */}
        <div className="space-y-2">
          <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block">
            Offer Awaiting Acceptance
          </span>
          <h2 className="text-xl font-bold text-foreground">Candidate Portal</h2>
          <p className="text-muted-foreground text-xs">
            Review the terms, draw your signature, and generate your
            counter-signed partnership contract.
          </p>
        </div>

        {/* Info card */}
        <div className="p-4 bg-secondary border border-border rounded-2xl space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground font-semibold">Candidate:</span>
            <span className="font-bold text-foreground">
              {secondParty.fullName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground font-semibold">
              Position Offered:
            </span>
            <span className="font-bold text-primary">
              {secondParty.position}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground font-semibold">Company:</span>
            <span className="font-bold text-foreground">
              {firstParty.companyName}
            </span>
          </div>
        </div>

        {/* Signature Pad Section */}
        <div className="space-y-4">
          <div className="border-b border-border pb-1">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">
              Draw Your Signature *
            </h3>
            <p className="text-[10px] text-muted-foreground">
              Draw inside the pad below to accept the partnership terms.
            </p>
          </div>

          {sigError && (
            <div className="p-2.5 bg-rose-950/40 border border-rose-500/30 text-rose-300 text-[11px] font-semibold rounded-xl">
              {sigError}
            </div>
          )}

          <SignaturePad
            onSave={handleSaveSignature}
            onClear={handleClearSignature}
            savedImage={secondParty.signatureImg}
          />

          {/* Or divider */}
          <div className="flex items-center gap-4 my-2 text-muted-foreground text-xs font-bold uppercase tracking-wider">
            <div className="flex-1 h-[1px] bg-border" />
            <span>Or</span>
            <div className="flex-1 h-[1px] bg-border" />
          </div>

          {/* Upload option */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Option B: Upload Signature Photo File
            </label>
            <div className="relative border-2 border-dashed border-border hover:border-primary rounded-2xl p-6 bg-secondary/50 hover:bg-secondary transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition transform group-hover:scale-105" />
              <p className="text-xs text-foreground font-semibold uppercase tracking-wider">
                Drag & drop image file or select
              </p>
              <p className="text-[10px] text-muted-foreground leading-relaxed max-w-[280px]">
                Accepts PNG, JPG, or SVG formats containing clear black or blue
                ink signatures with high contrast backgrounds.
              </p>
            </div>

            {secondParty.signatureImg && (
              <div className="mt-4 p-4 bg-secondary border border-border rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-card border border-border rounded-xl shrink-0">
                    <img
                      src={secondParty.signatureImg}
                      alt="Signature Preview"
                      className="w-12 h-8 object-contain bg-white rounded-md"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-primary font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Signature Active
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Export-ready image base64 synced
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClearSignature}
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold px-2 py-1 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Action Footer */}
      <div className="p-6 bg-card border-t border-border space-y-3 shrink-0">
        <button
          onClick={handleActionClick}
          disabled={isExporting || isCompleted}
          className="w-full py-4 px-6 bg-primary hover:opacity-90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed font-bold text-primary-foreground text-sm rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-md shadow-primary/20 cursor-pointer"
        >
          {isCompleted ? (
            <>
              <Check className="w-5 h-5" /> Signed Successfully
            </>
          ) : isExporting ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" /> Generating Signed
              PDF...
            </>
          ) : (
            <>
              <Check className="w-5 h-5" /> Confirm & Sign
            </>
          )}
        </button>
        <div className="flex justify-between text-[11px] text-muted-foreground px-1 font-semibold">
          <span>Official A4 formatting</span>
          <span>Dual signatures included</span>
        </div>
      </div>
    </div>
  );
}

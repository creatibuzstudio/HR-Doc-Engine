"use client";

import React, { useState } from "react";
import { X, Send, Check } from "lucide-react";
import { FirstParty, SecondParty, DocSettings } from "@/types";
import { EmailBodyPreview } from "./EmailBodyPreview";

interface EmailPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSentSuccess: () => void;
  secondParty: SecondParty;
  firstParty: FirstParty;
  candidateLink: string;
  offerId: string;
  agreementTemplate?: string;
  docSettings?: DocSettings;
  hrNoticePdfBase64?: string;
}

export default function EmailPortalModal({
  isOpen,
  onClose,
  onSentSuccess,
  secondParty,
  firstParty,
  candidateLink,
  offerId,
  agreementTemplate,
  docSettings,
  hrNoticePdfBase64,
}: EmailPortalModalProps) {
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [apiError, setApiError] = useState("");
  const isInternship = agreementTemplate === "internship";
  const isHrHiring = agreementTemplate === "hrHiringNotice";
  const isCertificate = agreementTemplate === "internCertificate";

  const hrRecipientEmail = isHrHiring ? docSettings?.hrRecipientEmail || "" : "";
  const hrRecipientName = isHrHiring
    ? docSettings?.hrRecipientName || docSettings?.hrRecipientRole || "Recipient"
    : "";

  const displayEmail = isHrHiring
    ? hrRecipientEmail || "Recipient Email"
    : secondParty.email;

  const displayName = isHrHiring
    ? hrRecipientName || "Recipient"
    : secondParty.fullName;

  const fromAddress = "Creatibuz Studio <hr@creatibuzstudio.com>";

  const emailSubject = isHrHiring
    ? `HR Hiring Notice: ${docSettings?.hrPositionName || "Open Position"}`
    : isCertificate
    ? "Certificate of Internship Completion — Creatibuz Studio"
    : isInternship
    ? "Internship Offer Letter — Creatibuz Studio"
    : "Joining Offer Letter & Work Agreement — Creatibuz Studio";

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(candidateLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = async () => {
    setSending(true);
    setApiError("");
    try {
      const response = await fetch("/api/send-offer-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offerId,
          candidateEmail: isHrHiring || isCertificate ? displayEmail : secondParty.email,
          candidateName: isHrHiring || isCertificate ? displayName : secondParty.fullName,
          agreementTemplate,
          ...(isHrHiring || isCertificate ? (hrNoticePdfBase64 ? { hrNoticePdfBase64 } : {}) : {}),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSent(true);
        onSentSuccess();
        setTimeout(() => {
          setSent(false);
          onClose();
        }, 1500);
      } else {
        const errorMsg =
          data.details?.message ||
          data.error ||
          "Failed to send email. Please check your domain configuration.";
        setApiError(errorMsg);
      }
    } catch (err) {
      console.error(err);
      setApiError("Network error: Failed to connect to server endpoint.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-card border-b border-border flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <div
              className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                isHrHiring ? "bg-violet-500" : isCertificate ? "bg-indigo-500" : "bg-primary"
              }`}
            />
            <h3 className="font-extrabold text-sm text-foreground uppercase tracking-wider">
              {isHrHiring
                ? "HR Hiring Notice Dispatch"
                : isCertificate
                ? "Intern Certificate Dispatch"
                : isInternship
                ? "Internship Offer Portal"
                : "Joining Offer Dispatch Portal"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email header fields */}
        <div className="p-6 border-b border-border space-y-3 shrink-0 text-xs font-semibold text-muted-foreground bg-secondary/40">
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex items-center gap-3">
              <span className="w-14 text-right shrink-0">From:</span>
              <input
                type="text"
                value={fromAddress}
                readOnly
                className="bg-card border border-border px-3.5 py-1.5 rounded-lg text-foreground flex-1 font-bold outline-none"
              />
            </div>
            <p className="text-[10px] text-muted-foreground/80 font-normal pl-[68px] leading-relaxed">
              * Emails use the verified sender configuration from the server.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-14 text-right">To:</span>
            <span className="bg-card border border-border px-3 py-1.5 rounded-lg text-foreground flex-1 font-bold">
              {displayName} ({displayEmail})
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-14 text-right">Subject:</span>
            <span className="bg-card border border-border px-3 py-1.5 rounded-lg text-foreground flex-1 font-extrabold">
              {emailSubject}
            </span>
          </div>
          {(isHrHiring || isCertificate) && (
            <div className="flex items-center gap-3">
              <span className="w-14 text-right">Attach:</span>
              <span
                className={`px-3 py-1.5 rounded-lg flex-1 font-bold text-[11px] flex items-center gap-1.5 ${
                  hrNoticePdfBase64
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                    : "bg-amber-50 border border-amber-200 text-amber-700"
                }`}
              >
                {hrNoticePdfBase64 ? (
                  <>
                    <Check className="w-3 h-3" />{" "}
                    {isCertificate ? "Internship_Certificate.pdf" : "HR_Hiring_Notice.pdf"} — ready to attach
                  </>
                ) : isCertificate ? (
                  "⚠ PDF not ready — certificate may send without attachment"
                ) : (
                  "⚠ PDF not ready — notice may send without attachment"
                )}
              </span>
            </div>
          )}
        </div>

        {/* Email body preview */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-white/80 text-sm leading-relaxed font-sans">
          {apiError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-2xl">
              Resend Error: {apiError}
            </div>
          )}

          <EmailBodyPreview
            isHrHiring={isHrHiring}
            isCertificate={isCertificate}
            isInternship={isInternship}
            displayName={displayName}
            firstParty={firstParty}
            secondParty={secondParty}
            docSettings={docSettings}
            candidateLink={candidateLink}
            copied={copied}
            onCopy={handleCopy}
          />
        </div>

        {/* Footer actions */}
        <div className="p-6 bg-card border-t border-border flex justify-end items-center gap-3 shrink-0">
          <button
            onClick={onClose}
            disabled={sending || sent}
            className="h-11 px-5 border border-border hover:border-primary hover:bg-secondary rounded-xl text-white/50 hover:text-foreground text-xs font-bold transition cursor-pointer disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending || sent}
            className={`h-11 px-6 font-bold text-white text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-md cursor-pointer ${
              sent
                ? "bg-emerald-600"
                : isHrHiring
                ? "bg-violet-600 hover:bg-violet-700"
                : isCertificate
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-primary hover:opacity-90"
            }`}
          >
            {sending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Sending…</span>
              </>
            ) : sent ? (
              <>
                <Check className="w-4 h-4" />
                <span>
                  {isHrHiring
                    ? "Notice Sent!"
                    : isCertificate
                    ? "Certificate Sent!"
                    : "Sent Successfully!"}
                </span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>
                  {isHrHiring
                    ? "Send Notice"
                    : isCertificate
                    ? "Send Certificate"
                    : "Send Offer"}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

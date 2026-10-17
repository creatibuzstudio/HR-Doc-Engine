"use client";

import React, { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";

interface Props {
  agreementId: string | null;
  onClose: () => void;
}

function Row({ label, value }: { label: string; value?: string | number | boolean | null }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="grid grid-cols-5 gap-2 py-1.5 border-b border-border/40 last:border-0">
      <span className="col-span-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
      <span className="col-span-3 text-xs text-foreground font-medium break-all">
        {String(value)}
      </span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 pb-1 border-b border-border/60">
        {title}
      </h4>
      {children}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderSection(title: string, obj: Record<string, any> | undefined, skip: string[] = []) {
  if (!obj) return null;
  const entries = Object.entries(obj).filter(
    ([k, v]) =>
      !skip.includes(k) &&
      v !== undefined &&
      v !== null &&
      v !== "" &&
      typeof v !== "object",
  );
  if (!entries.length) return null;
  return (
    <Section title={title}>
      {entries.map(([k, v]) => (
        <Row key={k} label={k.replace(/([A-Z])/g, " $1").trim()} value={v} />
      ))}
    </Section>
  );
}

export default function DetailsModal({ agreementId, onClose }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!agreementId) return;
    setData(null);
    setError("");
    setLoading(true);
    fetch(`/api/offers/${encodeURIComponent(agreementId)}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load agreement details.");
        return r.json();
      })
      .then(setData)
      .catch((e: unknown) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, [agreementId]);

  if (!agreementId) return null;

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="font-bold text-foreground text-base">Agreement Details</h2>
            <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{agreementId}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 text-sm">
          {loading && (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-[#2563EB]" />
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
              {error}
            </div>
          )}

          {data && !loading && (
            <>
              <Section title="Document Details">
                <Row label="Contract Reference ID" value={data.contractRef || data.agreementId} />
                <Row label="Employee ID" value={data.candidateDetails?.employeeId || data.partnerId} />
                <Row label="Document Type" value={data.docType} />
                <Row label="Status" value={data.status} />
                <Row label="Founder Signed" value={data.isFounderSigned ?? data.founderSigned ? "Yes" : "No"} />
                <Row label="Candidate Signed" value={data.isCandidateSigned ?? data.partnerSigned ? "Yes" : "No"} />
                <Row
                  label="Signed At"
                  value={
                    data.candidateDetails?.signatureDate || data.signedAt
                      ? new Date(data.candidateDetails?.signatureDate || data.signedAt).toLocaleString()
                      : null
                  }
                />
                <Row label="Created At" value={data.createdAt ? new Date(data.createdAt).toLocaleString() : null} />
                <Row label="Final PDF Sent" value={data.isFinalletterSentToBoth ?? data.letterSentToBoth ? "Yes" : "No"} />
                <Row label="Stored PDF" value={data.letterPDFdata ? "Saved in MongoDB Atlas" : "Pending Signature"} />
              </Section>

              {data.candidateDetails &&
                renderSection("Candidate Details", data.candidateDetails, ["signatureImg", "photoUrl"])}
              {data.companyDetails &&
                renderSection("Company Details", data.companyDetails, ["signatureImg", "photoUrl"])}
              {data.firstParty && renderSection("First Party (Company)", data.firstParty, ["signatureImg", "photoUrl"])}
              {data.secondParty && renderSection("Second Party (Candidate / Recipient)", data.secondParty, ["signatureImg", "photoUrl"])}
              {data.docSettings && renderSection("Document Settings", data.docSettings)}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

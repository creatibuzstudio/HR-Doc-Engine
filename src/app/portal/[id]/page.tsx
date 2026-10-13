"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import JevxoLogo from "@/shared/layout/JevxoLogo";
import DigitalSignaturePad from "@/features/wizards/components/DigitalSignaturePad";
import {
  CheckCircle,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Send,
} from "lucide-react";
import { toast } from "react-toastify";

interface PortalDocData {
  status?: string;
  secondParty?: { fullName?: string; position?: string };
  recipient?: { name?: string };
  employmentTerms?: { designation?: string };
  title?: string;
  firstParty?: { companyName?: string };
}

export default function CandidatePortalPage() {
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [doc, setDoc] = useState<PortalDocData | null>(null);
  const [signatureData, setSignatureData] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [signedSuccess, setSignedSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function loadDocument() {
      try {
        const res = await fetch(`/api/documents/${encodeURIComponent(id)}`);
        const json = await res.json();
        if (json.success) {
          setDoc(json.data);
          if (
            json.data.status === "FULLY_EXECUTED" ||
            json.data.status === "ACCEPTED_AND_SIGNED"
          ) {
            setSignedSuccess(true);
          }
        }
      } catch (err) {
        console.error("Failed to load document", err);
      } finally {
        setLoading(false);
      }
    }
    loadDocument();
  }, [id]);

  const handleSign = async () => {
    if (!signatureData) {
      toast.error("Please provide your digital signature.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/documents/${encodeURIComponent(id)}/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signatureImg: signatureData }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to sign document.");
      }
      setSignedSuccess(true);
      toast.success("Document Signed & Executed Successfully!");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-background text-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs font-semibold uppercase tracking-wider">Loading Agreement…</p>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground">
        <div className="p-8 rounded-2xl border border-border bg-card max-w-md text-center">
          <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
          <h2 className="text-lg font-bold mb-1">Document Not Found</h2>
          <p className="text-xs text-muted-foreground">Reference ID: {id} does not exist or has expired.</p>
        </div>
      </div>
    );
  }

  const recipientName = doc.secondParty?.fullName || doc.recipient?.name || "Recipient";
  const position = doc.secondParty?.position || doc.employmentTerms?.designation || doc.title;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b border-border/40 bg-card/60 backdrop-blur-md px-6 py-3 flex justify-between items-center">
        <JevxoLogo />
        <span className="text-xs font-bold text-primary flex items-center gap-1.5 border border-primary/20 bg-primary/10 px-3 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" /> Secure Signing Portal
        </span>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border mb-4">
            <div>
              <span className="text-[10px] font-mono text-primary uppercase font-bold tracking-wider">
                ID: {id}
              </span>
              <h1 className="text-xl font-bold tracking-tight mt-0.5">{position}</h1>
            </div>
            <span className="text-xs px-3 py-1 rounded-full border border-border bg-secondary font-semibold">
              {signedSuccess ? "Fully Executed" : "Awaiting Signature"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-6">
            <div>
              <p className="text-muted-foreground">Issuing Organization:</p>
              <p className="font-semibold text-foreground">JEVXO (Silicon Tower, Rajshahi)</p>
            </div>
            <div>
              <p className="text-muted-foreground">Candidate / Contractor:</p>
              <p className="font-semibold text-foreground">{recipientName}</p>
            </div>
          </div>

          {signedSuccess ? (
            <div className="p-6 rounded-xl border border-primary/30 bg-primary/10 text-center space-y-2">
              <CheckCircle className="w-10 h-10 text-primary mx-auto" />
              <h3 className="text-base font-bold text-foreground">Agreement Fully Executed</h3>
              <p className="text-xs text-muted-foreground">
                Thank you! Your digital signature has been recorded and authenticated.
              </p>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-color-header">
                Provide Digital Signature:
              </h3>
              <DigitalSignaturePad
                onSignatureChange={(sig) => setSignatureData(sig)}
                onClear={() => setSignatureData("")}
              />
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSign}
                  disabled={submitting || !signatureData}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition flex items-center gap-2 disabled:opacity-40 cursor-pointer"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Confirm &amp; Sign Agreement
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Calendar,
  Building2,
  User,
  BadgeCheck,
} from "lucide-react";
import JevxoLogo from "@/shared/layout/JevxoLogo";

interface VerifyResult {
  valid: boolean;
  status: string;
  id?: string;
  docType?: string;
  companyName?: string;
  recipientName?: string;
  position?: string;
  signedAt?: string | null;
  createdAt?: string | null;
  message?: string;
}

export default function VerifyPage() {
  const params = useParams();
  const id = params?.id as string;
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/verify/${encodeURIComponent(id)}`)
      .then(async (res) => {
        const data = await res.json();
        setResult(data);
      })
      .catch(() => setResult({ valid: false, status: "ERROR" }))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-background text-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs uppercase font-semibold tracking-wider">Verifying Document…</p>
      </div>
    );
  }

  const isValid = result?.valid;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground">
      <div className="w-full max-w-md p-6 rounded-2xl border border-border bg-card shadow-xl space-y-6">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="mb-4">
            <JevxoLogo />
          </Link>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 ${
            isValid ? "bg-primary/10 text-primary border border-primary/30" : "bg-destructive/10 text-destructive border border-destructive/30"
          }`}>
            {isValid ? <ShieldCheck className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
          </div>
          <h1 className="text-lg font-bold">{isValid ? "Authentic JEVXO Document" : "Verification Failed"}</h1>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">{result?.message}</p>
        </div>

        {result && (
          <div className="p-4 rounded-xl border border-border/80 bg-secondary/40 space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-border/60">
              <span className="text-muted-foreground">Document ID</span>
              <span className="font-mono font-bold text-foreground">{result.id || id}</span>
            </div>
            {result.recipientName && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Recipient</span>
                <span className="font-semibold">{result.recipientName}</span>
              </div>
            )}
            {result.position && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5"><BadgeCheck className="w-3.5 h-3.5" /> Position</span>
                <span className="font-semibold">{result.position}</span>
              </div>
            )}
            {result.companyName && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Entity</span>
                <span className="font-semibold">{result.companyName}</span>
              </div>
            )}
            {result.signedAt && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Executed At</span>
                <span className="font-semibold">{new Date(result.signedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        )}

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-primary hover:underline font-semibold">
            Return to JEVXO Portal
          </Link>
        </div>
      </div>
    </div>
  );
}

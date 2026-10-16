"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { AgreementSummary } from "@/types";
import { StatusBadge, DocTypeBadge } from "./RegistryBadges";
import { RegistryRowActions } from "./RegistryRowActions";

export interface RegistryTableProps {
  loading: boolean;
  agreements: AgreementSummary[];
  resendingId: string | null;
  deletingId: string | null;
  onResend: (id: string) => void;
  onDetails: (id: string) => void;
  onPreview: (id: string) => void;
  onDelete: (id: string) => void;
}

export function RegistryTable({
  loading,
  agreements,
  resendingId,
  deletingId,
  onResend,
  onDetails,
  onPreview,
  onDelete,
}: RegistryTableProps) {
  if (loading) {
    return (
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm p-12 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (agreements.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm p-12 text-center text-sm text-muted-foreground">
        No agreements match your filters.
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/70 text-center">
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Agreement
              </th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Partner
              </th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Created
              </th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {agreements.map((a) => (
              <tr
                key={a.agreementId}
                className="border-b border-border/50 hover:bg-secondary/40 text-center transition-colors"
              >
                <td className="px-4 py-3 text-left">
                  <div className="font-mono font-bold text-foreground text-xs">
                    {a.agreementId}
                  </div>
                  <div className="mt-0.5">
                    <DocTypeBadge
                      docType={a.docType}
                      agreementTemplate={a.agreementTemplate}
                    />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-foreground">
                    {a.hrRecipientName || a.partnerName}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {a.hrRecipientEmail || a.partnerEmail}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge
                    status={a.status}
                    agreementTemplate={a.agreementTemplate}
                    docType={a.docType}
                  />
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {a.createdAt
                    ? new Date(a.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—"}
                </td>
                <td className="px-4 py-3 flex justify-end">
                  <RegistryRowActions
                    agreement={a}
                    resendingId={resendingId}
                    deletingId={deletingId}
                    onResend={onResend}
                    onDetails={onDetails}
                    onPreview={onPreview}
                    onDelete={onDelete}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

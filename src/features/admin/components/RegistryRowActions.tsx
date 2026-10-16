"use client";

import React from "react";
import { Send, ShieldCheck, ExternalLink, Loader2, Eye, FileSearch, Trash2 } from "lucide-react";
import { AgreementSummary } from "@/types";
import { buildVerifyUrl } from "@/lib/verifyUrl";

export interface RegistryRowActionsProps {
  agreement: AgreementSummary;
  resendingId: string | null;
  deletingId: string | null;
  onResend: (id: string) => void;
  onDetails: (id: string) => void;
  onPreview: (id: string) => void;
  onDelete: (id: string) => void;
}

export function RegistryRowActions({
  agreement: a,
  resendingId,
  deletingId,
  onResend,
  onDetails,
  onPreview,
  onDelete,
}: RegistryRowActionsProps) {
  return (
    <div className="flex items-center justify-start gap-3 flex-wrap">
      {a.status !== "FULLY_EXECUTED" && (
        <button
          onClick={() => onResend(a.agreementId)}
          disabled={resendingId === a.agreementId}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#DBEAFE] rounded-lg text-[10px] font-bold text-[#2563EB] cursor-pointer disabled:opacity-50"
        >
          {resendingId === a.agreementId ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Send className="w-3 h-3" />
          )}
          Resend
        </button>
      )}
      <button
        onClick={() => onDetails(a.agreementId)}
        className="flex items-center gap-1 px-2.5 py-1.5 bg-[#F8FAFC] hover:bg-[#EFF6FF] border border-[#DBEAFE] rounded-lg text-[10px] font-bold text-[#64748B] hover:text-[#2563EB] cursor-pointer"
      >
        <Eye className="w-3 h-3" />
        Details
      </button>
      <button
        onClick={() => onPreview(a.agreementId)}
        className="flex items-center gap-1 px-2.5 py-1.5 bg-[#F8FAFC] hover:bg-[#EFF6FF] border border-[#DBEAFE] rounded-lg text-[10px] font-bold text-[#64748B] hover:text-[#2563EB] cursor-pointer"
      >
        <FileSearch className="w-3 h-3" />
        Preview
      </button>
      <a
        href={buildVerifyUrl(a.agreementId)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 px-2.5 py-1.5 bg-[#F8FAFC] hover:bg-[#EFF6FF] border border-[#DBEAFE] rounded-lg text-[10px] font-bold text-[#64748B] hover:text-[#2563EB]"
      >
        <ShieldCheck className="w-3 h-3" />
        Verify
        <ExternalLink className="w-2.5 h-2.5" />
      </a>
      <button
        onClick={() => onDelete(a.agreementId)}
        disabled={deletingId === a.agreementId}
        className="flex items-center gap-1 px-2.5 py-1.5 bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FEE2E2] rounded-lg text-[10px] font-bold text-[#EF4444] cursor-pointer disabled:opacity-50"
      >
        {deletingId === a.agreementId ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <Trash2 className="w-3 h-3" />
        )}
        Delete
      </button>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { RefreshCw } from "lucide-react";
import Swal from "sweetalert2";
import { useRegistryData } from "../hooks/useRegistryData";
import RegistryToolbar from "./RegistryToolbar";
import RegistryPagination from "./RegistryPagination";
import DetailsModal from "./DetailsModal";
import PreviewModal from "./PreviewModal";
import { RegistryTable } from "./RegistryTable";

interface AdminDashboardProps {
  onBack?: () => void;
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const {
    loading,
    error,
    filters,
    patchFilter,
    processed,
    stats,
    reload,
    removeAgreement,
    PAGE_SIZE,
  } = useRegistryData();

  const [resendingId, setResendingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const handleResend = async (agreementId: string) => {
    setResendingId(agreementId);
    try {
      const res = await fetch(`/api/offers/${agreementId}/resend`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Resend failed.");

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Signing link resent successfully.",
        confirmButtonColor: "#2563EB",
      });
    } catch (e: unknown) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: (e as Error).message,
        confirmButtonColor: "#2563EB",
      });
    } finally {
      setResendingId(null);
    }
  };

  const handleDelete = async (agreementId: string) => {
    const { value: pin } = await Swal.fire({
      title: "Enter security PIN to delete",
      input: "password",
      inputPlaceholder: "Enter security PIN",
      inputAttributes: {
        autocapitalize: "off",
        autocorrect: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#64748B",
    });

    if (pin === undefined || pin === null) return;
    if (!pin.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "PIN Required",
        text: "A valid PIN is required to perform deletion.",
        confirmButtonColor: "#2563EB",
      });
      return;
    }

    setDeletingId(agreementId);
    try {
      const res = await fetch(`/api/offers/${agreementId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed.");

      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Document deleted successfully.",
        confirmButtonColor: "#2563EB",
      });
      // Instantly remove from UI, then sync cache in background
      removeAgreement(agreementId);
      void reload();
    } catch (e: unknown) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: (e as Error).message,
        confirmButtonColor: "#2563EB",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <motion.section
        key="adminDashboard"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="flex-1 px-4 md:px-6 py-8 max-w-7xl mx-auto w-full"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            {onBack && (
              <button
                onClick={onBack}
                className="text-xs font-semibold text-muted-foreground hover:text-primary flex items-center gap-1.5 mb-3 cursor-pointer"
              >
                ← Back to Doc Select
              </button>
            )}
            <h1 className="text-2xl font-bold text-foreground">
              Agreement Registry
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              View all generated documents, track status, and resend signing links.
            </p>
          </div>
          <button
            onClick={reload}
            disabled={loading}
            className="group self-start flex items-center gap-2 px-4 py-2.5 bg-card border border-border hover:border-primary rounded-xl text-xs font-bold text-primary cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 transition-transform duration-500 ${
                loading ? "animate-spin" : "group-hover:rotate-180"
              }`}
            />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Agreements", value: stats.total, color: "var(--primary)" },
            { label: "Pending Signature", value: stats.pending, color: "#D97706" },
            { label: "Fully Executed", value: stats.executed, color: "#059669" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="bg-card border border-border rounded-2xl p-4 text-center"
            >
              <div className="text-2xl font-black" style={{ color }}>
                {value}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-1">
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <RegistryToolbar filters={filters} onChange={patchFilter} />

        {error && (
          <div className="mb-4 p-4 bg-rose-950/40 border border-rose-500/30 rounded-xl text-sm text-rose-300">
            {error}
          </div>
        )}

        {/* Table */}
        <RegistryTable
          loading={loading}
          agreements={processed.list}
          resendingId={resendingId}
          deletingId={deletingId}
          onResend={handleResend}
          onDetails={setDetailsId}
          onPreview={setPreviewId}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        {!loading && processed.total > 0 && (
          <RegistryPagination
            page={processed.safePage}
            totalPages={processed.totalPages}
            total={processed.total}
            pageSize={PAGE_SIZE}
            onPage={(p) => patchFilter({ page: p })}
          />
        )}
      </motion.section>

      {/* Modals — rendered outside the scrollable section */}
      <DetailsModal
        agreementId={detailsId}
        onClose={() => setDetailsId(null)}
      />
      <PreviewModal
        agreementId={previewId}
        onClose={() => setPreviewId(null)}
      />
    </>
  );
}

"use client";

import React from "react";
import { Mail, RefreshCw, CreditCard, FileText, LayoutDashboard, LogOut } from "lucide-react";
import Logo from "./Logo";
import { AppState, AgreementTemplate } from "@/types";

interface AppHeaderProps {
  isLoadingOffer: boolean;
  isExporting: boolean;
  appState: AppState;
  setAppState: (state: AppState) => void;
  agreementTemplate: AgreementTemplate;
  docType: string;
  getBackLabel: () => string | null;
  handleHeaderBack: () => void;
  setActiveStep: (step: number) => void;
}

export default function AppHeader({
  isLoadingOffer,
  isExporting,
  appState,
  setAppState,
  agreementTemplate,
  docType,
  getBackLabel,
  handleHeaderBack,
  setActiveStep,
}: AppHeaderProps) {
  return (
    <>
      {/* ── Full-page loading overlay — shown while fetching the candidate offer ── */}
      {isLoadingOffer && (
        <div className="fixed inset-0 z-[9999] bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
          <svg
            className="w-10 h-10 text-primary animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Loading your offer…
          </p>
        </div>
      )}

      {/* ── Finalize loading overlay — shown while generating + emailing PDFs ── */}
      {isExporting && appState === "candidatePortal" && agreementTemplate !== "hrHiringNotice" && (
        <div className="fixed inset-0 z-[9999] bg-[#0C0E12]/85 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
          <svg
            className="w-12 h-12 text-primary animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <p className="text-sm font-bold text-foreground uppercase tracking-wider">
            Finalizing your documents…
          </p>
          <p className="text-xs text-muted-foreground">
            Generating PDFs and sending to email. Please wait.
          </p>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-border bg-[var(--color-nav)]/90 backdrop-blur-md sticky top-0 z-40 px-6 py-2.5 flex justify-between items-center">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => {
            if (appState !== "candidatePortal") setAppState("home");
          }}
        >
          <Logo />
          <div className="hidden sm:block h-6 w-[1px] bg-border" />
          <p className="hidden sm:block text-xs text-muted-foreground font-semibold uppercase tracking-wider">
            Document Engine
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Back button for navigable states */}
          {getBackLabel() && (
            <button
              onClick={handleHeaderBack}
              className="text-xs font-semibold px-4 py-2 border border-border hover:border-primary hover:bg-secondary text-foreground rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              {getBackLabel()}
            </button>
          )}

          {/* Doc type badge when in workspace */}
          {appState === "workspace" && (
            <span className="hidden md:flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-secondary text-primary border border-border">
              <FileText className="w-3 h-3" />
              <span>{docType || "Document Engine"}</span>
            </span>
          )}

          {appState === "workspace" && (
            <button
              onClick={() => {
                setAppState("form");
                setActiveStep(1);
              }}
              className="text-xs font-semibold px-4 py-2 border border-border hover:border-primary hover:bg-secondary text-foreground rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Start Over
            </button>
          )}
          <a
            href="mailto:info@creatibuzstudio.com"
            className="hidden md:flex text-xs text-muted-foreground hover:text-primary font-medium items-center gap-1.5 px-3 py-1.5 transition"
          >
            <Mail className="w-3.5 h-3.5" /> Support
          </a>

          {/* Agreement Registry — visible in docTypeSelect, form, workspace, adminDashboard */}
          {appState !== "candidatePortal" && appState !== "home" && appState !== "login" && (
            <button
              onClick={() => setAppState("adminDashboard")}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border transition cursor-pointer ${
                appState === "adminDashboard"
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "border-border text-foreground bg-secondary hover:bg-accent"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Registry</span>
            </button>
          )}

          {/* Logout button */}
          {appState !== "candidatePortal" && appState !== "home" && appState !== "login" && (
            <button
              onClick={() => {
                fetch("/api/auth/logout", { method: "POST" }).finally(() => {
                  setAppState("home");
                });
              }}
              title="Logout session"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-destructive/30 text-destructive bg-destructive/10 hover:bg-destructive/20 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </header>
    </>
  );
}

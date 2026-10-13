"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import WizardStepHeader from "@/features/wizards/components/WizardStepHeader";
import Step1Recipient from "@/features/wizards/hiring/Step1Recipient";
import Step2JobDetails from "@/features/wizards/hiring/Step2JobDetails";
import Step3Approver from "@/features/wizards/hiring/Step3Approver";
import { HiringNoticePayload } from "@/types";
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const STEPS = ["1. Recipient & Title", "2. Job Requisition", "3. Approver"];

const initialHiringData: HiringNoticePayload = {
  noticeId: "JVX-HR-26-001",
  refId: "JVX-HR-REF-26-001",
  title: "",
  department: "Engineering",
  vacancies: 1,
  employmentType: "Full-Time",
  workMode: "Remote",
  location: "Rajshahi, Bangladesh",
  skills: ["TypeScript", "Next.js"],
  experienceRequired: "2+ years",
  startDate: "2026-10-15",
  endDate: "2026-11-15",
  preparedBy: {
    name: "Juwel Khan Shanto",
    designation: "Head of HR Department",
  },
  recipient: {
    role: "CEO",
    name: "Imtiaz Ahmed Tuhin",
    email: "ceo@jevxo.com",
  },
};

export default function NewHiringNoticePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchingIds, setFetchingIds] = useState(true);
  const [formData, setFormData] = useState<HiringNoticePayload>(initialHiringData);

  useEffect(() => {
    async function loadIds() {
      try {
        const res = await fetch("/api/documents/hiring");
        const data = await res.json();
        if (data.success) {
          setFormData((p) => ({
            ...p,
            noticeId: data.noticeId,
            refId: data.refId,
          }));
        }
      } catch (err) {
        console.error("Failed to load hiring IDs", err);
      } finally {
        setFetchingIds(false);
      }
    }
    loadIds();
  }, []);

  const handleUpdate = (updates: Partial<HiringNoticePayload>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleSubmit = async () => {
    if (!formData.title) {
      toast.error("Please provide a notice title.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/documents/hiring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create hiring notice.");
      }

      toast.success("HR Hiring Requisition Created Successfully!");
      router.push("/dashboard/registry");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            Create HR Hiring Requisition Notice
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Step {step} of 3 • {STEPS[step - 1]}
          </p>
        </div>
        <Link
          href="/dashboard"
          className="text-xs text-muted-foreground hover:text-foreground transition"
        >
          Cancel
        </Link>
      </div>

      <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-sm">
        <WizardStepHeader steps={STEPS} currentStep={step} />

        {fetchingIds ? (
          <div className="py-12 flex justify-center text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        ) : (
          <div className="min-h-[280px]">
            {step === 1 && (
              <Step1Recipient data={formData} onChange={handleUpdate} />
            )}
            {step === 2 && (
              <Step2JobDetails data={formData} onChange={handleUpdate} />
            )}
            {step === 3 && (
              <Step3Approver data={formData} onChange={handleUpdate} />
            )}
          </div>
        )}

        <div className="flex justify-between items-center mt-8 pt-4 border-t border-border">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-secondary disabled:opacity-30 transition flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" /> Finalize &amp; Save
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

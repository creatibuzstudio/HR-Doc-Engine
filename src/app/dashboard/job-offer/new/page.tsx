"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import WizardStepHeader from "@/features/wizards/components/WizardStepHeader";
import Step1Candidate from "@/features/wizards/job-offer/Step1Candidate";
import Step2OfferTerms from "@/features/wizards/job-offer/Step2OfferTerms";
import Step3Company from "@/features/wizards/job-offer/Step3Company";
import { JobOfferPayload } from "@/types";
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const STEPS = ["1. Candidate Information", "2. Employment & Salary Terms", "3. Company Terms"];

const initialJobOfferData: JobOfferPayload = {
  offerId: "JVX-OFF-26-001",
  employeeId: "JVX-EMP-26-001",
  firstParty: {
    companyName: "JEVXO",
    representedBy: "Md. Shahid Hasan",
    role: "Founder & CEO",
    email: "info@jevxo.com",
    mobileNumber: "01405749386",
    currentAddress: "9th Floor, Silicon Tower, Hi-Tech Park, Rajshahi, Bangladesh",
  },
  secondParty: {
    fullName: "",
    position: "",
    email: "",
    mobileNumber: "",
    nidNumber: "",
    presentAddress: "",
    permanentAddress: "",
  },
  employmentTerms: {
    designation: "Software Engineer",
    department: "Engineering",
    joiningDate: "2026-11-01",
    grossSalaryMonthly: 70000,
    currency: "BDT",
    probationPeriodMonths: 3,
    noticePeriodDays: 30,
    workMode: "Onsite",
  },
};

export default function NewJobOfferPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchingIds, setFetchingIds] = useState(true);
  const [formData, setFormData] = useState<JobOfferPayload>(initialJobOfferData);

  useEffect(() => {
    async function loadIds() {
      try {
        const res = await fetch("/api/documents/job-offer");
        const data = await res.json();
        if (data.success) {
          setFormData((p) => ({
            ...p,
            offerId: data.offerId,
            employeeId: data.employeeId,
          }));
        }
      } catch (err) {
        console.error("Failed to load offer IDs", err);
      } finally {
        setFetchingIds(false);
      }
    }
    loadIds();
  }, []);

  const handleUpdate = (updates: Partial<JobOfferPayload>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleSubmit = async () => {
    if (!formData.secondParty.fullName || !formData.secondParty.email) {
      toast.error("Candidate name and email are required.");
      return;
    }
    if (!formData.employmentTerms.designation) {
      toast.error("Designation is required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/documents/job-offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create job offer.");
      }

      toast.success("Permanent Job Offer Letter Created!");
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
            New Job Offer Letter (Permanent)
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
              <Step1Candidate data={formData} onChange={handleUpdate} />
            )}
            {step === 2 && (
              <Step2OfferTerms data={formData} onChange={handleUpdate} />
            )}
            {step === 3 && (
              <Step3Company data={formData} onChange={handleUpdate} />
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
                  <Check className="w-4 h-4" /> Generate Offer Letter
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

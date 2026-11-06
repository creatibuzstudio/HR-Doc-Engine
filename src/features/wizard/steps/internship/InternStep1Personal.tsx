"use client";

import React from "react";
import { motion } from "motion/react";
import { User, Briefcase, ShieldCheck, Phone, Mail, GraduationCap, MapPin } from "lucide-react";
import { SecondParty } from "@/types";
import { Field, IconInput, StepHeader } from "@/components/forms/FormPrimitives";

export interface InternStep1Props {
  secondParty: SecondParty;
  setSecondParty: React.Dispatch<React.SetStateAction<SecondParty>>;
  onClearError?: () => void;
}

export function InternStep1({ secondParty, setSecondParty, onClearError }: InternStep1Props) {
  const handleChange = <K extends keyof SecondParty>(key: K, value: SecondParty[K]) => {
    onClearError?.();
    setSecondParty((p) => ({ ...p, [key]: value }));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <StepHeader
        title="Section 1: Intern Candidate Information"
        desc="Enter the intern's academic and personal credentials for the agreement."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Intern Full Name *">
          <IconInput
            icon={User}
            type="text"
            placeholder="e.g. Mohammad Abdul Mazed"
            value={secondParty.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
          />
        </Field>

        <Field label="Internship Role / Track *">
          <IconInput
            icon={Briefcase}
            type="text"
            placeholder="e.g. Frontend Developer Intern"
            value={secondParty.position}
            onChange={(e) => handleChange("position", e.target.value)}
          />
        </Field>

        <Field label="Email Address * (For Portal & Signatures)">
          <IconInput
            icon={Mail}
            type="email"
            placeholder="e.g. candidate@example.com"
            value={secondParty.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </Field>

        <Field label="Phone / WhatsApp Number *">
          <IconInput
            icon={Phone}
            type="text"
            placeholder="e.g. +880 1581-782193"
            value={secondParty.mobileNumber}
            onChange={(e) => handleChange("mobileNumber", e.target.value)}
          />
        </Field>

        <Field label="University / Academic Institution">
          <IconInput
            icon={GraduationCap}
            type="text"
            placeholder="e.g. American International University-Bangladesh"
            value={secondParty.university || ""}
            onChange={(e) => handleChange("university", e.target.value)}
          />
        </Field>

        <Field label="National ID / Student ID">
          <IconInput
            icon={ShieldCheck}
            type="text"
            placeholder="e.g. 5501234567 or Student ID"
            value={secondParty.nidNumber}
            onChange={(e) => handleChange("nidNumber", e.target.value)}
          />
        </Field>

        <div className="md:col-span-2">
          <Field label="Present Living Address / City">
            <IconInput
              icon={MapPin}
              type="text"
              placeholder="e.g. Mirpur, Dhaka, Bangladesh"
              value={secondParty.presentAddress}
              onChange={(e) => handleChange("presentAddress", e.target.value)}
            />
          </Field>
        </div>
      </div>
    </motion.div>
  );
}

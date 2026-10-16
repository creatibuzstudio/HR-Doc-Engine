"use client";

import React from "react";
import { motion } from "motion/react";
import { User, Briefcase, Mail, Phone, ShieldCheck, MapPin } from "lucide-react";
import { SecondParty, DocSettings } from "@/types";
import { Field, IconInput, StepHeader } from "@/components/forms/FormPrimitives";

export interface ContractualStep1CandidateProps {
  secondParty: SecondParty;
  setSecondParty: React.Dispatch<React.SetStateAction<SecondParty>>;
  setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>;
  onClearError: () => void;
}

export function ContractualStep1Candidate({
  secondParty,
  setSecondParty,
  setDocSettings,
  onClearError,
}: ContractualStep1CandidateProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      <StepHeader
        title="Section 1: Contractor / Candidate Information"
        desc="Enter the contractor or employee details for the work agreement."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Candidate / Contractor Full Name *">
          <IconInput
            icon={User}
            type="text"
            placeholder="e.g. Ashikur Rahman Ovi"
            value={secondParty.fullName}
            onChange={(e) => {
              onClearError();
              setSecondParty((p) => ({ ...p, fullName: e.target.value }));
            }}
          />
        </Field>

        <Field label="Position / Role *">
          <IconInput
            icon={Briefcase}
            type="text"
            placeholder="e.g. Full Stack Developer"
            value={secondParty.position}
            onChange={(e) => {
              onClearError();
              const newPos = e.target.value;
              setSecondParty((p) => ({ ...p, position: newPos }));
              setDocSettings((prev) => ({
                ...prev,
                contractSubject: `Subject: ${newPos} For A ${
                  prev.employmentType || "Project-Based Contract"
                }`,
              }));
            }}
          />
        </Field>

        <Field label="Email Address *">
          <IconInput
            icon={Mail}
            type="email"
            placeholder="e.g. candidate@example.com"
            value={secondParty.email}
            onChange={(e) => {
              onClearError();
              setSecondParty((p) => ({ ...p, email: e.target.value }));
            }}
          />
        </Field>

        <Field label="Phone / Mobile Number *">
          <IconInput
            icon={Phone}
            type="text"
            placeholder="e.g. +880 1581-782193"
            value={secondParty.mobileNumber}
            onChange={(e) => {
              onClearError();
              setSecondParty((p) => ({ ...p, mobileNumber: e.target.value }));
            }}
          />
        </Field>

        <Field label="National ID / Passport Number">
          <IconInput
            icon={ShieldCheck}
            type="text"
            placeholder="e.g. 5501234567"
            value={secondParty.nidNumber}
            onChange={(e) => setSecondParty((p) => ({ ...p, nidNumber: e.target.value }))}
          />
        </Field>

        <Field label="Current Address">
          <IconInput
            icon={MapPin}
            type="text"
            placeholder="e.g. Dhaka, Bangladesh"
            value={secondParty.presentAddress}
            onChange={(e) =>
              setSecondParty((p) => ({ ...p, presentAddress: e.target.value }))
            }
          />
        </Field>
      </div>
    </motion.div>
  );
}

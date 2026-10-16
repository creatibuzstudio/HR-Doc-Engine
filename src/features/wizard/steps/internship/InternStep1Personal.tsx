"use client";

import React from "react";
import { motion } from "motion/react";
import { User, Briefcase, ShieldCheck, Phone, Mail } from "lucide-react";
import { SecondParty } from "@/types";
import { Field, IconInput, StepHeader } from "@/components/forms/FormPrimitives";

export interface InternStep1Props {
  secondParty: SecondParty;
  setSecondParty: React.Dispatch<React.SetStateAction<SecondParty>>;
}

export function InternStep1({ secondParty, setSecondParty }: InternStep1Props) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      <StepHeader
        title="Section 1: Personal Information"
        desc="Enter the intern's basic details for the offer letter."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Full Name *">
          <IconInput
            icon={User}
            type="text"
            placeholder="e.g. Mohammad Abdul Mazed"
            value={secondParty.fullName}
            onChange={(e) => setSecondParty((p) => ({ ...p, fullName: e.target.value }))}
          />
        </Field>

        <Field label="Internship Position *">
          <IconInput
            icon={Briefcase}
            type="text"
            placeholder="e.g. Frontend Developer Intern"
            value={secondParty.position}
            onChange={(e) => setSecondParty((p) => ({ ...p, position: e.target.value }))}
          />
        </Field>

        <Field label="National ID (NID) Number *">
          <IconInput
            icon={ShieldCheck}
            type="text"
            placeholder="e.g. 123XXXXX321"
            value={secondParty.nidNumber}
            onChange={(e) =>
              setSecondParty((p) => ({ ...p, nidNumber: e.target.value.replace(/\D/g, "") }))
            }
          />
        </Field>

        <Field label="Email Address *">
          <IconInput
            icon={Mail}
            type="email"
            placeholder="e.g. intern@example.com"
            value={secondParty.email}
            onChange={(e) => setSecondParty((p) => ({ ...p, email: e.target.value }))}
          />
        </Field>

        <Field label="Phone Number *">
          <IconInput
            icon={Phone}
            type="text"
            placeholder="e.g. 01XXXXXXXXX"
            value={secondParty.mobileNumber}
            onChange={(e) =>
              setSecondParty((p) => ({ ...p, mobileNumber: e.target.value.replace(/[^\d+]/g, "") }))
            }
          />
        </Field>
      </div>
    </motion.div>
  );
}

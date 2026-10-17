"use client";

import React from "react";
import { FirstParty, SecondParty } from "@/types";
import { TextInput, TextArea } from "@/components/forms/FormPrimitives";

interface FirstPartyTabProps {
  firstParty: FirstParty;
  setFirstParty: React.Dispatch<React.SetStateAction<FirstParty>>;
}

export function FirstPartyTab({ firstParty, setFirstParty }: FirstPartyTabProps) {
  const set =
    (key: keyof FirstParty) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFirstParty((p) => ({ ...p, [key]: e.target.value }));

  return (
    <div className="space-y-4">
      <TextInput
        label="Company Name"
        value={firstParty.companyName}
        onChange={set("companyName")}
      />
      <TextInput
        label="Represented By (Founder)"
        value={firstParty.representedBy}
        onChange={set("representedBy")}
      />
      <TextInput
        label="Company Tel Line"
        value={firstParty.mobileNumber}
        onChange={set("mobileNumber")}
      />
      <TextArea
        label="Base Office Address"
        value={firstParty.currentAddress}
        onChange={set("currentAddress")}
      />
      <TextInput
        label="Company Website Domain"
        value={firstParty.website}
        onChange={set("website")}
      />
    </div>
  );
}

interface SecondPartyTabProps {
  secondParty: SecondParty;
  setSecondParty: React.Dispatch<React.SetStateAction<SecondParty>>;
}

export function SecondPartyTab({ secondParty, setSecondParty }: SecondPartyTabProps) {
  const set =
    (key: keyof SecondParty) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setSecondParty((p) => ({ ...p, [key]: e.target.value }));

  return (
    <div className="space-y-4">
      <TextInput
        label="Candidate Full Name"
        value={secondParty.fullName}
        onChange={set("fullName")}
      />
      <TextInput
        label="Position / Role"
        value={secondParty.position || ""}
        onChange={set("position")}
      />
      <TextInput
        label="Email Address"
        value={secondParty.email || ""}
        onChange={set("email")}
      />
      <TextInput
        label="Contact Telephone Line"
        value={secondParty.mobileNumber}
        onChange={set("mobileNumber")}
      />
      <TextInput
        label="National ID (NID)"
        value={secondParty.nidNumber}
        onChange={set("nidNumber")}
      />
      <TextArea
        label="Present Address"
        value={secondParty.presentAddress}
        onChange={set("presentAddress")}
      />
    </div>
  );
}


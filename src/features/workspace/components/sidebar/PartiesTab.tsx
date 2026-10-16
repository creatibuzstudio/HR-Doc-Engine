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
        label="Corporate Position Role Key"
        value={secondParty.position || ""}
        onChange={set("position")}
      />
      <TextInput
        label="National ID (NID)"
        value={secondParty.nidNumber}
        onChange={set("nidNumber")}
      />
      <TextInput
        label="Contact Telephone Line"
        value={secondParty.mobileNumber}
        onChange={set("mobileNumber")}
      />

      <div className="grid grid-cols-2 gap-2">
        <TextInput
          label="Guardian Name"
          value={secondParty.guardianName}
          onChange={set("guardianName")}
        />
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
            Relation
          </label>
          <select
            value={secondParty.guardianRelation}
            onChange={set("guardianRelation")}
            className="w-full bg-secondary border border-border rounded-lg py-2 px-2 text-xs text-foreground font-semibold focus:outline-none focus:border-primary"
          >
            {["Father", "Mother", "Husband", "Guardian"].map((r) => (
              <option key={r} value={r} className="bg-card text-foreground">{r}</option>
            ))}
          </select>
        </div>
      </div>

      <TextArea
        label="Present Address"
        value={secondParty.presentAddress}
        onChange={set("presentAddress")}
      />
      <TextArea
        label="Permanent Address"
        value={secondParty.permanentAddress}
        onChange={set("permanentAddress")}
      />

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
          Blood Group
        </label>
        <select
          value={secondParty.bloodGroup || "Select"}
          onChange={set("bloodGroup")}
          className="w-full bg-secondary border border-border rounded-lg py-2 px-2 text-xs text-foreground font-semibold focus:outline-none focus:border-primary"
        >
          {["Select", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
            <option key={bg} value={bg} className="bg-card text-foreground">
              {bg}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}


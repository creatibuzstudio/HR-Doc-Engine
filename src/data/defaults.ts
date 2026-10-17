import { FirstParty, SecondParty } from "@/types";

// ─── Default first party (Creatibuz Studio) ─────────────────────────────────
export const DEFAULT_FIRST_PARTY: FirstParty = {
  companyName: "Creatibuz Studio",
  representedBy: "Md. Abdul Hakim",
  role: "Founder & CEO",
  ceoName: "Md. Abdul Hakim",
  ceoMobile: "+8801968657353",
  cooName: "Ashikur Rahman Ovi",
  cooMobile: "+8801581782193",
  hrName: "Ashikur Rahman Ovi",
  hrMobile: "+8801581782193",
  currentAddress: "Delduar Road, Tangail Shadar, Dhaka",
  permanentAddress: "Delduar Road, Tangail Shadar, Dhaka",
  mobileNumber: "+8801968657353",
  nidNumber: "2874935543",
  email: "info@creatibuzstudio.com",
  website: "www.creatibuzstudio.com",
  signatureImg: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 260 70' width='260' height='70'><path d='M20 52 C35 25, 45 15, 55 35 C60 45, 65 55, 75 48 C85 42, 90 28, 95 38 C100 48, 110 50, 120 40 C130 30, 135 45, 145 42 C155 38, 160 20, 165 30 C170 40, 180 50, 195 45' stroke='%23111827' stroke-width='2' fill='none' stroke-linecap='round'/><text x='20' y='50' font-family='Brush Script MT, Great Vibes, cursive, sans-serif' font-size='40' font-style='italic' fill='%23111827'>Abdul Hakim</text></svg>",
};

// ─── Blank second party (new candidate) ───────────────────────────────────────
export const DEFAULT_SECOND_PARTY: SecondParty = {
  partnerId: "",
  partnerIdSerial: "",
  fullName: "",
  email: "",
  guardianName: "",
  guardianRelation: "Father",
  mobileNumber: "",
  guardianMobile: "",
  presentAddress: "",
  permanentAddress: "",
  dob: "",
  nidNumber: "",
  position: "",
  bloodGroup: "Select",
  photoUrl: "",
  signatureImg: "",
};

// ─── Pre-filled demo second party ─────────────────────────────────────────────
export const SAMPLE_SECOND_PARTY: SecondParty = {
  partnerId: "CBS-EMP-001",
  partnerIdSerial: "001",
  fullName: "Ashikur Rahman Ovi",
  email: "ovi@creatibuzstudio.com",
  guardianName: "Md. Mostafizur Rahman",
  guardianRelation: "Father",
  mobileNumber: "+880 1581-782193",
  guardianMobile: "+880 1700-000000",
  presentAddress: "Delduar Road, Tangail Shadar, Dhaka",
  permanentAddress: "Delduar Road, Tangail Shadar, Dhaka",
  dob: "2000-01-01",
  nidNumber: "4229023884",
  position: "Full Stack Developer",
  bloodGroup: "B+",
  photoUrl: "",
  signatureImg: "",
};

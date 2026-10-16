import {
  FirstParty,
  SecondParty,
  DocSettings,
  AgreementTemplate,
} from "@/types";

interface StepValidationParams {
  activeStep: number;
  agreementTemplate: AgreementTemplate;
  secondParty: SecondParty;
  firstParty: FirstParty;
  docSettings: DocSettings;
}

export function validateStepLogic({
  activeStep,
  agreementTemplate,
  secondParty,
  firstParty,
  docSettings,
}: StepValidationParams): string {
  const p = secondParty;
  const isInternship = agreementTemplate === "internship";
  const isHrHiring = agreementTemplate === "hrHiringNotice";
  const isCertificate = agreementTemplate === "internCertificate";

  if (isCertificate) {
    if (activeStep === 1) {
      if (!docSettings.certOriginalAgreementId)
        return "Please select an Intern from the lookup list.";
      if (!p.fullName.trim()) return "Intern Name is required.";
      if (!p.position.trim()) return "Internship Position is required.";
      if (!p.department?.trim()) return "Department is required.";
      if (!docSettings.certStartDate?.trim())
        return "Internship Start Date is required.";
      if (!docSettings.certEndDate?.trim())
        return "Internship End Date is required.";
      if (!docSettings.certPerformanceGrade?.trim())
        return "Performance Rating is required.";
    } else if (activeStep === 2) {
      if (!firstParty.signatureImg)
        return "Founder & CEO signature is required to authorize the certificate.";
    }
    return "";
  }

  if (isHrHiring) {
    const validEmail = (email: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (activeStep === 1) {
      if (!docSettings.hrRecipientRole?.trim())
        return "Recipient role is required.";
      if (
        docSettings.hrRecipientRole === "Other" &&
        !docSettings.hrRecipientRoleCustom?.trim()
      )
        return "Please specify the recipient role.";
      if (!docSettings.hrRecipientName?.trim())
        return "Recipient name is required.";
      if (!docSettings.hrRecipientEmail?.trim())
        return "Recipient email is required.";
      if (!validEmail(docSettings.hrRecipientEmail))
        return "Please enter a valid recipient email address.";
      if (!docSettings.hrNoticeTitle?.trim())
        return "Notice title is required.";
      if (!docSettings.hrSubject?.trim()) return "Subject line is required.";
      if (!docSettings.date?.trim()) return "Notice date is required.";
    } else if (activeStep === 2) {
      if (!docSettings.hrPositionName?.trim())
        return "Position name is required.";
      if (!docSettings.hrDepartment?.trim()) return "Department is required.";
      if (!docSettings.hrEmploymentType?.trim())
        return "Employment type is required.";
      if (!docSettings.hrWorkMode?.trim()) return "Work mode is required.";
      if (!docSettings.hrRequiredSkills?.length)
        return "Please add at least one required skill.";
    } else if (activeStep === 3) {
      if (!firstParty.signatureImg)
        return "HR signature is required to issue the notice.";
      if (!docSettings.hrPreparedByName?.trim())
        return "Prepared-by name is required.";
      if (!docSettings.hrPreparedByDesignation?.trim())
        return "Designation is required.";
    }
    return "";
  }

  if (isInternship) {
    if (activeStep === 1) {
      if (!p.fullName.trim()) return "Full Name is required.";
      if (!p.nidNumber.trim()) return "National ID (NID) is required.";
      if (!p.position.trim()) return "Internship position is required.";
      if (!p.email.trim()) return "Email address is required.";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(p.email.trim()))
        return "Please enter a valid email address.";
      if (!p.mobileNumber.trim()) return "Phone number is required.";
    } else if (activeStep === 2) {
      if (!docSettings.date.trim()) return "Offer date is required.";
      if (!docSettings.internshipDuration?.trim())
        return "Internship duration is required.";
      if (docSettings.isPaid === undefined)
        return "Please select paid or unpaid.";
      if (!docSettings.internIdSerial?.trim())
        return "Intern ID serial is required.";
      if (!docSettings.internRefIdSerial?.trim())
        return "Reference ID serial is required.";
    } else if (activeStep === 3) {
      if (!firstParty.signatureImg)
        return "Founder/CEO signature is required to issue the offer letter.";
    }
    return "";
  }

  // Contractual (Default)
  if (activeStep === 1) {
    if (!p.fullName.trim()) return "Candidate / Contractor Full Name is required.";
    if (!p.position.trim()) return "Position / Role is required.";
    if (!p.email.trim()) return "Email address is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(p.email.trim()))
      return "Please enter a valid email address.";
    if (!p.mobileNumber.trim()) return "Phone number is required.";
  } else if (activeStep === 2) {
    if (!docSettings.date?.trim()) return "Date of Issue is required.";
    if (!docSettings.contractSubject?.trim()) return "Subject line is required.";
    if (!docSettings.refIdSerial?.trim()) return "Agreement Reference ID serial is required.";
    if (!secondParty.partnerIdSerial?.trim()) return "Contractor ID serial is required.";
  } else if (activeStep === 3) {
    if (!firstParty.signatureImg)
      return "Founder & CEO signature is required to authorize the agreement.";
  }
  return "";
}

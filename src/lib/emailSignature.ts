import { getBaseUrl } from "./emailConfig";

export interface SignatureParams {
  name: string;
  title: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  accentColor: string;
}

export function buildEmailSignature({
  name,
  title,
  email,
  phone,
  website,
  address,
  accentColor,
}: SignatureParams): string {
  const baseUrl = getBaseUrl();
  const iconStyle =
    'width="13" height="13" style="display:inline-block;vertical-align:middle;margin-right:3px;border:0;outline:none;"';

  const iconEmail = `<img ${iconStyle} src="https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/mail.svg" alt="email" />`;
  const iconPhone = `<img ${iconStyle} src="https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/phone.svg" alt="phone" />`;
  const iconGlobe = `<img ${iconStyle} src="https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/globe.svg" alt="website" />`;
  const iconPin = `<img ${iconStyle} src="https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/map-pin.svg" alt="address" />`;

  const logoUrl = `${baseUrl}/creatibuz-symbol.png`;
  const logoCell = `<td style="padding-right:15px;vertical-align:top;width:60px;">
    <a href="https://${website}" target="_blank" style="text-decoration:none;">
      <img src="${logoUrl}" alt="Creatibuz Studio" width="56" style="display:block;width:56px;max-width:56px;height:auto;border:0;outline:none;text-decoration:none;border-radius:10px;background:#0d0d0d;padding:4px;" />
    </a>
  </td>`;

  return `
<table cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;font-size:13px;color:#334155;line-height:1.4;border-collapse:collapse;margin-top:24px;padding-top:16px;border-top:1px solid #f1f5f9;width:100%;">
  <tr>
    ${logoCell}
    <td style="border-left:2px solid ${accentColor};padding-left:15px;vertical-align:top;">
      <div style="font-size:15px;font-weight:bold;color:#0f172a;margin-bottom:2px;">${name}</div>
      <div style="font-size:12px;font-weight:600;color:${accentColor};text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">${title}</div>
      <div style="font-size:12px;color:#475569;">
        ${iconEmail}<a href="mailto:${email}" style="color:#0f172a;text-decoration:none;font-weight:500;">${email}</a>
        <span style="color:#cbd5e1;margin:0 5px;">|</span>
        ${iconPhone}<a href="tel:${phone.replace(/\s/g, "")}" style="color:#0f172a;text-decoration:none;font-weight:500;">${phone}</a>
      </div>
      <div style="font-size:12px;color:#475569;margin-top:3px;">
        ${iconGlobe}<a href="https://${website}" target="_blank" style="color:${accentColor};text-decoration:none;font-weight:500;">${website}</a>
        <span style="color:#cbd5e1;margin:0 5px;">|</span>
        ${iconPin}${address}
      </div>
      <div style="margin-top:8px;padding-top:6px;border-top:1px solid #f1f5f9;font-size:10.5px;color:#94a3b8;font-style:italic;">
        Official Document dispatched via
        <strong style="color:#FF5722;font-style:normal;">Creatibuz Studio Engine</strong>
      </div>
    </td>
  </tr>
</table>`;
}

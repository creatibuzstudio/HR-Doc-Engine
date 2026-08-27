/**
 * Shared date utilities — single source of truth for all date handling.
 *
 * Storage format: "July 5, 2026" (long US locale display format)
 * Input/picker format: "YYYY-MM-DD" (native <input type="date"> value)
 */

/** Convert any date string to native date picker value "YYYY-MM-DD".
 *  Accepts both ISO ("2026-07-05") and display ("July 5, 2026") formats.
 *  Parses in LOCAL time to avoid UTC timezone shift. */
export function toISODate(dateStr: string): string {
  if (!dateStr) return "";
  // Already ISO — return as-is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  // Use local year/month/day to avoid UTC conversion shifting the date
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Convert ISO "YYYY-MM-DD" (from native date picker) to display format "July 5, 2026". */
export function toDisplayDate(isoStr: string): string {
  if (!isoStr) return "";
  const d = new Date(isoStr + "T00:00:00");
  if (isNaN(d.getTime())) return isoStr;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Returns today's date as "YYYY-MM-DD" for use in max/min props. */
export function getTodayISO(): string {
  return new Date().toISOString().split("T")[0];
}

/** Returns today's date as display format "July 5, 2026". */
export function getTodayDisplay(): string {
  return toDisplayDate(getTodayISO());
}

import { CRMRecord } from "../types/index.js";

export function generateCSVOutput(records: CRMRecord[]): string {
  if (records.length === 0) {
    return "";
  }

  const headers = [
    "created_at",
    "name",
    "email",
    "country_code",
    "mobile_without_country_code",
    "company",
    "city",
    "state",
    "country",
    "lead_owner",
    "crm_status",
    "crm_note",
    "data_source",
    "possession_time",
    "description",
  ];

  const rows = records.map((record) =>
    headers.map((header) => {
      const value = record[header as keyof CRMRecord];
      if (value === null || value === undefined) {
        return "";
      }
      const stringValue = String(value);
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    })
  );

  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
  
  return csvContent;
}

export function escapeCSVValue(value: string | undefined): string {
  if (!value) return "";
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

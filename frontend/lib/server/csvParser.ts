import { parse } from "csv-parse/sync";
import { ParsedCSVRecord } from "./types";

export function parseCSVBuffer(fileBuffer: Buffer): {
  records: ParsedCSVRecord[];
  columns: string[];
} {
  try {
    const csvContent = fileBuffer.toString("utf-8");
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as ParsedCSVRecord[];

    if (records.length === 0) {
      throw new Error("CSV file is empty");
    }

    const columns = Object.keys(records[0]);
    if (columns.length === 0) {
      throw new Error("CSV file has no columns");
    }

    return { records, columns };
  } catch (error) {
    throw new Error(
      `Failed to parse CSV: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export function getCSVPreview(
  records: ParsedCSVRecord[],
  limit = 5
): ParsedCSVRecord[] {
  return records.slice(0, limit);
}

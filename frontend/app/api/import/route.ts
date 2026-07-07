import { NextResponse } from "next/server";
import { extractCRMRecords } from "@/lib/server/aiService";
import { ImportResponse, ParsedCSVRecord } from "@/lib/server/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      records?: ParsedCSVRecord[];
    };

    if (!Array.isArray(body.records) || body.records.length === 0) {
      return NextResponse.json(
        { error: "No CSV records provided for import" },
        { status: 400 }
      );
    }

    const { successful, skipped } = await extractCRMRecords(body.records);
    const response: ImportResponse = {
      success: true,
      totalRecords: body.records.length,
      successfulRecords: successful.length,
      skippedRecords: skipped.length,
      records: successful,
      skipped,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to process import",
      },
      { status: 500 }
    );
  }
}

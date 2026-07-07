import Anthropic from "@anthropic-ai/sdk";
import { CRMRecord, CRMStatus, DataSource, ParsedCSVRecord } from "./types";

let client: Anthropic | null = null;

const ALLOWED_CRM_STATUSES: CRMStatus[] = [
  "GOOD_LEAD_FOLLOW_UP",
  "DID_NOT_CONNECT",
  "BAD_LEAD",
  "SALE_DONE",
];

const ALLOWED_DATA_SOURCES: DataSource[] = [
  "leads_on_demand",
  "meridian_tower",
  "eden_park",
  "varah_swamy",
  "sarjapur_plots",
];

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      throw new Error("CLAUDE_API_KEY environment variable is not set");
    }
    client = new Anthropic({ apiKey });
  }

  return client;
}

export async function extractCRMRecords(records: ParsedCSVRecord[]): Promise<{
  successful: CRMRecord[];
  skipped: Array<{ reason: string; originalRecord: ParsedCSVRecord }>;
}> {
  const successful: CRMRecord[] = [];
  const skipped: Array<{ reason: string; originalRecord: ParsedCSVRecord }> = [];
  const batchSize = 10;

  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);

    try {
      const extractedBatch = await processAIBatch(batch);

      for (let j = 0; j < batch.length; j += 1) {
        const extracted = extractedBatch[j] ?? {};

        if (!extracted.email && !extracted.mobile_without_country_code) {
          skipped.push({
            reason: "Missing both email and mobile number",
            originalRecord: batch[j],
          });
          continue;
        }

        successful.push(extracted);
      }
    } catch (error) {
      for (const record of batch) {
        skipped.push({
          reason: `AI processing error: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          originalRecord: record,
        });
      }
    }
  }

  return { successful, skipped };
}

async function processAIBatch(records: ParsedCSVRecord[]): Promise<CRMRecord[]> {
  const response = await getClient().messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: buildExtractionPrompt(records),
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  return parseClaudeResponse(content.text);
}

function buildExtractionPrompt(records: ParsedCSVRecord[]): string {
  return `You are a CRM data extraction expert. Map CSV fields to GrowEasy CRM format.

CRM fields:
- created_at: JavaScript Date compatible lead creation date
- name
- email: primary email
- country_code
- mobile_without_country_code
- company
- city
- state
- country
- lead_owner
- crm_status: one of GOOD_LEAD_FOLLOW_UP, DID_NOT_CONNECT, BAD_LEAD, SALE_DONE
- crm_note: remarks, follow-up notes, extra emails, extra phone numbers, useful unmatched details
- data_source: one of leads_on_demand, meridian_tower, eden_park, varah_swamy, sarjapur_plots, or blank
- possession_time
- description

Rules:
1. Use the first email/mobile as primary and append extras to crm_note.
2. Use null when a field cannot be determined.
3. Escape line breaks as \\n.
4. Return ONLY a valid JSON array with one object per input record.

Input records:
${JSON.stringify(records, null, 2)}`;
}

function parseClaudeResponse(responseText: string): CRMRecord[] {
  const jsonMatch = responseText.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("No JSON array found in AI response");
  }

  const records = JSON.parse(jsonMatch[0]) as CRMRecord[];
  return records.map((record) => sanitizeRecord(record));
}

function sanitizeRecord(record: CRMRecord): CRMRecord {
  const sanitized: CRMRecord = {};

  if (record.created_at) {
    sanitized.created_at = validateDate(record.created_at);
  }
  if (typeof record.name === "string") sanitized.name = record.name.trim();
  if (typeof record.email === "string") sanitized.email = record.email.trim().toLowerCase();
  if (typeof record.country_code === "string") sanitized.country_code = record.country_code.trim();
  if (typeof record.mobile_without_country_code === "string") {
    sanitized.mobile_without_country_code = record.mobile_without_country_code.trim();
  }
  if (typeof record.company === "string") sanitized.company = record.company.trim();
  if (typeof record.city === "string") sanitized.city = record.city.trim();
  if (typeof record.state === "string") sanitized.state = record.state.trim();
  if (typeof record.country === "string") sanitized.country = record.country.trim();
  if (typeof record.lead_owner === "string") sanitized.lead_owner = record.lead_owner.trim();
  if (typeof record.crm_status === "string") {
    const status = record.crm_status.trim() as CRMStatus;
    if (ALLOWED_CRM_STATUSES.includes(status)) sanitized.crm_status = status;
  }
  if (typeof record.crm_note === "string") {
    sanitized.crm_note = record.crm_note.trim().replace(/\n/g, "\\n");
  }
  if (typeof record.data_source === "string") {
    const source = record.data_source.trim() as DataSource;
    if (ALLOWED_DATA_SOURCES.includes(source)) sanitized.data_source = source;
  }
  if (typeof record.possession_time === "string") {
    sanitized.possession_time = record.possession_time.trim();
  }
  if (typeof record.description === "string") {
    sanitized.description = record.description.trim().replace(/\n/g, "\\n");
  }

  return sanitized;
}

function validateDate(dateStr: string): string | undefined {
  const date = new Date(dateStr);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

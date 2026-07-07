import Anthropic from "@anthropic-ai/sdk";
import { CRMRecord, ParsedCSVRecord, CRMStatus, DataSource } from "../types/index.js";

let client: Anthropic | null = null;

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

export async function extractCRMRecords(
  records: ParsedCSVRecord[]
): Promise<{ 
  successful: CRMRecord[]; 
  skipped: Array<{ reason: string; originalRecord: ParsedCSVRecord }> 
}> {
  const successful: CRMRecord[] = [];
  const skipped: Array<{ reason: string; originalRecord: ParsedCSVRecord }> = [];

  // Process in batches of 10
  const batchSize = 10;
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, Math.min(i + batchSize, records.length));
    
    try {
      const extractedBatch = await processAIBatch(batch);
      
      for (let j = 0; j < batch.length; j++) {
        const extracted = extractedBatch[j];
        
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
      // Skip this batch on error
      for (const record of batch) {
        skipped.push({
          reason: `AI processing error: ${error instanceof Error ? error.message : "Unknown error"}`,
          originalRecord: record,
        });
      }
    }
  }

  return { successful, skipped };
}

async function processAIBatch(records: ParsedCSVRecord[]): Promise<CRMRecord[]> {
  const prompt = buildExtractionPrompt(records);

  const response = await getClient().messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: prompt,
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
  const recordsJson = JSON.stringify(records, null, 2);

  return `You are a CRM data extraction expert. Your task is to intelligently map CSV fields to GrowEasy CRM format.

Given the following CSV records with various column names and formats, extract and map them to the CRM structure below.

CRM Fields to extract:
- created_at: Lead creation date (must be valid ISO date string or JavaScript Date compatible)
- name: Lead name
- email: Primary email
- country_code: Country code (e.g., +91)
- mobile_without_country_code: Mobile number without country code
- company: Company name
- city: City
- state: State
- country: Country
- lead_owner: Lead owner
- crm_status: One of: GOOD_LEAD_FOLLOW_UP, DID_NOT_CONNECT, BAD_LEAD, SALE_DONE
- crm_note: Notes/remarks/follow-up notes/additional information
- data_source: One of: leads_on_demand, meridian_tower, eden_park, varah_swamy, sarjapur_plots (leave blank if not confident)
- possession_time: Property possession time
- description: Additional description

Rules:
1. For multiple emails: use first, append others to crm_note
2. For multiple mobiles: use first, append others to crm_note
3. Date format must be JavaScript compatible
4. Only use exact CRM status values
5. Only use exact data source values
6. Escape line breaks as \\n
7. If a field cannot be determined, use null
8. Return ONLY valid JSON array, no other text

Input CSV records:
${recordsJson}

Return a JSON array of CRM records with the exact structure. Example:
[
  {
    "created_at": "2026-05-13T14:20:48",
    "name": "John Doe",
    "email": "john@example.com",
    ...
  }
]`;
}

function parseClaudeResponse(responseText: string): CRMRecord[] {
  try {
    // Extract JSON from the response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No JSON array found in response");
    }

    const records = JSON.parse(jsonMatch[0]) as CRMRecord[];
    
    // Validate and sanitize records
    return records.map((record) => sanitizeRecord(record));
  } catch (error) {
    console.error("Failed to parse Claude response:", responseText);
    throw new Error(`Failed to parse AI response: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

function sanitizeRecord(record: CRMRecord): CRMRecord {
  const sanitized: CRMRecord = {};

  // Validate and set fields
  if (record.created_at) {
    sanitized.created_at = validateDate(record.created_at);
  }

  if (record.name && typeof record.name === "string") {
    sanitized.name = record.name.trim();
  }

  if (record.email && typeof record.email === "string") {
    sanitized.email = record.email.trim().toLowerCase();
  }

  if (record.country_code && typeof record.country_code === "string") {
    sanitized.country_code = record.country_code.trim();
  }

  if (record.mobile_without_country_code && typeof record.mobile_without_country_code === "string") {
    sanitized.mobile_without_country_code = record.mobile_without_country_code.trim();
  }

  if (record.company && typeof record.company === "string") {
    sanitized.company = record.company.trim();
  }

  if (record.city && typeof record.city === "string") {
    sanitized.city = record.city.trim();
  }

  if (record.state && typeof record.state === "string") {
    sanitized.state = record.state.trim();
  }

  if (record.country && typeof record.country === "string") {
    sanitized.country = record.country.trim();
  }

  if (record.lead_owner && typeof record.lead_owner === "string") {
    sanitized.lead_owner = record.lead_owner.trim();
  }

  if (record.crm_status && typeof record.crm_status === "string") {
    const status = record.crm_status.trim() as CRMStatus;
    if (ALLOWED_CRM_STATUSES.includes(status)) {
      sanitized.crm_status = status;
    }
  }

  if (record.crm_note && typeof record.crm_note === "string") {
    sanitized.crm_note = record.crm_note.trim().replace(/\n/g, "\\n");
  }

  if (record.data_source && typeof record.data_source === "string") {
    const source = record.data_source.trim() as DataSource;
    if (ALLOWED_DATA_SOURCES.includes(source)) {
      sanitized.data_source = source;
    }
  }

  if (record.possession_time && typeof record.possession_time === "string") {
    sanitized.possession_time = record.possession_time.trim();
  }

  if (record.description && typeof record.description === "string") {
    sanitized.description = record.description.trim().replace(/\n/g, "\\n");
  }

  return sanitized;
}

function validateDate(dateStr: string): string | undefined {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return undefined;
    }
    return date.toISOString();
  } catch {
    return undefined;
  }
}

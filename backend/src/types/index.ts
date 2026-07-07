export interface CRMRecord {
  created_at?: string;
  name?: string;
  email?: string;
  country_code?: string;
  mobile_without_country_code?: string;
  company?: string;
  city?: string;
  state?: string;
  country?: string;
  lead_owner?: string;
  crm_status?: string;
  crm_note?: string;
  data_source?: string;
  possession_time?: string;
  description?: string;
}

export interface ParsedCSVRecord {
  [key: string]: string | number | undefined;
}

export interface ImportResponse {
  success: boolean;
  totalRecords: number;
  successfulRecords: number;
  skippedRecords: number;
  records: CRMRecord[];
  skipped: Array<{
    reason: string;
    originalRecord: ParsedCSVRecord;
  }>;
}

export interface UploadResponse {
  fileId: string;
  fileName: string;
  totalRows: number;
  preview: ParsedCSVRecord[];
  columns: string[];
}

export type CRMStatus = 
  | "GOOD_LEAD_FOLLOW_UP"
  | "DID_NOT_CONNECT"
  | "BAD_LEAD"
  | "SALE_DONE";

export type DataSource =
  | "leads_on_demand"
  | "meridian_tower"
  | "eden_park"
  | "varah_swamy"
  | "sarjapur_plots"
  | "";

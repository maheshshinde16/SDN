import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface UploadResponse {
  fileId: string;
  fileName: string;
  totalRows: number;
  preview: any[];
  records: any[];
  columns: string[];
}

export interface ImportResponse {
  success: boolean;
  totalRecords: number;
  successfulRecords: number;
  skippedRecords: number;
  records: any[];
  skipped: Array<{
    reason: string;
    originalRecord: any;
  }>;
}

export async function uploadCSV(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<UploadResponse>("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function importCSV(
  fileId: string,
  records?: any[]
): Promise<ImportResponse> {
  const response = await apiClient.post<ImportResponse>("/import", {
    fileId,
    records,
  });
  return response.data;
}

export async function healthCheck(): Promise<boolean> {
  try {
    await apiClient.get("/health");
    return true;
  } catch {
    return false;
  }
}

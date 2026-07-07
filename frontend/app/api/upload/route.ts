import { NextResponse } from "next/server";
import { getCSVPreview, parseCSVBuffer } from "@/lib/server/csvParser";
import { UploadResponse } from "@/lib/server/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { records, columns } = parseCSVBuffer(buffer);
    const response: UploadResponse = {
      fileId: `${Date.now()}`,
      fileName: file.name,
      totalRows: records.length,
      preview: getCSVPreview(records, 5),
      records,
      columns,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to parse CSV",
      },
      { status: 400 }
    );
  }
}

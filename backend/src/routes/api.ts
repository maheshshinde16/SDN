import { Router, Request, Response } from "express";
import multer from "multer";
import { parseCSVFile, getCSVPreview } from "../utils/csvParser.js";
import { extractCRMRecords } from "../services/aiService.js";
import { UploadResponse, ImportResponse } from "../types/index.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Simple in-memory storage for uploaded files (in production, use database)
const fileStorage: Map<
  string,
  {
    fileName: string;
    records: any[];
    columns: string[];
  }
> = new Map();

// POST /api/upload - Upload and parse CSV
router.post(
  "/upload",
  upload.single("file"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No file provided" });
        return;
      }

      const { records, columns } = parseCSVFile(req.file.buffer);
      const preview = getCSVPreview(records, 5);
      const fileId = Date.now().toString();

      fileStorage.set(fileId, {
        fileName: req.file.originalname,
        records,
        columns,
      });

      const response: UploadResponse = {
        fileId,
        fileName: req.file.originalname,
        totalRows: records.length,
        preview,
        columns,
      };

      res.json(response);
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : "Failed to parse CSV",
      });
    }
  }
);

// POST /api/import - Process CSV with AI
router.post(
  "/import",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { fileId } = req.body;

      if (!fileId || !fileStorage.has(fileId)) {
        res.status(400).json({ error: "Invalid file ID" });
        return;
      }

      const fileData = fileStorage.get(fileId)!;
      const { successful, skipped } = await extractCRMRecords(fileData.records);

      const response: ImportResponse = {
        success: true,
        totalRecords: fileData.records.length,
        successfulRecords: successful.length,
        skippedRecords: skipped.length,
        records: successful,
        skipped,
      };

      // Clean up after processing
      fileStorage.delete(fileId);

      res.json(response);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to process import",
      });
    }
  }
);

// GET /api/health - Health check
router.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

export default router;

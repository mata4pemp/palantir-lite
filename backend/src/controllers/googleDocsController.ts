import { Request, Response } from "express";
import {
  downloadGoogleDoc,
  downloadGoogleSheet,
} from "../services/googleDocsService";

// Get Google Doc title
export const getGoogleDocTitle = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { docId } = req.params;

    if (!docId) {
      return res.status(400).json({ error: "Document ID is required" });
    }

    const { title } = await downloadGoogleDoc(docId);

    return res.json({ title });
  } catch (error: any) {
    console.error("Get Google Doc title error:", error);
    return res.status(500).json({
      error: error.message || "Failed to get Google Doc title",
    });
  }
};

// Get Google Sheet title
export const getGoogleSheetTitle = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { sheetId } = req.params;

    if (!sheetId) {
      return res.status(400).json({ error: "Sheet ID is required" });
    }

    const { title } = await downloadGoogleSheet(sheetId);

    return res.json({ title });
  } catch (error: any) {
    console.error("Get Google Sheet title error:", error);
    return res.status(500).json({
      error: error.message || "Failed to get Google Sheet title",
    });
  }
};

import { Request, Response } from "express";
import { extractTextFromPDF } from "../services/pdfService";

export const uploadPDF = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF file uploaded" });
    }

    // Check if file is actually a PDF
    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "File must be a PDF" });
    }

    // Check file size (limit to 10MB)
    if (req.file.size > 10 * 1024 * 1024) {
      return res.status(400).json({ error: "PDF file too large (max 10MB)" });
    }

    const { content, title } = await extractTextFromPDF(req.file.buffer);

    return res.json({
      content,
      title,
      message: "PDF processed successfully",
    });
  } catch (error: any) {
    console.error("PDF upload error:", error);
    return res.status(500).json({
      error: error.message || "Failed to process PDF",
    });
  }
};

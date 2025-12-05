import { Request, Response } from "express";
import { downloadNotionPage } from "../services/notionService";

// Get Notion page title
export const getNotionPageTitle = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { pageUrl } = req.body;

    if (!pageUrl) {
      return res.status(400).json({ error: "Page URL is required" });
    }

    const { title } = await downloadNotionPage(pageUrl);

    return res.json({ title });
  } catch (error: any) {
    console.error("Get Notion page title error:", error);
    return res.status(500).json({
      error: error.message || "Failed to get Notion page title",
    });
  }
};
const pdf = require("pdf-parse");

export const extractTextFromPDF = async (
  buffer: Buffer
): Promise<{ content: string; title: string }> => {
  try {
    const data = await pdf(buffer);

    // Extract text content
    const content = data.text;

    // Try to get title from PDF metadata, fallback to "Untitled Document"
    const title = data.info?.Title || "Untitled PDF Document";

    if (!content || content.trim().length === 0) {
      throw new Error("PDF appears to be empty or contains only images");
    }

    return { content, title };
  } catch (error: any) {
    console.error("Error extracting PDF text:", error);
    throw new Error(
      "Failed to extract text from PDF. Make sure it contains text (not just images)."
    );
  }
};

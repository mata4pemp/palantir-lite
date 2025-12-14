// Use require for the legacy CommonJS build to avoid DOMMatrix error
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.mjs");

// Disable worker to avoid build issues
pdfjsLib.GlobalWorkerOptions.workerSrc = "";

export const extractTextFromPDF = async (
  buffer: Buffer
): Promise<{ content: string; title: string }> => {
  try {
    // Convert Buffer to Uint8Array
    const uint8Array = new Uint8Array(buffer);

    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
    const pdfDocument = await loadingTask.promise;

    // Extract metadata for title
    const metadata = await pdfDocument.getMetadata();
    const title = (metadata.info as any)?.Title || "Untitled PDF Document";

    // Extract text from all pages
    let fullText = "";
    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(" ");
      fullText += pageText + "\n";
    }

    if (!fullText || fullText.trim().length === 0) {
      throw new Error("PDF appears to be empty or contains only images");
    }

    return { content: fullText.trim(), title };
  } catch (error: any) {
    console.error("Error extracting PDF text:", error);
    throw new Error(
      "Failed to extract text from PDF. Make sure it contains text (not just images)."
    );
  }
};

import axios from "axios";

//extract google doc ID from URL
export const extractGoogleDocId = (url: string): string | null => {
  try {
    //regular expression of google docs
    // https://docs.google.com/document/d/DOCUMENT_ID/edit
    const match = url.match(/\/document\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  } catch (error) {
    return null;
  }
};

// Extract Google Sheet ID from URL
export const extractGoogleSheetId = (url: string): string | null => {
  try {
    // https://docs.google.com/spreadsheets/d/SHEET_ID/edit
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  } catch (error) {
    return null;
  }
};

//download google doc as text and get title
export const downloadGoogleDoc = async (
  docId: string
): Promise<{ content: string; title: string }> => {
  try {
    // Headers to mimic a browser request
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br",
      Connection: "keep-alive",
      "Upgrade-Insecure-Requests": "1",
    };

    // Fetch the regular document page to extract the title
    const viewUrl = `https://docs.google.com/document/d/${docId}/edit`;
    const viewResponse = await axios.get(viewUrl, {
      responseType: "text",
      headers,
    });

    // Extract title from the page HTML - Google Docs embeds it in multiple places
    // Try multiple patterns to find the title
    let title = "Untitled Document";

    // Pattern 1: Look for document title in meta tags
    const ogTitleMatch = viewResponse.data.match(/<meta property="og:title" content="([^"]+)"/);
    if (ogTitleMatch) {
      title = ogTitleMatch[1];
    } else {
      // Pattern 2: Look for title in the page title tag
      const titleMatch = viewResponse.data.match(/<title>([^<]+)<\/title>/);
      if (titleMatch) {
        title = titleMatch[1].replace(/ - Google Docs$/i, "");
      }
    }

    // Get the text content
    const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`;
    const response = await axios.get(exportUrl, {
      responseType: "text",
      headers,
    });

    return { content: response.data, title };
  } catch (error: any) {
    console.error("Error downloading Google Doc:", error);
    throw new Error(
      "Failed to download Google Doc. Make sure it's shared as 'Anyone with the link can view'"
    );
  }
};

//download google sheet as CSV and get title
export const downloadGoogleSheet = async (
  sheetId: string
): Promise<{ content: string; title: string }> => {
  try {
    // Headers to mimic a browser request
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br",
      Connection: "keep-alive",
      "Upgrade-Insecure-Requests": "1",
    };

    // Fetch the regular spreadsheet page to extract the title
    const viewUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;
    const viewResponse = await axios.get(viewUrl, {
      responseType: "text",
      headers,
    });

    // Extract title from the page HTML
    let title = "Untitled Spreadsheet";

    // Pattern 1: Look for spreadsheet title in meta tags
    const ogTitleMatch = viewResponse.data.match(/<meta property="og:title" content="([^"]+)"/);
    if (ogTitleMatch) {
      title = ogTitleMatch[1];
    } else {
      // Pattern 2: Look for title in the page title tag
      const titleMatch = viewResponse.data.match(/<title>([^<]+)<\/title>/);
      if (titleMatch) {
        title = titleMatch[1].replace(/ - Google Sheets$/i, "");
      }
    }

    // Get the CSV content
    const exportUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
    const response = await axios.get(exportUrl, {
      responseType: "text",
      headers,
    });

    return { content: response.data, title };
  } catch (error: any) {
    console.error("Error downloading Google Sheet:", error);
    throw new Error(
      "Failed to download Google Sheet. Make sure it's shared as 'Anyone with the link can view'"
    );
  }
};

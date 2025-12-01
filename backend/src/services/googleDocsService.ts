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

//download google doc as text
export const downloadGoogleDoc = async (docId: string): Promise<string> => {
  try {
    const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`;
    const response = await axios.get(exportUrl, {
      responseType: "text",
    });

    return response.data;
  } catch (error: any) {
    console.error("Error downloading Google Doc:", error);
    throw new Error(
      "Failed to download Google Doc. Make sure it's shared as 'Anyone with the link can view'"
    );
  }
};

//download google sheet as CSV
export const downloadGoogleSheet = async (sheetId: string): Promise<string> => {
  try {
    const exportUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
    const response = await axios.get(exportUrl, {
      responseType: "text",
    });

    return response.data;
  } catch (error: any) {
    console.error("Error downloading Google Sheet:", error);
    throw new Error(
      "Failed to download Google Sheet. Make sure it's shared as 'Anyone with the link can view'"
    );
  }
};

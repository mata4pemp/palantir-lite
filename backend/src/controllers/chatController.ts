import { Request, Response } from "express";
import OpenAI from "openai";
import Transcript from "../models/Transcript";
import { extractVideoId } from "../services/youtubeService";
import {
  extractGoogleDocId,
  extractGoogleSheetId,
  downloadGoogleDoc,
  downloadGoogleSheet,
} from "../services/googleDocsService";
import {
  extractNotionPageId,
  downloadNotionPage,
} from "../services/notionService";

//the structure of a chat message
interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

//defines a document that users can chat about
interface Document {
  type: string;
  url: string;
}

//defines what the request body should contain, sent from frontend to http request
interface ChatRequestBody {
  messages: ChatMessage[];
  documents: Document[];
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

//async function that handles chat requests
export const sendChatMessage = async (
  req: Request<{}, {}, ChatRequestBody>,
  res: Response
): Promise<Response> => {
  try {
    const { messages, documents } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: "Messages array is required",
      });
    }

    //sets the AI behavior so they understand
    let systemMessage =
      "You are a helpful assistant that helps users chat about their documents. They will give you access to their document data and you will help them answer any questions or request.";

    //when documents exist, create a comma separateed list of documents add it to system message
    if (documents && documents.length > 0) {
      const docsList = documents.map((d) => `${d.type}: ${d.url}`).join(", ");
      systemMessage += ` You are currently chatting about these documents: ${docsList}`;

      //fetch youtube video transcripts
      const youtubeTranscripts: string[] = [];

      for (const doc of documents) {
        if (doc.type === "Youtube Video") {
          const videoId = extractVideoId(doc.url);
          if (videoId) {
            const transcript = await Transcript.findOne({ videoId });
            if (transcript) {
              youtubeTranscripts.push(
                `\n\n--- Transcript for ${doc.url} ---\n${transcript.transcript}\n--- End of Transcript ---\n`
              );
            }
          }
        }
      }

      //add all the youtube transcripts to system message
      if (youtubeTranscripts.length > 0) {
        systemMessage +=
          "\n\nHere are the transcripts of the YouTube videos:\n" +
          youtubeTranscripts.join("\n");
      }

      //fetch the google docs content
      for (const doc of documents) {
        if (doc.type === "Google Docs") {
          const docId = extractGoogleDocId(doc.url);
          if (docId) {
            try {
              const content = await downloadGoogleDoc(docId);
              systemMessage += `\n\n--- Content from Google Doc (${doc.url}) ---\n${content}\n--- End of Google Doc ---\n`;
            } catch (error: any) {
              console.error("Error fetching Google Doc:", error);
            }
          }
        }

        if (doc.type === "Google Sheets") {
          const sheetId = extractGoogleSheetId(doc.url);
          if (sheetId) {
            try {
              const content = await downloadGoogleSheet(sheetId);
              systemMessage += `\n\n--- Content from Google Sheet (${doc.url}) ---\n${content}\n--- End of Google Sheet ---\n`;
            } catch (error: any) {
              console.error("Error fetching Google Sheet:", error);
            }
          }
        }

        if (doc.type === "Notion Page") {
          const pageId = extractNotionPageId(doc.url);
          if (pageId) {
            try {
              const content = await downloadNotionPage(doc.url);
              systemMessage += `\n\n--- Content from Notion Page (${doc.url}) ---\n${content}\n--- End of Notion Page ---\n`;
            } catch (error: any) {
              console.error("Error fetching Notion Page:", error);
            }
          }
        }
      }
    }

    //create the completion with OpenAI
    //if i increase token limit, helps to increase output more
    //temperature change helps change deterministic > creativity of model
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: systemMessage }, ...messages],
      temperature: 0.7,
      max_tokens: 1000,
    });

    //get the AI's 1st response message
    const aiMessage = completion.choices[0].message;

    //sends back the AI message and usage stats token to frontend
    return res.json({
      message: aiMessage,
      usage: completion.usage,
    });
  } catch (error: any) {
    console.error("chat error:", error);

    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data.error?.message || "OpenAI API error",
      });
    }

    return res.status(500).json({
      error: "Server error during chat",
    });
  }
};

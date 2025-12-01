import { Request, Response } from "express";
import OpenAI from "openai";

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

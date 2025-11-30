import { Request, Response } from "express";
import OpenAI from "openai";

interface ChatMessage {
    role: "user" | "assistant" | "system";
    content: string;
}

interface Document {
    type: string;
    url: string;
}

interface ChatRequestBody {
    messages: ChatMessage[];
    documents: Document[];
}

const openai = newOpenAI ({
    apiKey: process.env.OPENAI_API_KEY,
});

export const sendChatMessage = async(
    req: Request<{},{},ChatRequestBody>,
    res:Response
): Promise<Response> => {
    try {
        const {messages,documents} = req.body;

        if (!messages || !Array.isArray(messages)){
            return res.status(400).json({
                error: "Messages array is required",
            });
        }
    }
}
)
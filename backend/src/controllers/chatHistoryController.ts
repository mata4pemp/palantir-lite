import { Request, Response } from "express";
import Chat from "../models/Chat";

//get all chats for a user
export const getUserChats = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user?.userId; //from auth middleware

    const chats = await Chat.find({ userId })
      .select("name createdAt updatedAt isPinned")
      .sort({ updatedAt: -1 });

    return res.json({ chats });
  } catch (error: any) {
    console.error("Get chats error:", error);
    return res.status(500).json({ error: "Failed to fetch chats" });
  }
};

//get a specific chat by ID
export const getChatById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user?.userId;
    const { chatId } = req.params;

    const chat = await Chat.findOne({ _id: chatId, userId });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    return res.json({ chat });
  } catch (error: any) {
    console.error("Get chat error", error);
    return res.status(500).json({ error: "Failed to fetch chat" });
  }
};

//create a new chat
export const createChat = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user?.userId;
    const { name, documents } = req.body;

    console.log("Creating chat with:", { userId, name, documents });

    const chat = await Chat.create({
      name: name || "Untitled Chat",
      userId,
      documents: documents || [],
      messages: [],
    });

    console.log("Chat created successfully:", chat._id);
    return res.status(201).json({ chat });
  } catch (error: any) {
    console.error("Create chat error:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    return res.status(500).json({ error: "failed to create chat", details: error.message });
  }
};

//update chat name
export const updateChatName = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user?.userId;
    const { chatId } = req.params;
    const { name } = req.body;

    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, userId },
      { name },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    return res.json({ chat });
  } catch (error: any) {
    console.error("Update chat error:", error);
    return res.status(500).json({ error: "Failed to update chat " });
  }
};

//update chat documents
export const updateChatDocuments = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user?.userId;
    const { chatId } = req.params;
    const { documents } = req.body;

    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, userId },
      { documents },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    return res.json({ chat });
  } catch (error: any) {
    console.error("Update chat documents error:", error);
    return res.status(500).json({ error: "Failed to update chat documents" });
  }
};

//add message to chat
export const addMessageToChat = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user?.userId;
    const { chatId } = req.params;
    const { role, content } = req.body;

    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, userId },
      {
        $push: {
          messages: {
            role,
            content,
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    return res.json({ chat });
  } catch (error: any) {
    console.error("Add message error:", error);
    return res.status(500).json({ error: "Failed to add message" });
  }
};

//delete a chat
export const deleteChat = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user?.userId;
    const { chatId } = req.params;

    const chat = await Chat.findOneAndDelete({ _id: chatId, userId });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    return res.json({ message: "Chat deleted successfully" });
  } catch (error: any) {
    console.error("Delete chat error:", error);
    return res.status(500).json({ error: "Failed to delete chat" });
  }
};

//toggle pin status of a chat
export const togglePinChat = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user?.userId;
    const { chatId } = req.params;
    const { isPinned } = req.body;

    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, userId },
      { isPinned },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    return res.json({ chat });
  } catch (error: any) {
    console.error("Toggle pin chat error:", error);
    return res.status(500).json({ error: "Failed to pin/unpin chat" });
  }
};

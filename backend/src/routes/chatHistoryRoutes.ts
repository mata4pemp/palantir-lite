import express from "express";
import {
  getUserChats,
  getChatById,
  createChat,
  updateChatName,
  updateChatDocuments,
  addMessageToChat,
  deleteChat,
} from "../controllers/chatHistoryController";
import { auth } from "../middleware/auth";

const router = express.Router();

//all routes protected with auth middleware
router.get("/", auth, getUserChats);
router.get("/:chatId", auth, getChatById);
router.post("/", auth, createChat);
router.put("/:chatId/name", auth, updateChatName);
router.put("/:chatId", auth, updateChatDocuments);
router.post("/:chatId/messages", auth, addMessageToChat);
router.delete("/:chatId", auth, deleteChat);

export default router;

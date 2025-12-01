import express from "express";
import { sendChatMessage } from "../controllers/chatController";
import { auth } from "../middleware/auth";

const router = express.Router();

//protected route requires auth
router.post("/chat", auth, sendChatMessage);

export default router;

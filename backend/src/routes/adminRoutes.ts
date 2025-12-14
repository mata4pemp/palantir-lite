import express from "express";
import { auth } from "../middleware/auth";
import { isAdmin } from "../middleware/isAdmin";
import {
  getAllUsers,
  getAllChats,
  getSystemStats,
} from "../controllers/adminController";

const router = express.Router();

// Admin-only routes
router.get("/users", auth, isAdmin, getAllUsers);
router.get("/chats", auth, isAdmin, getAllChats);
router.get("/stats", auth, isAdmin, getSystemStats);

export default router;

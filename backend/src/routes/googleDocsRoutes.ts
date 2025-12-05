import express from "express";
import {
  getGoogleDocTitle,
  getGoogleSheetTitle,
} from "../controllers/googleDocsController";
import { auth } from "../middleware/auth";

const router = express.Router();

// Protected routes
router.get("/doc/:docId", auth, getGoogleDocTitle);
router.get("/sheet/:sheetId", auth, getGoogleSheetTitle);

export default router;
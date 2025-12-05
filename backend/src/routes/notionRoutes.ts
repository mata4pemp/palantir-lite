import express from "express";
import { getNotionPageTitle } from "../controllers/notionController";
import { auth } from "../middleware/auth";

const router = express.Router();

// Protected route - POST because we're sending the URL in the body
router.post("/page/title", auth, getNotionPageTitle);

export default router;

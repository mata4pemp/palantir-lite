import express from "express";
import {
  processYoutubeVideo,
  getTranscript,
} from "../controllers/youtubeController";
import { auth } from "../middleware/auth";

const router = express.Router();

//protected routes
router.post("/process", auth, processYoutubeVideo);
router.get("/transcript/:videoId", auth, getTranscript);

export default router;

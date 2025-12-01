import { Request, Response } from "express";
import Transcript from "../models/Transcript";
import {
  extractVideoId,
  downloadYoutubeAudio,
  transcribeAudio,
} from "../services/youtubeService";

interface ProcessVideoRequestBody {
  videoUrl: string;
}

//process YT video and return the transcript
export const processYoutubeVideo = async (
  req: Request<{}, {}, ProcessVideoRequestBody>,
  res: Response
): Promise<Response> => {
  try {
    const { videoUrl } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorised" });
    }

    if (!videoUrl) {
      return res.status(400).json({ error: "Video URl is required." });
    }

    //extract video ID
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      return res.status(400).json({ error: "Invalid youtube URL " });
    }

    //check if transcript already exists in database
    const existingTranscript = await Transcript.findOne({ videoId });
    if (existingTranscript) {
      return res.json({
        message: "Transcript already exists",
        transcript: existingTranscript.transcript,
        videoId: existingTranscript.videoId,
        cached: true,
      });
    }

    //Download audio from Youtube
    const { audioStream, duration } = await downloadYoutubeAudio(videoUrl);

    //transcrube using Whisper
    const transcript = await transcribeAudio(audioStream, videoId);

    //save transcript to database
    const newTranscript = await Transcript.create({
      videoId,
      videoUrl,
      transcript,
      duration,
      userId,
    });

    return res.json({
      message: "Video processed successfully",
      transcript: newTranscript.transcript,
      videoId: newTranscript.videoId,
      duration: newTranscript.duration,
      cached: false,
    });
  } catch (error: any) {
    console.error("Process Youtube video error:", error);
    return res.status(500).json({
      error: error.message || "Failed to process Youtube video",
    });
  }
};

//get transcript by video ID
export const getTranscript = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { videoId } = req.params;

    const transcript = await Transcript.findOne({ videoId });

    if (!transcript) {
      return res.status(404).json({ error: "Transcript not found" });
    }

    return res.json({
      transcript: transcript.transcript,
      videoId: transcript.videoId,
      duration: transcript.duration,
    });
  } catch (error: any) {
    console.error("Get transcript error:", error);
    return res.status(500).json({ error: "Failed to retrieve transcript" });
  }
};

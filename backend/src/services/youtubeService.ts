import OpenAI from "openai";
import ytdl from "@distube/ytdl-core";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
//data structure that lets you receive data in small chunks overtime instead of loading it all at once

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const execAsync = promisify(exec);

//extract videoID from youtube URL
export const extractVideoId = (url: string): string | null => {
  try {
    const urlObj = new URL(url);

    //should be able to take in different youtube URL formats
    // Handle different YouTube URL formats
    // https://www.youtube.com/watch?v=VIDEO_ID
    // https://youtu.be/VIDEO_ID
    // https://www.youtube.com/embed/VIDEO_ID

    if (urlObj.hostname === "youtu.be") {
      return urlObj.pathname.slice(1); //remove leading slash
    }

    if (urlObj.hostname.includes("youtube.com")) {
      return urlObj.searchParams.get("v");
    }

    return null;
  } catch (error) {
    return null;
  }
};

//Download the audio from YT video
//Download the audio from YT video using yt-dlp
export const downloadYoutubeAudio = async (
  videoUrl: string
): Promise<{ audioPath: string; duration: number; title: string }> => {
  try {
    // Get video info to extract title and check duration
    const info = await ytdl.getInfo(videoUrl);
    const duration = parseInt(info.videoDetails.lengthSeconds);
    const title = info.videoDetails.title;

    // Check duration limit (2 hours = 7200 seconds)
    if (duration > 7200) {
      throw new Error("Video is too long. Max duration of video is 2 hours.");
    }

    // Create temp directory to store downloaded audio if it doesn't exist
    const tempDir = path.join(__dirname, "../../temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const audioPath = path.join(tempDir, `audio_${timestamp}.m4a`);

    // Download audio using yt-dlp
    const downloadCmd = `yt-dlp -f "bestaudio[ext=m4a]" -o "${audioPath}" "${videoUrl}"`;
    await execAsync(downloadCmd);

    return { audioPath, duration, title };
  } catch (error: any) {
    console.error("Error downloading Youtube audio:", error);
    throw new Error(`Failed to download audio: ${error.message}`);
  }
};

//transcribe the audio file using Whisper API
export const transcribeAudio = async (
  audioPath: string,
  videoId: string
): Promise<string> => {
  try {
    // Read the audio file
    const buffer = fs.readFileSync(audioPath);

    // Create a File object from the buffer
    const file = new File([buffer], `${videoId}.m4a`, {
      type: "audio/mp4",
    });

    // Call Whisper API
    const response = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      language: "en",
      response_format: "text",
    });

    // Clean up: delete the temp audio file
    fs.unlinkSync(audioPath);

    return response as unknown as string;
  } catch (error: any) {
    console.error("Error transcribing audio:", error);

    // Clean up temp file even if transcription fails
    if (fs.existsSync(audioPath)) {
      fs.unlinkSync(audioPath);
    }

    throw new Error(`Failed to transcribe audio: ${error.message}`);
  }
};

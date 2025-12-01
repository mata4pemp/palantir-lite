import ytdl from "ytdl-core";
import FormData from "form-data";
import OpenAI from "openai";
import { Readable } from "stream";
//data structure that lets you receive data in small chunks overtime instead of loading it all at once

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
export const downloadYoutubeAudio = async (
  videoUrl: string
): Promise<{ audioStream: Readable; duration: number }> => {
  try {
    //get video info to check duration
    const info = await ytdl.getInfo(videoUrl);
    const duration = parseInt(info.videoDetails.lengthSeconds);

    //limit to 2+ hours to prevent abuse of whisper
    if (duration > 7200) {
      throw new Error("Video is too long. Max duration of video is 2 hours.");
    }

    //Download the audio only
    const audioStream = ytdl(videoUrl, {
      quality: "lowestaudio", //smallest file size possible
      filter: "audioonly",
    });

    return { audioStream, duration };
  } catch (error: any) {
    console.error("Error downloading Youtube audio:", error);
    throw new Error(`Failed to download audio:${error.message}`);
  }
};

//transcribe the audio file using Whisper API
export const transcribeAudio = async (
  audioStream: Readable,
  videoId: string
): Promise<string> => {
  try {
    //Create form data for whisper API
    const formData = new FormData();

    //add audio stream to form data
    //name with .m4a extension
    formData.append("file", audioStream, {
      filename: `${videoId}.m4a`,
      contentType: "audio/mp4",
    });

    formData.append("model", "whisper-1");
    //append english to tell whisper assume video is in english, so it produces more accurate resutl, process faster,  i can change it to make it dynamicaly detect language too
    formData.append("language", "en");
    formData.append("response_format", "text");

    //call Whisper API
    const response = await openai.audio.transcriptions.create({
      file: audioStream as any,
      model: "whisper-1",
      language: "en",
      response_format: "text",
    });

    return response as unknown as string;
  } catch (error: any) {
    console.error("Error transcribing audio:", error);
    throw new Error(`Failed to transcribe audio: ${error.message}`);
  }
};

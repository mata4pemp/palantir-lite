import mongoose, { Document, Schema } from "mongoose";

export interface ITranscript extends Document {
  videoId: string;
  videoUrl: string;
  transcript: string;
  duration: number;
  title: string;
  language: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TranscriptSchema = new Schema<ITranscript>(
  {
    videoId: { //for faster lookup via video Id
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    transcript: { //store transcript so dont have to reprocess same video
      type: String,
      required: true,
    },
    duration: {
      type: Number, //video duration in seconds
      required: true,
    },
    language: {
      type: String,
      default: "en",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
        type:String,
        required: true,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITranscript>("Transcript", TranscriptSchema);

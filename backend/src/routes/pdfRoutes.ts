import { Router } from "express";
import multer from "multer";
import { auth } from "../middleware/auth";
import { uploadPDF } from "../controllers/pdfController";

const router = Router();

// Configure multer to store files in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

router.post("/upload", auth, upload.single("pdf"), uploadPDF);

export default router;

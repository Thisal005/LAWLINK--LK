// controllers/summarization.controller.js
import multer from "multer";
import pdfParse from "pdf-parse";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Summarization from "../models/summarization.model.js";
import Lawyer from "../models/lawyer.model.js";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import textToSpeech from "@google-cloud/text-to-speech"; 

dotenv.config();

const uploadDir = "uploads"; 
const audioDir = "audio";   
const credentialsPath = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);

[uploadDir, audioDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

if (!fs.existsSync(credentialsPath)) {
  console.error('Google Cloud credentials file not found!');
  process.exit(1);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage }).single("pdf");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const ttsClient = new textToSpeech.TextToSpeechClient({
  keyFilename: credentialsPath
});

export const summarizePDF = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: "File upload failed", error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No PDF file uploaded" });
    }

    try {
      const lawyerId = req.user._id;

      const lawyer = await Lawyer.findById(lawyerId);
      if (!lawyer) {
        return res.status(404).json({ message: "Lawyer not found" });
      }

      const summarizationCount = await Summarization.countDocuments({ lawyerId });
      if (summarizationCount >= 20) {
        return res.status(403).json({ message: "Summarization limit reached" });
      }

      // Extract text from PDF
      const data = await pdfParse(fs.readFileSync(req.file.path));
      const text = data.text;

      // Generate summary with error handling
      let summary;
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `Summarize the following text clearly and concisely to enhance documentation quality. 
                      Ensure the summary retains key information while improving readability and coherence. 
                      Present the content in a structured and well-organized manner without adding any special formatting, 
                      such as bold, italics, or symbols. ${text}`;
        
        const result = await model.generateContent(prompt);
        summary = result.response.text();
      } catch (error) {
        console.error("Gemini API error:", error);
        return res.status(500).json({ message: "Error generating summary" });
      }

      // Generate audio with error handling
      try {
        const audioFileName = `${req.file.filename}.mp3`;
        const audioFilePath = path.join(audioDir, audioFileName);

        const ttsRequest = {
          input: { text: summary },
          voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
          audioConfig: { audioEncoding: "MP3" },
        };

        const [ttsResponse] = await ttsClient.synthesizeSpeech(ttsRequest);
        fs.writeFileSync(audioFilePath, ttsResponse.audioContent, "binary");

        // Save summarization with audio reference
        const summarization = new Summarization({
          lawyerId,
          originalFilename: req.file.filename,
          summary,
          audioFileName, 
        });

        await summarization.save();

        const audioUrl = `/audio/${audioFileName}`;
        res.status(200).json({ summary, audioUrl });
      } catch (error) {
        console.error("Text-to-Speech API error:", error);
        // Still return summary even if audio generation fails
        res.status(200).json({ 
          summary, 
          audioUrl: null,
          warning: "Audio generation failed"
        });
      }
    } catch (error) {
      console.error("Summarization error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
};

export const getSummarizationHistory = async (req, res) => {
  try {
    const lawyerId = req.user._id;
    const history = await Summarization.find({ lawyerId }).sort({ createdAt: -1 });
    res.status(200).json(
      history.map((item) => ({
        ...item._doc,
        audioUrl: item.audioFileName ? `/audio/${item.audioFileName}` : null,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
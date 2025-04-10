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

// Define directories for file uploads and audio storage
const uploadDir = "Backend/uploads/pdf";
const audioDir = "Backend/audio";

// Resolve the path to Google Cloud credentials
const credentialsPath = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);

// Ensure required directories exist, create them if they don't
[uploadDir, audioDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Check if Google Cloud credentials file exists
if (!fs.existsSync(credentialsPath)) {
  console.error('Google Cloud credentials file not found!');
  process.exit(1);
}

// Configure Multer for handling PDF file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files in the upload directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname + "-" + uniqueSuffix + path.extname(file.originalname)); // Generate unique filenames
  },
});

const upload = multer({ storage: storage }).single("pdf");

// Initialize Google Generative AI and Text-to-Speech clients
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const ttsClient = new textToSpeech.TextToSpeechClient({
  keyFilename: credentialsPath,
});

// Controller function to summarize a PDF file
export const summarizePDF = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      // Handle file upload errors
      return res.status(400).json({ message: "File upload failed", error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No PDF file uploaded" });
    }

    try {
      const lawyerId = req.user._id;

      // Verify if the lawyer exists in the database
      const lawyer = await Lawyer.findById(lawyerId);
      if (!lawyer) {
        return res.status(404).json({ message: "Lawyer not found" });
      }

      // Check if the lawyer has reached the summarization limit
      const summarizationCount = await Summarization.countDocuments({ lawyerId });
      if (summarizationCount >= 50) {
        return res.status(403).json({ message: "Summarization limit reached" });
      }

      // Extract text content from the uploaded PDF
      const data = await pdfParse(fs.readFileSync(req.file.path));
      const text = data.text;

      // Generate a summary using Google Generative AI
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

      // Generate audio from the summary using Google Text-to-Speech
      try {
        const audioFileName = `${req.file.filename}.mp3`; 
        const audioFilePath = path.join(audioDir, audioFileName); 

        const ttsRequest = {
          input: { text: summary }, 
          voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" }, 
          audioConfig: { audioEncoding: "MP3" }, 
        };

        // Generate audio content and save it to a file
        const [ttsResponse] = await ttsClient.synthesizeSpeech(ttsRequest);
        fs.writeFileSync(audioFilePath, ttsResponse.audioContent, "binary");

        // Save summarization details in the database
        const summarization = new Summarization({
          lawyerId,
          originalFilename: req.file.filename,
          summary,
          audioFileName, 
        });

        await summarization.save();

        // Respond with the summary and audio URL
        const audioUrl = `/audio/${audioFileName}`;
        res.status(200).json({ summary, audioUrl });
      } catch (error) {
        console.error("Text-to-Speech API error:", error);
        // Respond with the summary but indicate audio generation failure
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

// Controller function to retrieve summarization history for a lawyer
export const getSummarizationHistory = async (req, res) => {
  try {
    const lawyerId = req.user._id;

    // Fetch summarization history from the database, sorted by creation date
    const history = await Summarization.find({ lawyerId }).sort({ createdAt: -1 });

    // Respond with the history, including audio URLs if available
    res.status(200).json(
      history.map((item) => ({
        ...item._doc,
        audioUrl: item.audioFileName ? `/audio/${item.audioFileName}` : null,
      }))
    );
  } catch (error) {
    console.error("Error fetching summarization history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
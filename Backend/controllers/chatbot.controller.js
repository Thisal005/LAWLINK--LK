import axios from "axios";
import { RateLimiterMemory } from "rate-limiter-flexible"; // This line caused the error
import { getCachedContent, refreshFileContent } from "../models/chatbot.model.js";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Rate limiter
const rateLimiter = new RateLimiterMemory({
  points: 100, // 100 requests
  duration: 60, // Per minute
});

// Logging utility
const log = (message, level = "info") => {
  const timestamp = new Date().toISOString();
  console[level](`[${timestamp}] ${message}`);
};

// Chat handler
const chatWithLegalBot = async (req, res) => {
  const { message } = req.body;
  const ip = req.ip || "unknown";

  try {
    await rateLimiter.consume(ip);
  } catch (rateError) {
    return res.status(429).json({ success: false, msg: "Too many requests, please try again later" });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ success: false, msg: "Gemini API key not configured" });
  }
  if (!message || typeof message !== "string") {
    return res.status(400).json({ success: false, msg: "Valid message is required" });
  }

  const cachedContent = await getCachedContent();
  const projectScope = `
    You are Lexi, a professional legal assistant for a Sri Lankan law case management platform.
    Your primary source for answering questions is this comprehensive knowledge base: ${cachedContent}.
    Use the knowledge base to craft detailed, accurate, and beautifully structured responses to legal and platform-related queries, such as Sri Lankan laws (e.g., Penal Code, Motor Traffic Act) or platform workflows.
    If the knowledge base lacks specific details, supplement with general Sri Lankan legal or platform context as a secondary measure:
    - <b>Client Workflow:</b> Log in, post up to 3 Pending cases (issue, district, case type), track statuses (Pending: gray, Ongoing: yellow-golden, Closed: red, Expired: dark gray), respond to lawyer interest with Yes/No, chat with lawyers when Ongoing, receive notifications (e.g., expiry after 14 days).
    - <b>Lawyer Workflow:</b> Sign up (admin verified), set district/case types (locked after first case), browse Pending cases and express interest, manage up to 3 Ongoing cases, add notes/tasks, close cases.
    Guidelines:
    - Prioritize the knowledge base for all answers, ensuring responses are rooted in its content.
    - Format responses professionally with bullet points ("•") for main points and indented sub-points ("◦") for details.
    - Use "<b>bold</b>" tags to highlight key terms or headings for elegance and clarity.
    - Do not include the user's question in the response; provide the answer directly.
    - Do not suggest clients can search for lawyers; lawyers browse and express interest in client-posted cases.
    - Provide actionable, precise advice for legal matters (e.g., accidents, disputes) based on the knowledge base.
    - Only use "I'm Lexi, focused on legal matters..." for questions clearly unrelated to legal issues or the platform (e.g., weather, sports).
    - Avoid unnecessary introductions; deliver polished, concise answers unless a greeting is requested.
  `;

  const lowerMessage = message.toLowerCase().trim();

  // Predefined responses
  if (["hi", "hello", "hey"].includes(lowerMessage)) {
    const greetings = [
      "<b>Welcome!</b> Greetings! I'm here to assist you with your legal needs in a professional manner.",
      "<b>Good Day!</b> Hello! I'm Lexi, your dedicated legal companion. How may I serve you?",
      "<b>Hello!</b> Hi! Welcome to your Sri Lankan legal assistant. I'm ready to help you elegantly and efficiently.",
    ];
    return res.status(200).json({ success: true, response: greetings[Math.floor(Math.random() * 3)] });
  }
  if (lowerMessage === "what can you do") {
    return res.status(200).json({
      success: true,
      response: `
        <b>My Capabilities:</b><br>
        • Deliver detailed legal answers from an extensive knowledge base.<br>
        • Assist clients in posting up to 3 Pending cases and tracking their progress with finesse.<br>
        • Guide lawyers in browsing Pending cases and managing up to 3 Ongoing cases with precision.<br>
        • Provide beautifully structured explanations of platform workflows and Sri Lankan laws.<br>
        <b>Next Step:</b> How may I assist you today with elegance and expertise?
      `,
    });
  }
  if (lowerMessage.includes("how do i find a lawyer")) {
    return res.status(200).json({
      success: true,
      response: `
        <b>Platform Process:</b><br>
        • This platform operates uniquely—clients don't search for lawyers directly.<br>
        • <b>Step 1:</b> Post your case (up to 3 Pending cases) with details such as issue, district, and case type.<br>
        • <b>Step 2:</b> Lawyers browse Pending cases based on their predefined districts and case types.<br>
        • <b>Step 3:</b> If a lawyer expresses interest, you'll receive a notification to accept (Yes) or decline (No).<br>
        • <b>Step 4:</b> Upon acceptance, your case becomes Ongoing, enabling seamless communication with the lawyer.<br>
        <b>Ready to Begin?</b> Shall I guide you through posting a case with professionalism?
      `,
    });
  }

  // Gemini API call
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `${projectScope}\n\nUser question: ${message}\n\nAnswer directly using the knowledge base as the primary source. Format the response beautifully with bullet points and bold tags, without echoing the user's question.`,
              },
            ],
          },
        ],
        generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        ],
      },
      { headers: { "Content-Type": "application/json" } }
    );

    if (!response.data?.candidates || response.data.candidates.length === 0) {
      throw new Error("No response from Gemini API");
    }

    let reply = response.data.candidates[0]?.content?.parts[0]?.text || "Sorry, I couldn't find a specific answer in the knowledge base.";
    const scopeLines = projectScope.split("\n");
    reply = reply
      .split("\n")
      .filter(line => !scopeLines.some(scopeLine => scopeLine.trim() === line.trim()))
      .join("\n")
      .trim();

    reply = reply.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
    if (!reply.includes("•") && reply.length > 50) {
      reply = "<b>Response:</b><br>" + reply.split(". ").map(line => `• ${line.trim()}.`).join("<br>");
    } else if (!reply.includes("<b>Response:</b>")) {
      reply = `<b>${reply}`;
    }
    reply = reply.replace(/\n/g, "<br>");

    const legalKeywords = ["law", "case", "platform", "legal", "lawyer", "client", "accident", "injury", "court", "claim", "police", "damage", "penal", "civil", "family", "labour"];
    if (!legalKeywords.some(keyword => lowerMessage.includes(keyword))) {
      reply = `
        • I'm Lexi, dedicated to legal matters and this esteemed platform.<br>
        • Your question appears unrelated to legal issues or platform services.<br>
        • <b>How may I assist?</b> Please let me guide you with a case or legal query in a professional manner.
      `;
    }

    if (!reply.includes("How may I assist") && !reply.includes("Next Step")) {
      reply += "<br><br><b>Next Step:</b> How may I further assist you with this matter?";
    }

    res.status(200).json({ success: true, response: reply });
  } catch (error) {
    log(`Gemini Error: ${error.message}`, "error");
    let errorMessage = "Failed to process request";
    if (error.response?.data?.error?.message) {
      errorMessage = `Error: ${error.response.data.error.message}`;
    }
    res.status(500).json({
      success: false,
      msg: errorMessage,
      response: "• Apologies, an issue occurred while processing your request.<br>• Please try again in a moment.",
    });
  }
};

// Initialize chatbot
const initChatbot = async (req, res) => {
  try {
    await getCachedContent();
    res.json({
      success: true,
      welcome: "<b>Welcome!</b> Hello! I’m Lexi, your professional assistant for Sri Lankan law and case management.",
    });
  } catch (error) {
    log(`Init failed: ${error.message}`, "error");
    res.status(500).json({ success: false, error: "Failed to initialize Lexi" });
  }
};

// File upload handler
const uploadChatbotFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, msg: "No file uploaded" });
  }

  try {
    await refreshFileContent();
    res.status(200).json({ success: true, msg: "File uploaded successfully" });
  } catch (error) {
    log(`Upload refresh failed: ${error.message}`, "error");
    res.status(500).json({ success: false, msg: "Failed to process uploaded file" });
  }
};

// Health check
const healthCheck = async (req, res) => {
  const content = await getCachedContent();
  res.status(200).json({
    success: true,
    status: "healthy",
    cachedContentLength: content.length,
    lastRefresh: new Date(lastRefreshTime).toISOString(),
  });
};

export { chatWithLegalBot, uploadChatbotFile, initChatbot, healthCheck };
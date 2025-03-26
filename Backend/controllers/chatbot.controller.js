import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pdfParse from "pdf-parse";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let cachedFileContent = "";
let lastRefreshTime = 0;
const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes

// Create a default knowledge base if none exists
const createDefaultKnowledgeBase = async () => {
  const fileDir = path.join(__dirname, "../ChatbotFiles");
  const defaultFilePath = path.join(fileDir, "sri_lankan_legal_knowledge.txt");
  
  if (!fs.existsSync(fileDir)) {
    fs.mkdirSync(fileDir, { recursive: true });
  }
  
  if (!fs.existsSync(defaultFilePath)) {
    console.log("Creating default knowledge base file...");
    
    const defaultContent = `# Sri Lankan Legal Knowledge Base

## Penal Code of Sri Lanka

### Introduction
The Penal Code of Sri Lanka (Chapter 19) is the main criminal code of Sri Lanka. It outlines criminal offenses, procedures, and penalties applicable within the jurisdiction. The code was first enacted in 1883 during the British colonial period and has undergone numerous amendments since then.

### Key Sections

#### Section 293 - Homicide
• <b>Definition:</b> Causing of death of a human being by another human being.
• <b>Categories:</b>
  ◦ Culpable homicide - When death is caused with the intention of causing death.
  ◦ Murder - Culpable homicide becomes murder when done with premeditation.
• <b>Punishment:</b> Death penalty or life imprisonment for murder, imprisonment up to 20 years for culpable homicide not amounting to murder.

#### Section 350-365 - Theft and Related Offenses
• <b>Theft (Section 350):</b> Dishonest taking of property without consent.
  ◦ Punishment: Imprisonment up to 3 years.
• <b>Robbery (Section 358):</b> Theft with force or threat of force.
  ◦ Punishment: Imprisonment up to 10 years.
• <b>Extortion (Section 364):</b> Obtaining property through threats.
  ◦ Punishment: Imprisonment up to 7 years.

#### Section 300-308 - Assault and Criminal Force
• <b>Assault:</b> Making any gesture or preparation intending to cause reasonable apprehension of criminal force.
• <b>Criminal Force:</b> Intentionally using force on another person without their consent.
• <b>Punishment:</b> Varies from 1 to 5 years imprisonment depending on severity.

## Motor Traffic Act of Sri Lanka

### Introduction
The Motor Traffic Act (No. 14 of 1951) regulates the registration, licensing, and operation of motor vehicles in Sri Lanka. The act is administered by the Department of Motor Traffic.

### Key Provisions

#### Vehicle Registration
• All motor vehicles must be registered with the Department of Motor Traffic.
• Requirements include:
  ◦ Certificate of origin or previous registration
  ◦ Insurance certificate
  ◦ Revenue license
  ◦ Certificate of roadworthiness

#### Driving Licenses
• <b>Categories:</b>
  ◦ Class A: Motorcycles
  ◦ Class B: Light vehicles (cars, vans up to 12 passengers)
  ◦ Class C: Commercial vehicles (trucks, lorries)
  ◦ Class D: Heavy vehicles (buses over 12 passengers)
• <b>Requirements:</b>
  ◦ Minimum age: 18 years
  ◦ Medical fitness certificate
  ◦ Successful completion of written and practical tests

#### Traffic Violations and Penalties
• <b>Drunk Driving:</b>
  ◦ Legal limit: 80mg of alcohol per 100ml of blood
  ◦ Penalties: Fine up to LKR 25,000 and/or imprisonment up to 2 years
• <b>Speeding:</b>
  ◦ Urban areas: 50 km/h maximum
  ◦ Highways: 100 km/h maximum
  ◦ Penalties: Fine up to LKR 3,000 for first offense, higher for repeat offenders`;
    
    fs.writeFileSync(defaultFilePath, defaultContent, "utf8");
    console.log("✅ Default knowledge base file created");
  }
};

const refreshFileContent = async () => {
  const fileDir = path.join(__dirname, "../ChatbotFiles");
  console.log("📂 File Directory:", fileDir);
  let newContent = "";
  
  try {
    if (!fs.existsSync(fileDir)) {
      console.log("ChatbotFiles directory not found, creating it...");
      fs.mkdirSync(fileDir, { recursive: true });
      await createDefaultKnowledgeBase();
    }
    
    const files = fs.readdirSync(fileDir).filter((file) => file.endsWith(".pdf") || file.endsWith(".txt"));
    console.log("📜 Files Found:", files);
    
    if (files.length === 0) {
      await createDefaultKnowledgeBase();
      const retryFiles = fs.readdirSync(fileDir).filter((file) => file.endsWith(".pdf") || file.endsWith(".txt"));
      
      if (retryFiles.length === 0) {
        newContent = "Default content: This is a Sri Lankan legal case management platform.";
      }
    }
    
    for (const file of files) {
      const filePath = path.join(fileDir, file);
      console.log("Reading file:", filePath);
      if (file.endsWith(".txt")) {
        const data = fs.readFileSync(filePath, "utf8");
        newContent += `\n\n--- Content from ${file} (TXT) ---\n${data}`;
      } else if (file.endsWith(".pdf")) {
        try {
          const dataBuffer = fs.readFileSync(filePath);
          const data = await pdfParse(dataBuffer);
          newContent += `\n\n--- Content from ${file} (PDF) ---\n${data.text}`;
        } catch (pdfError) {
          console.error(`Error parsing PDF file ${file}:`, pdfError.message);
          newContent += `\n\n--- Content from ${file} (PDF) ---\nUnable to parse PDF content.`;
        }
      }
    }
  } catch (error) {
    console.error("Error reading files:", error.message);
    newContent = "Default content: This is a Sri Lankan legal case management platform.";
    try {
      await createDefaultKnowledgeBase();
    } catch (createError) {
      console.error("Error creating default knowledge base:", createError.message);
    }
  }
  
  if (newContent.trim().length === 0) {
    newContent = "Default content: This is a Sri Lankan legal case management platform.";
  }
  
  cachedFileContent = newContent;
  lastRefreshTime = Date.now();
  console.log("✅ File content refreshed. Length:", cachedFileContent.length);
};

// Initial load
refreshFileContent();

const chatWithLegalBot = async (req, res) => {
  const { message } = req.body;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ success: false, msg: "Gemini API key not configured" });
  }

  if (!message) {
    return res.status(400).json({ success: false, msg: "Message is required" });
  }

  if (Date.now() - lastRefreshTime > REFRESH_INTERVAL || cachedFileContent.length < 100) {
    try {
      await refreshFileContent();
    } catch (refreshError) {
      console.error("Error refreshing content:", refreshError.message);
    }
  }

  const projectScope = `
    You are Lexi, a professional legal assistant for a Sri Lankan law case management platform.
    Your primary source for answering questions is this comprehensive knowledge base: ${cachedFileContent}.
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

  // Minimal Predefined Responses
  if (["hi", "hello", "hey"].includes(lowerMessage)) {
    const greetings = [
      "<b>Welcome!</b> Greetings! I'm here to assist you with your legal needs in a professional manner.",
      "<b>Good Day!</b> Hello! I'm Lexi, your dedicated legal companion. How may I serve you?",
      "<b>Hello!</b> Hi! Welcome to your Sri Lankan legal assistant. I'm ready to help you elegantly and efficiently.",
    ];
    return res.status(200).json({ success: true, response: greetings[Math.floor(Math.random() * 3)] });
  }

  if (lowerMessage === "what can you do") {
    const response = `
      <b>My Capabilities:</b><br>
      • Deliver detailed legal answers from an extensive knowledge base.<br>
      • Assist clients in posting up to 3 Pending cases and tracking their progress with finesse.<br>
      • Guide lawyers in browsing Pending cases and managing up to 3 Ongoing cases with precision.<br>
      • Provide beautifully structured explanations of platform workflows and Sri Lankan laws.<br>
      <b>Next Step:</b> How may I assist you today with elegance and expertise?
    `;
    return res.status(200).json({ success: true, response });
  }

  if (lowerMessage.includes("how do i find a lawyer")) {
    const response = `
      <b>Platform Process:</b><br>
      • This platform operates uniquely—clients don't search for lawyers directly.<br>
      • <b>Step 1:</b> Post your case (up to 3 Pending cases) with details such as issue, district, and case type.<br>
      • <b>Step 2:</b> Lawyers browse Pending cases based on their predefined districts and case types.<br>
      • <b>Step 3:</b> If a lawyer expresses interest, you'll receive a notification to accept (Yes) or decline (No).<br>
      • <b>Step 4:</b> Upon acceptance, your case becomes Ongoing, enabling seamless communication with the lawyer.<br>
      <b>Ready to Begin?</b> Shall I guide you through posting a case with professionalism?
    `;
    return res.status(200).json({ success: true, response });
  }

  // Gemini API Call
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: `${projectScope}\n\nUser question: ${message}\n\nAnswer directly using the knowledge base as the primary source. Format the response beautifully with bullet points and bold tags, without echoing the user's question.` },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024,
        },
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
    
    // Clean up scope leakage
    const scopeLines = projectScope.split("\n");
    reply = reply.split("\n")
      .filter(line => !scopeLines.some(scopeLine => scopeLine.trim() === line.trim()))
      .join("\n")
      .trim();

    // Ensure professional formatting
    reply = reply.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
    if (!reply.includes("•") && reply.length > 50) {
      reply = "<b>Response:</b><br>" + 
        reply.split(". ")
          .filter(line => line.trim())
          .map(line => `• ${line.trim()}.`)
          .join("<br>");
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
    console.error("Gemini Error:", error.response?.data || error.message);
    let errorMessage = "Failed to process request";
    if (error.response?.data?.error?.message) {
      errorMessage = `Error: ${error.response.data.error.message}`;
    }
    
    res.status(500).json({ 
      success: false, 
      msg: errorMessage,
      response: "• Apologies, an issue occurred while processing your request.<br>• Please try again in a moment."
    });
  }
};

const initChatbot = async (req, res) => {
  try {
    if (Date.now() - lastRefreshTime > REFRESH_INTERVAL) {
      await refreshFileContent();
    }
    const welcome = "<b>Welcome!</b> Hello! I’m Lexi, your professional assistant for Sri Lankan law and case management.";
    res.json({ success: true, welcome });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to initialize Lexi" });
  }
};

const uploadChatbotFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, msg: "No file uploaded" });
  }
  refreshFileContent();
  res.status(200).json({ success: true, msg: "File uploaded successfully" });
};

export { chatWithLegalBot, uploadChatbotFile, initChatbot };
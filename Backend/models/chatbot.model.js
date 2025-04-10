import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pdfParse from "pdf-parse";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const CACHE_MIN_LENGTH = 100;

// State
let cachedFileContent = "";
let lastRefreshTime = 0;

// Logging utility
const log = (message, level = "info") => {
  const timestamp = new Date().toISOString();
  console[level](`[${timestamp}] ${message}`);
};

// Create default knowledge base
const createDefaultKnowledgeBase = async () => {
  const fileDir = path.join(__dirname, "../../ChatbotFiles");
  const defaultFilePath = path.join(fileDir, "sri_lankan_legal_knowledge.txt");

  try {
    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true });
      log("Created ChatbotFiles directory");
    }

    if (!fs.existsSync(defaultFilePath)) {
      log("Creating default knowledge base file...");
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

## Motor Traffic Act of Sri Lanka
### Introduction
The Motor Traffic Act (No. 14 of 1951) regulates the registration, licensing, and operation of motor vehicles in Sri Lanka. The act is administered by the Department of Motor Traffic.

### Key Provisions
#### Driving Licenses
• <b>Categories:</b>
  ◦ Class A: Motorcycles
  ◦ Class B: Light vehicles (cars, vans up to 12 passengers)
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
      log("✅ Default knowledge base file created");
    }
  } catch (error) {
    log(`Failed to create default knowledge base: ${error.message}`, "error");
    throw error;
  }
};

// Refresh file content
const refreshFileContent = async () => {
  const fileDir = path.join(__dirname, "../../ChatbotFiles");
  let newContent = "";

  try {
    if (!fs.existsSync(fileDir)) {
      log("ChatbotFiles directory not found, creating...");
      await createDefaultKnowledgeBase();
    }

    const files = fs.readdirSync(fileDir)
      .filter(file => /\.(pdf|txt)$/i.test(file))
      .filter(file => fs.statSync(path.join(fileDir, file)).size <= MAX_FILE_SIZE);
    log(`📜 Files found: ${files.length ? files.join(", ") : "None"}`);

    if (files.length === 0) {
      await createDefaultKnowledgeBase();
      const retryFiles = fs.readdirSync(fileDir).filter(file => /\.(pdf|txt)$/i.test(file));
      if (retryFiles.length === 0) {
        newContent = "Default content: This is a Sri Lankan legal case management platform.";
      }
    }

    for (const file of files) {
      const filePath = path.join(fileDir, file);
      log(`Reading file: ${file}`);

      if (file.endsWith(".txt")) {
        newContent += `\n\n--- Content from ${file} (TXT) ---\n${fs.readFileSync(filePath, "utf8")}`;
      } else if (file.endsWith(".pdf")) {
        try {
          const dataBuffer = fs.readFileSync(filePath);
          const data = await pdfParse(dataBuffer);
          newContent += `\n\n--- Content from ${file} (PDF) ---\n${data.text}`;
        } catch (pdfError) {
          log(`Error parsing PDF ${file}: ${pdfError.message}`, "error");
          newContent += `\n\n--- Content from ${file} (PDF) ---\n[Error: Unable to parse PDF]`;
        }
      }
    }

    cachedFileContent = newContent.trim() || "Default content: Sri Lankan legal case management platform.";
    lastRefreshTime = Date.now();
    log(`✅ File content refreshed. Length: ${cachedFileContent.length}`);
  } catch (error) {
    log(`Error refreshing content: ${error.message}`, "error");
    cachedFileContent = "Default content: Sri Lankan legal case management platform.";
    await createDefaultKnowledgeBase();
  }
};

// Get cached content with refresh check
const getCachedContent = async () => {
  if (Date.now() - lastRefreshTime > REFRESH_INTERVAL || cachedFileContent.length < CACHE_MIN_LENGTH) {
    await refreshFileContent();
  }
  return cachedFileContent;
};

// Initial load
(async () => {
  try {
    await refreshFileContent();
  } catch (error) {
    log(`Initial load failed: ${error.message}`, "error");
  }
})();

export { getCachedContent, refreshFileContent };
import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";

export const processPDF = async (filePath) => {
    try {
        console.log("📂 Processing file:", filePath);

        // Ensure correct path
        const absolutePath = path.resolve(filePath);

        if (!fs.existsSync(absolutePath)) {
            throw new Error("File not found: " + absolutePath);
        }

        const dataBuffer = fs.readFileSync(absolutePath);
        const data = await pdfParse(dataBuffer);
        return data.text;
    } catch (error) {
        throw new Error("Failed to process PDF: " + error.message);
    }
};